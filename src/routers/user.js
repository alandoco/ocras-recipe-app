const express = require('express')
const userController = require('../controllers/user')
const User = require('../models/user')
const auth = require('../middleware/auth')
const {upload} = require('../utils/file-upload')

const router = new express.Router()

router.post('/users/create', userController.userCreate)

router.get('/users/verify/:token', userController.userVerifyEmail)

router.post('/users/login', userController.userLogin)

router.patch('/users/logout', auth, userController.userLogout)

router.patch('/users/logoutall', auth, userController.userLogoutAllDevices)

router.get('/users/me', auth, userController.getUserProfile)

router.patch('/users/me', auth, userController.userUpdate)

router.delete('/users/me', auth, userController.userDelete)

router.post('/users/me/avatar', auth, upload.single('avatar'), userController.userUploadProfileImage, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

router.patch('/users/favourites/add/:id', auth, userController.userAddFavouriteRecipe)

router.get('/users/favourites', auth, userController.userGetFavouriteRecipes)

router.delete('/users/favourites/:id', auth, userController.userDeleteFavouriteRecipes)

module.exports = router