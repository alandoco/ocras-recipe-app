const express = require('express')
const recipeController = require('../controllers/recipe')
const Recipe = require('../models/user')
const auth = require('../middleware/auth')
const {upload} = require('../utils/file-upload')

const router = new express.Router()

router.post('/recipes/create', auth, upload.single('image'), recipeController.recipeCreate)

router.patch('/recipes/update/(:id)', auth, recipeController.recipeUpdate)

router.get('/recipes', auth, recipeController.recipeGet)

// router.delete('/recipes', auth, recipeController.recipeCreate)

module.exports = router