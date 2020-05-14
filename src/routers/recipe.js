const express = require('express')
const recipeController = require('../controllers/recipe')
const Recipe = require('../models/user')
const auth = require('../middleware/auth')
const {upload} = require('../utils/file-upload')

const router = new express.Router()

router.post('/recipes/create', auth, upload.fields([{name: 'image', maxCount: 1}, {name: 'video', maxCount: 1}]), recipeController.recipeCreate)

router.patch('/recipes/update/:id', auth, recipeController.recipeUpdate)

router.get('/recipes', auth, recipeController.recipeGet)

router.get('/recipes/:id', auth, recipeController.recipeGetOne)

router.delete('/recipes/:id', auth, recipeController.recipeDelete)

router.patch('/recipes/rating/:id', auth, recipeController.recipeRate)

module.exports = router