'use strich'

const response = require('../response/response')
const connect = require('../database/connect')

exports.welcome = (req, res) => {
    response.ok('welocme', res)
}
exports.getAll = (req, res) => {
    connect.query(
        'SELECT * FROM category',
        function (error, rows, field) {
            if (error) {
                res.status(400).json('error')
            } else {
                res.json(rows)
            }
        }
    )
}
exports.insert = (req, res) => {
    const name = req.body.name
    connect.query(
        'INSERT INTO category SET name=?',
        [name],
        function (error, rows, field) {
            if (error) {
                res.status(400).json('error')
            } else {
                let Id = rows.insertId
                const data = {
                    status: 202,
                    message: 'insert data succesfully',
                    result: {
                        id: Id,
                        name: name
                    }
                }
                return res.status(202).json(data).end()
            }
        }
    )
}

exports.update = (req, res) => {
    const id = req.params.id
    const name = req.body.name

    connect.query(
        'UPDATE category SET name=? WHERE id=?',
        [name, id],
        function (error, rows, field) {
            if (error) {
                res.status(202).res.json('error')
            } else {
                let data = {
                    status: 202,
                    message: 'update data succesfully',
                    result: {
                        id: parseInt(id),
                        name: name
                    }
                }
                res.status(202).json(data).end()
            }
        }
    )
}

exports.delete = (req, res) => {
    const id = req.params.id
    if (id === 0 || id === '') {
        response.error('error',res)
    } else {
        connect.query(
            'DELETE FROM category WHERE id=?',
            [id],
            function (error, rows, field) {
                if (error) {
                    res.status(202).json('error')
                } else {
                    if (rows.affectedRows === 0 || rows.affectedRows ==='') {
                        response.error('error',res)
                    }else { 
                    const data = {
                        status : 202,
                        message : 'delete data succesfully',
                        result : {
                            id : id
                        }
                    }
                    return res.status(202).json(data).end()
                    }
                }
            }
        )
    }
}