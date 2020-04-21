const mongoose = require('mongoose')
const Recipe = require('../models/recipe')
const {convertImage} = require('../utils/file-upload')

exports.recipeCreate = async (req, res, next) => {
    try {
        req.body.ingredients = JSON.parse(req.body.ingredients)
        req.body.method = JSON.parse(req.body.method)
        req.body.avatar = await convertImage(req.file.buffer)
        req.body.creator = mongoose.Types.ObjectId(req.user._id)

        const recipe = new Recipe(req.body)

        await recipe.save()
        res.send(recipe)
    } catch(e) {
        res.status(500).send(e)
    }
}