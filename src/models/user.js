const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const randtoken = require('rand-token')
const jwt = require('jsonwebtoken')
const {CUISINES} = require('../utils/constants')

const userSchema = new mongoose.Schema( {
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase:true,
        trim: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        trim: true,
        minlength: 8,
        validate(value) {
            if(value.toLowerCase().includes('password')){
                throw new Error('Password must not contain the word password')
            }
        }
    },
    bio: {
        type: String
    },
    favouriteCuisine: {
        type: String,
        enum: CUISINES
    },
    avatar: {
        type: Buffer
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String,
    },
    tokens: [{
        token:{
            type:String,
            required: true
        }
    }],
    favourites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe'
    }]
}, {
    timestamps:true
})

userSchema.virtual('recipes',{
    ref: 'Recipe',
    localField: '_id',
    foreignField: 'creator'
})

userSchema.virtual('comments',{
    ref: 'Comment',
    localField: '_id',
    foreignField: 'userId'
})

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if(!user){
        throw new Error('Unable to Login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
        throw new Error('Unable to Login')
    }

    return user

}

userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({_id:user._id.toString()}, process.env.JWT_SECRET)

    user.tokens.push({token})
    
    await user.save()

    return token
}

userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    delete userObject.tempVerificationToken

    return userObject
}

userSchema.pre('save', async function(next) {
    const user = this
    
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }

    if(!user.isVerified){
        user.verificationToken = randtoken.generate(20)
    }
    next()

})

const User = mongoose.model('User', userSchema)

module.exports = User