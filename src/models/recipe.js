const mongoose = require('mongoose')
const {CUISINES} = require('../utils/constants')
const {MEASUREMENTS} = require('../utils/constants')
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
    isPublic: {
        type: Boolean,
        default: false
    },
    totalTime: {
        type: Number,
        required: true
    },
    temperature: {
        type: String,
        enum: ['Hot', 'Cold']
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

recipeSchema.virtual('comments',{
    ref: 'Comment',
    localField: '_id',
    foreignField: 'recipeId'
})

recipeSchema.methods.toJSON = function () {
    const recipeObject = this.toObject()

    delete recipeObject.creator

    return recipeObject

}

const Recipe = mongoose.model('Recipe', recipeSchema)

module.exports = Recipe