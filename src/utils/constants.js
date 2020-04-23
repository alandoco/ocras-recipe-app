const CUISINES = [
    'Chinese', 
    'Korean', 
    'Thai', 
    'Vietnamese', 
    'Japanese', 
    'Indian', 
    'Middle Eastern', 
    'French', 
    'Italian', 
    'Spanish', 
    'Mexican',
    'None of the above'
]

const MEASUREMENTS = [
    'mililitres',
    'grams',
    'teaspoons',
    'tablespoons',
    'pinch of'
]

const FILE_SIZE_LIMIT = 1000000
const RECIPE_PRIVACY = ['me', 'public', 'both']
const RECIPE_ALLOWED_UPDATES = [
    'name', 
    'ingredients', 
    'method', 
    'cuisine', 
    'isPublic', 
    'image'
]

const USER_ALLOWED_UPDATES = [
    'email', 
    'password', 
    'bio', 
    'favouriteCuisine', 
    'avatar'
]



module.exports = {
    CUISINES,
    MEASUREMENTS,
    FILE_SIZE_LIMIT,
    RECIPE_ALLOWED_UPDATES,
    USER_ALLOWED_UPDATES
}