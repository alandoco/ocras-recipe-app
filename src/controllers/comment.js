const Comment = require('../models/comment')

exports.addComment = async (req, res) => {
    try {
        const comment = new Comment({
            comment: req.body.comment,
            userId: req.user._id,
            recipeId: req.params.recipeId 
        })
        
        await comment.save()
        res.send(comment)
    } catch (e) {
        res.status(500).send({error: e.message})
    }
}

exports.updateComment = async (req, res) => {
    try {
        req.comment.comment = req.body.comment

        await req.comment.save()

        res.send(req.comment)
    } catch (e) {
        res.status(500).send({error: e.message})
    }
}

exports.deleteComment = async(req, res) => {
    try {
        await Comment.findByIdAndDelete(req.params.commentId)

        res.send()
    } catch (e) {
        res.status(500).send({e: e.message})
    }
}

exports.getMyComments = async (req, res) => {
    try{    
        const myComments = await Comment.find({userId: req.user._id})

        if(!myComments){
            return res.status(404).send({error: "You have not made any comments"})
        }

        res.send(myComments)

    } catch (e) {           
        res.status(500).send({error: e.message})
    }
}

exports.reactionToComment = async (req, res) => {
    try {

        if(!req.body.action){
            throw new Error()
        }

        const reactionToAdd = req.body.action === 'like' ? { likes: req.user._id } : { dislikes: req.user._id }

        const comment = await Comment.findByIdAndUpdate({
                _id: req.params.commentId
            },{
                $addToSet: reactionToAdd //Add to set ignores if value is already in array
            }, {new:true})
        
        res.send({likes: comment.likes.length, dislikes: comment.dislikes.length})
        
    } catch (e) {
        res.status(500).send({error: e.message})
    }
}   

// const setLikeStatus = (action) => {
//     if(action === 'like'){
//         return type === 'undo' ? -1 + 
//     }
// }