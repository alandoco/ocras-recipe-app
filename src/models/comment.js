const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true,
        maxLength: 160
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        unique: true
    }],
    dislikes: [{
        type: mongoose.Schema.Types.ObjectId,
        unique: true
    }],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    recipeId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
}, {
    timestamps: true
})

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment