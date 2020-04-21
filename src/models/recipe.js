const mongoose = require('mongoose')
const {CUISINES} = require('../constants/index')
const {MEASUREMENTS} = require('../constants/index')
const recipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: Buffer
    },
    cuisine: {
        type: String,
        enum: CUISINES
    },
    rating: {
        type: Number,
        default: 0
    },
    numRatings: {
        type:Number,
        default: 0
    },
    servings: {
        type: Number
    },
    ingredients: [{
        amount:{
            type: Number
        },
        unit: {
            type: String,
            lowercase: true,
            enum: MEASUREMENTS
        },
        ingredient: {
            type: String,
            required: true
        }
    }],
    method:[{
        step:{
        type:Number
        },
        instruction:{
            type: String,
            required: true
        }
    }],
    isVerified: {
        type: Boolean,
        default: false
    },
    temporaryVerificationToken: {
        type: String
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Recipe'
    }
}, {
    timestamps:true
})

recipeSchema.virtual('User', {
    ref: 'Recipe',
    localField: '_id',
    foreignField: 'favourites'
})

const Recipe = mongoose.model('Recipe', recipeSchema)

module.exports = Recipe