const Recipe = require('../models/recipe')
const Comment = require('../models/comment')

const checkIsRecipePublic = async (req, res, next) => {
    try {
        const recipe = await Recipe.findOne({_id: req.params.recipeId, $or: [{ creator: req.user._id },{ isPublic: true }]})
        if(!recipe){
            //Don't want to give any info on recipe so just send back Unable to Find
            throw new Error()
        }
        next()
    } catch (e){
        res.status(500).send({error: "Unable to find recipe"})
    }
}

const checkCommentOwner = async (req, res, next) => {
    try {
        //Checking if comment is from currently authenticated user
        const comment = await Comment.findOne({_id: req.params.commentId, userId: req.user._id})

        if(!comment){
            throw new Error()
        }

        req.comment = comment
        next()
    } catch (e) {
        res.status(500).send({error: "Unable to find comment"})
    }
}

module.exports = {
    checkIsRecipePublic,
    checkCommentOwner
}