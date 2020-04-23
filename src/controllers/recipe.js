const mongoose = require('mongoose')
const Recipe = require('../models/recipe')
const {convertImage} = require('../utils/file-upload')
const constants = require('../utils/constants')
const helpers = require('../utils/helpers')

exports.recipeCreate = async (req, res) => {
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

exports.recipeUpdate = async (req, res) => {
    try {
        const _id = req.params.id
        const updates = Object.keys(req.body)
        const isUpdateAllowed = helpers.checkIfValidUpdate(updates, constants.RECIPE_ALLOWED_UPDATES)

        if(!isUpdateAllowed){
            return res.status(400).send({error: "Invalid Updates"})
        }
        
        const recipe = await Recipe.findOneAndUpdate({
            _id: mongoose.Types.ObjectId(_id),
            creator: mongoose.Types.ObjectId(req.user._id)
        }, req.body, {new:true})

        if(!recipe){
            return res.status(404).send({error: "Cannot find recipe"})
        }

        res.send(recipe)

    } catch(e) {
        res.status(500).send({error: e.message})
    }
}

exports.recipeGet = async (req, res) => {
    try{
        const recipes = await Recipe.find({
        ...req.query.owner === 'me' ? { creator: req.user._id } : {$or: [{ creator: req.user._id },{ isPublic: true }]},
        ...req.query.name ? { name: new RegExp(req.query.name,"i") } : {},
        ...req.query.rating ? { rating: {$gte: req.query.rating}} : {},
        ...req.query.cuisine ? { cuisine: req.query.cuisine} : {},
        ...req.query.ingredients ? {'ingredients.ingredient': {$all: req.query.ingredients.split(',')}  } : {}
        }).collation({ "locale": "en", "strength": 2 })

        console.log(recipes)
        if(recipes.length === 0){
            return res.status(404).send({error: "No recipes found"})
        }

        res.send(recipes)
    } catch(e) {
        res.status(500).send({error: e.message})
    }
}

exports.recipeGetOne = async (req, res) => {
    try {
        const recipe = await Recipe.findOne({
            $or: [{ creator: req.user._id },{ isPublic: true }],
            _id: req.params.id,
        })

        if(!recipe){
            return res.status(404).send({error: "Recipe not found"})
        }

        res.send(recipe)
    } catch(e) {
        res.status(500).send({error: e.message})
    }
}