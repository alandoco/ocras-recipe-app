const mongoose = require('mongoose')
const {CUISINES} = require('./constants')
const {MEASUREMENTS} = require('./constants')
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
    Ingredients: [{
        amount:{
            type: Number,
            required: true
        },
        unit: {
            type: String
        },
        ingredient: {
            type: String,
            enum: MEASUREMENTS
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

module.exports = {
    Recipe
}