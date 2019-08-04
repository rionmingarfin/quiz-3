'use strich'
require('dotenv/config')
const crypto = require('crypto')
const algorithm = process.env.ALGORTIHM
const password = process.env.PASSWORD_ALGORITHM
const connect = require('../database/connect')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const email = process.env.EMAIL
const passwordemail = process.env.PASSWORD_EMAIL
const mcache = require('memory-cache')


function encrypt(text) {
    var cipher = crypto.createCipher(algorithm, password)
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text) {
    var decipher = crypto.createDecipher(algorithm, password)
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: true,
    service: 'gmail',
    auth: {
        user: email,
        pass: passwordemail
    }
})
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
                                                connect.query(
                                                    `SELECT *  FROM user ORDER BY id DESC LIMIT 1`, function (error, rowssss, field) {
                                                        if (error) {
                                                            console.log(error);
                                                        } else {
                                                            return res.send({
                                                                data: rowssss,
                                                                message: "Data has been saved"
                                                            })
                                                        }
                                                    }
                                                )
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
                    jwt.sign({ rows }, "secretKey", (err, token) => {
                        // console.log("token" + token)
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

exports.changePassword = (req, res) => {
    const id = req.params.id
    const password = req.body.password
    const newPassword = req.body.newPassword
    const oldPassword = req.body.oldPassword

    connect.query(
        `SELECT * FROM user where id=?`, [id],
        function (error, rows, field) {
            if (error) {
                res.json({
                    status: 400,
                    message: "error"
                })
            } else {
                if (!password) {
                    res.status(400).send({ message: "password is require" })
                } else if (!newPassword) {
                    res.status(400).send({ message: "new password is require" })
                } else if (password !== oldPassword) {
                    res.status(400).send({ message: " password is not matching" })
                } else {
                    const pass = decrypt(rows[0].password)
                    if (pass !== password) {
                        res.status(400).send({ message: "wrong password" })
                    } else {
                        const pass = encrypt(newPassword)
                        connect.query(
                            `UPDATE user set password=? WHERE id=?`,
                            [pass, id],
                            function (error, rows, field) {
                                if (error) {
                                    res.json({
                                        status: 400,
                                        message: "error"
                                    })
                                } else {
                                    return res.json({
                                        data: rows,
                                        message: 'Data has been updated'
                                    })
                                }
                            }
                        )
                    }
                }
            }
        }
    )
}

exports.sendEmail = (req, res) => {
    const mailto = req.body.email
    let code = Math.floor(Math.random() * Math.floor(999999))
    if (code < 100000) {
        code += 50000
    }
    console.log("code" + code)
    let key = '__code__' + mailto
    console.log(key)
    mcache.put(key, code, 300000)
    mcache.put('mail', mailto, 300000)
    const mailOptions = {
        from: email,
        to: mailto,
        subject: 'CCarousell Reset Password',
        text: 'Use this code to reset password ' + code + ' this code will expired after 5 minutes'
    }
    transporter.sendMail(mailOptions,
        function (error, info) {
            if (error) {
                res.send({ status: 403, message: error })
            }
            else {
                res.send({ status: 200, info: info, message: 'Mail sent!' })
            }
        })
}

exports.resetPassword = (req, res) => {
    let email = mcache.get('mail')
    let myemail = email
    let key = '__code__' + myemail
    let mycode = Number(req.body.code)
    let code = mcache.get(key)
    let newPassword = req.body.newPassword
    console.log("code"+code)
    console.log("new"+newPassword)
    if (mycode !== code) {
        res.send({ status: 400, message: 'incoret code' })
    } else {
        connect.query(`UPDATE user SET \`password\`='${encrypt(newPassword)}' WHERE email='${email}'`, function (error, rows) {
            try {
                res.send({ status: 200, message: 'Password changed successfully!' })
            }
            catch (error) {
                res.send({ status: 403, message: 'Not registered email' })
            }
        })
    }

}