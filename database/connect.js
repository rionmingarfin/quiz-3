require('dotenv/config')
const mysql = require('mysql')

const conn = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
})

conn.connect(function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('connect succesfully')
    }
})

module.exports = conn;