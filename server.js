const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const port = process.env.PORT || 4000
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



app.listen(port)
console.log(`hello word${port}`)
