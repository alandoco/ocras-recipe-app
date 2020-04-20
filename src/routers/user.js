const express = require('express')
const User = require('../models/user')
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
        res.send(user)
    } catch(e) {
        res.status(400).send()
    }
})

module.exports = router