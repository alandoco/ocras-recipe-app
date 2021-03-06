const mongoose = require('mongoose')
const Recipe = require('../models/recipe')
const {convertImage} = require('../utils/file-handling')
const {uploadToS3} = require('../utils/file-handling')
const {downloadFromS3} = require('../utils/file-handling')
const constants = require('../utils/constants')
const helpers = require('../utils/helpers')

exports.recipeCreate = async (req, res) => {
    try {

        //Need to parse data as it will be coming through as multipart-form rather than JSON
        req.body.ingredients = JSON.parse(req.body.ingredients)
        req.body.method = JSON.parse(req.body.method)
        req.body.creator = mongoose.Types.ObjectId(req.user._id)

        if(req.files.image){
            if(!req.files.image[0].originalname.match(/\.(jpg|jpeg|png)$/)){
                return res.status(400).send({error: 'Image must be in jpg, jpeg or png format'})
            }

            req.body.image = await convertImage(req.files.image[0].buffer)
        }

        if(req.files.video){

            if(!req.files.video[0].originalname.match(/\.(mp4)$/)){
                return res.status(400).send({error: 'Video must be in mp4 format'})
            }
            const data = await uploadToS3(req.files.video[0])

            if(data.err){
                return res.status(400).send({error: 'Video upload failed'})
            }

            req.body.videoKey = data.data.Key
        }

        const recipe = new Recipe(req.body)

        await recipe.save()
        res.send(recipe)
    } catch(e) {
        res.status(500).send({error: e.message})
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

        if(recipe.videoKey){
            videoUrl = await downloadFromS3(recipe.videoKey)
            return res.send({recipe, videoUrl})
        }

        res.send(recipe)
    } catch(e) {
        res.status(500).send({error: e.message})
    }
}

exports.recipeDelete = async (req, res) => {
    try {
        const recipe = await Recipe.findOneAndDelete({
            _id: req.params.id,
            creator: req.user._id
        })

        if(!recipe){
            return res.status(404).send({error: "Unable to delete this recipe"})
        }
        res.send(recipe)
    } catch(e) {
        res.status(500).send({error: e.message})
    }
}

exports.recipeRate = async (req, res) => {
    try{
        const rating = req.body.rating

        if(! (rating > 0 && rating < 6)){
            return res.status(400).send({error: "Invalid Rating"})
        }
        
        const recipe = await Recipe.findOne({
            _id: req.params.id,
            creator: {$ne: req.user._id},
            isPublic: true
        })

        if(!recipe){
            return res.status(404).send({error: "You don't have permission to rate this recipe"})
        }

        if(recipe.numRatings === 0){
            recipe.rating = rating
            recipe.numRatings +=1

            await recipe.save()

            return res.send(recipe)
        }

        const newRating = (((recipe.rating * recipe.numRatings) + rating) / (recipe.numRatings +1))
        recipe.rating = Math.round(newRating * 100) / 100
        recipe.numRatings += 1

        await recipe.save()
        res.status(200).send(recipe)

    } catch(e) {
        res.status(500).send({error: e.message})
    }
}