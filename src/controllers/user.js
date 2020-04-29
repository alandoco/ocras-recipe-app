const User = require('../models/user')
const Recipe = require('../models/recipe')
const {convertImage} = require('../utils/file-upload')
const {sendVerificationEmail} = require('../emails/account')
const helpers = require('../utils/helpers')
const constants = require('../utils/constants')

exports.userCreate = async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        
        sendVerificationEmail(user.email, user.firstName, user.verificationToken)
        
        res.send(user)
    } catch(e) {
        res.send(e)
    }
}

exports.userVerifyEmail = async (req, res) => {
    try {
        const user = await User.findOne({verificationToken: req.params.token})
        
        if(!user){
            return res.status(404).send({error: 'This email address is already verified. Please login'})
        }

        user.isVerified = true
        user.verificationToken = undefined
        
        //generateAuthToken() also saves the user
        const token = await user.generateAuthToken()

        res.send({user, token})
    } catch(e) {
        res.status(500).send(e)
    }
}

exports.userLogin = async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)

        if(!user.isVerified){
            return res.status(401).send({error: "Please verify your email"})
        }

        const token = await user.generateAuthToken()

        //When frontend is built, this token will be stored as a cookie
        //For now we just pass in as Bearer Token in Postman
        res.send({user, token})
    } catch(e) {
        res.status(400).send()
    }
}

exports.userLogout = async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token != req.token)
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send({e: e.message})
    }
}

exports.userLogoutAllDevices = async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch(e) {
        res.status(500).send({error: e.message})
    }   
}

exports.userUpdate = async (req, res) => {
    const updates = Object.keys(req.body)
    const isUpdateAllowed = helpers.checkIfValidUpdate(updates, constants.USER_ALLOWED_UPDATES)

    if(!isUpdateAllowed){
        res.status(400).send({error: "Invalid updates"})
    }

    try {
        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })

        await req.user.save()
        res.send(req.user)
    } catch(e) {
        res.status(400).send({error:e})
    }
}

exports.userDelete = async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
}

exports.userUploadProfileImage = async (req, res) => {
    const buffer = await convertImage(req.file.buffer)
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}

exports.getUserProfile = async (req, res) => {
    res.send(req.user)
}

exports.userAddFavouriteRecipe = async (req, res) => {
    try {
        const recipeId = req.params.id

        const recipe = await Recipe.findOne({
            _id: recipeId, 
            creator: {$ne: req.user._id}
        })

        if(!recipe || !recipe.isPublic){
            return res.status(404).send({error: "Unable to add recipe as favourite"})
        }

        if(req.user.favourites.includes(recipeId)){
            return res.status(400).send({error: "You have already added this recipe as a favourite"})
        }

        req.user.favourites.push(recipeId)
        await req.user.save()
        
        res.send(req.user)
    } catch(e) {
        res.status(500).send({e: e.message})
    }
}

exports.userGetFavouriteRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find({
            _id: {$in: req.user.favourites,
            isPublic: true
        }})

        if(!recipes) {
            res.status(404).send({error: "You do not have any saved recipes"})
        }

        res.send(recipes)
    } catch(e) {
        res.status(500).send({e: e.message})
    }
}

exports.userDeleteFavouriteRecipes = async (req, res)=> {
    try {
        updatedFavourites = req.user.favourites.filter((favourite) => favourite != req.params.id)

        console.log(req.user.favourites)
        console.log(updatedFavourites)
        
        if(updatedFavourites == req.user.favourites){
            return res.status(404).send({error: "Recipe not found in favourites"})
        }

        req.user.favourites = updatedFavourites
        await req.user.save()

        res.send(req.user)
    } catch(e) {
        res.status(500).send({e: e.message})
    }
}