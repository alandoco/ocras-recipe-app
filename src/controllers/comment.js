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