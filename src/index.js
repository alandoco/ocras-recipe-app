const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')

const app = express()

app.use(express.json())
app.use(userRouter)
// app.get('/', (req, res) => {
//     res.send('Hello World')
// })

app.listen(process.env.PORT, () => {
    console.log('Server is listening on ' + process.env.PORT)
})