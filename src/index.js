const express = require('express')
const passport = require('passport')
require('./db/mongoose')
const userRouter = require('./routers/user')
const recipeRouter = require('./routers/recipe')
const weatherRouter = require('./routers/weather')
const commentRouter = require('./routers/comment')

const app = express()

app.use(express.json())
app.use(passport.initialize())
app.use(passport.session())
app.use(userRouter)
app.use(recipeRouter)
app.use(weatherRouter)
app.use(commentRouter)

app.listen(process.env.PORT, () => {
    console.log('Server is listening on ' + process.env.PORT)
})