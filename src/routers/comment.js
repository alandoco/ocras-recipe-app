const express = require('express')
const Comment = require('../models/comment')
const commentController = require('../controllers/comment')
const auth = require('../middleware/auth')
const { checkIsRecipePublic } = require('../middleware/document-access')
const { checkCommentOwner } = require('../middleware/document-access')


const router = new express.Router()

router.get('/comments/me', auth, commentController.getMyComments)

router.post('/comments/:recipeId', auth, checkIsRecipePublic, commentController.addComment)

router.patch('/comments/:commentId', auth, checkCommentOwner, commentController.updateComment)

module.exports = router