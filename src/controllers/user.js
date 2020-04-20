const User = require('../models/user')
const {saveFile} = require('../controllers/file-upload')
const {sendVerificationEmail} = require('../emails/account')

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

exports.userUpdate = async (req, res) => {
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
    await saveFile(req.user, req.file.buffer)
    res.send()
}