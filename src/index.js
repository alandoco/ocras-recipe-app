const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const recipeRouter = require('./routers/recipe')

const app = express()

app.use(express.json())
app.use(userRouter)
app.use(recipeRouter)

app.listen(process.env.PORT, () => {
    console.log('Server is listening on ' + process.env.PORT)
})