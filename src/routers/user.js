const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const {sendVerificationEmail} = require('../emails/account')

const router = new express.Router()

router.post('/users/create', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        console.log(user)
        sendVerificationEmail(user.email, user.firstName, user.verificationToken)
        console.log(user)
        res.send(user)
    } catch(e) {
        res.send(e)
    }
    
})

router.get('/users/verify/:token', async (req, res) => {
    try {
        const user = await User.findOne({verificationToken: req.params.token})

        if(!user){
            res.status(404).send()
        }

        user.isVerified = true
        user.verificationToken=undefined
        await user.save()

        res.send(user)
    } catch(e) {
        res.status(500).send(e)
    }
    console.log(req.params.token)
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)

        if(!user.isVerified){
            return res.status(401).send({error: "Please verify your email"})
        }

        const token = await user.generateAuthToken()

        //When frontend is built, this token will be stored as a cookie
        //FOr now we just pass in as Bearer Token in Postman
        res.send({user, token})
    } catch(e) {
        res.status(400).send()
    }
})

router.patch('/users/update', auth, async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['email', 'password', 'bio', 'favouriteCuisine', 'avatar']

    const isUpdateAllowed = updates.every((update) => allowedUpdates.includes(update))

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
        res.status(400).send({error:"error"})
    }
})

module.exports = router