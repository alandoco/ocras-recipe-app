const express = require('express')
const userController = require('../controllers/user')
const User = require('../models/user')
const auth = require('../middleware/auth')
const {upload} = require('../utils/file-upload')

const router = new express.Router()

router.post('/users/create', userController.userCreate)

router.get('/users/verify/:token', userController.userVerifyEmail)

router.post('/users/login', userController.userLogin)

router.get('users/me', auth, userController.getUserProfile)

router.patch('/users/me', auth, userController.userUpdate)

router.delete('/users/me', auth, userController.userDelete)

router.post('/users/me/avatar', auth, upload.single('avatar'), userController.userUploadProfileImage, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

module.exports = router