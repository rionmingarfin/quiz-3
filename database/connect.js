require('dotenv/config')
const mysql = require('mysql')

const conn = mysql.createConnection({
    // host: process.env.HOST_DB,
    // user: process.env.USER_DB,
    // password: process.env.PASSWORD_DB,
    // database: process.env.DATABASE_DB,

    host: 'localhost',
    user: 'root',
    password: '',
    database: 'inventory'

})

conn.connect(function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('connect succesfully')
    }
})

module.exports = conn;