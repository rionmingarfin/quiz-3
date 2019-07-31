'use strich'
const crypto = require('crypto')
const algorithm = 'aes-256-ctr'
const password = 'd6F3Efeq';
const connect = require('../database/connect')
const jwt = require('jsonwebtoken')


function encrypt(text) {
    var cipher = crypto.createCipher(algorithm, password)
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}

exports.insert = (req, res) => {
    const username = req.body.username
    const email = req.body.email
    const password = encrypt(req.body.password)

    connect.query(
        `SELECT * from user where username=\'${username}\' LIMIT 1`,
        function (error, rows, field) {
            if (error) {
                res.status(400).json('error')
            } else {
                if (rows != '') {
                    return res.send({
                        message: 'Username is exist'
                    })
                } else {
                    connect.query(
                        `SELECT * from user where email=\'${email}\' LIMIT 1`,
                        function (error, rowss, field) {
                            if (error) {
                                res.status(400).json('email error')
                            } else {
                                if (rowss != '') {
                                    return res.send({
                                        message: 'Email has been registered'
                                    })
                                } else {
                                    connect.query(
                                        `INSERT INTO user SET username=?,email=?,password=?`,
                                        [username, email, password],
                                        function (error, rowsss, field) {
                                            if (error) {
                                                res.status(400).json('insert error')
                                            } else {
                                                const id = rowsss.insertId
                                                const data = {
                                                    status: 202,
                                                    message: "Data has been saved",
                                                    result: {
                                                        id: id,
                                                        username: username,
                                                        email: email
                                                    }
                                                }
                                                res.status(202).json(data).end()
                                            }
                                        }
                                    )
                                }
                            }
                        }
                    )
                }
            }
        }
    )
}

exports.login = function (req, res) {
    const username = req.body.username || '';
    const password = req.body.password || '0';
    let encrypted = encrypt(password)
    const query = `SELECT * FROM user WHERE username='${username}' AND password='${encrypted}'`;
    connect.query(
        query,
        function (error, rows, field) {
            console.log(query)
            if (error) {
                return res.send({
                    status: 403,
                    message: 'forbidden',
                })
            }
            else {
                if (rows != '') {
                    jwt.sign({ rows }, rows[0].id, (err, token) => {
                        return res.send({
                            status: 200,
                            data: rows,
                            token: token
                        })
                    });
                }
                else {
                    return res.send({
                        status: 403,
                        message: 'Incorrect username or password',
                    })
                }
            }
        }
    )
}