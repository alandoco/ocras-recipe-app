const request = require('request')
const Recipe = require('../models/recipe')

exports.getWeather = async (req, res) => {
    if(!req.query.latitude || !req.query.longitude){
        return res.send({error: "Please allow us to use your location"})
    }
    const requestURL = 'https://api.darksky.net/forecast/'+ process.env.DARK_SKY_API_KEY + '/' + req.query.latitude + ',' + req.query.longitude + '?units=si'
    request({url: requestURL, json: true}, async (error, {body}) => {
        if(error){
            return res.status(500).send({error})
        }

        try {
            location = body.timezone.replace('_', ' ').split('/')[1]
            temperature = body.currently.temperature

            if(!temperature || !location){
                return res.status(404).send()
            }
        
            const recipe = temperature < 10 ? await getRandomRecipe('Hot') : await getRandomRecipe('Cold')

            if(!recipe) {
                return res.send({location, temperature})
            }
            res.send({recipe, location, temperature})
        } catch(e) {
            res.status(500).send({error: e.message})
        }
})}

const getRandomRecipe = async (foodTemperature) => {
    const queryObject = {
        isPublic:true, 
        rating: {$gte: 3.5}, 
        temperature:foodTemperature
    }

    try {
        const numRecipes = await Recipe.countDocuments(queryObject)
        //Gets random integer between 1 and numRecipes+1
        const randomRecipeIndex = Math.floor(Math.random() * numRecipes) +1
    
        return await Recipe.findOne(queryObject).skip(randomRecipeIndex)
    } catch(e){
        return 
    }
}


