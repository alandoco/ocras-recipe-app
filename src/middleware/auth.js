const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    try {

        //Checking if 3rd party authenticated
        if(req.session.user){
            req.user = req.session.user
            console.log(req.user)
            return next()
        }

        const token = req.get('Authorization').slice(7) //Remove first 7 chars ('Bearer ')
        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findOne({
            _id: decodedToken._id,
            'tokens.token': token
        })

        if(!user){
            throw new Error()
        }

        req.user = user
        req.token = token

        next()
    } catch(e) {
        res.status(404).send({error: "Please authenticate"})
    }
    

}

module.exports = auth