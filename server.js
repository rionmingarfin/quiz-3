//require('./config')
const express = require('express')
const app = express()
const bodyParser = require('body-parser');
// const port = process.env.PORT || 3000
const Routes = require('./routes/routes')

const cors = require('cors')
app.use(cors())
app.use(
    bodyParser.urlencoded({
        extended: true
    })
)
app.use(bodyParser.json())
Routes(app)



app.listen(process.env.PORT)
console.log(`hello word${process.env.PORT}`)
