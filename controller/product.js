'use strich'

const response = require('../response/response')
const connect = require('../database/connect')

exports.welcome = (req, res) => {
    response.ok('welocme', res)
}

exports.getAll = (req, res) => {
    connect.query(
        'SELECT * FROM product',
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
    const category_id = req.body.category_id
    const name = req.body.name
    const price = req.body.price
    const total = req.body.total

    connect.query(
        'INSERT INTO product SET category_id=?,name=?,price=?,total=?',
        [category_id, name, price, total],
        function (error, rows, field) {
            if (error) {
                res.status(400).json('error')
            } else {
                let id = rows.insertId
                const data = {
                    status: 202,
                    message: 'insert data succesfully',
                    result: {
                        id: id,
                        category_id: category_id,
                        name: name,
                        price: price,
                        total: total
                    }
                }
                res.status(202).json(data).end()
            }
        }
    )
}

exports.update = (req, res) => {
    const id = req.params.id
    const category_id = req.body.category_id
    const name = req.body.name
    const price = req.body.price
    const total = req.body.total

    connect.query(
        'UPDATE product SET category_id=?,name=?,price=?,total=? WHERE id=?',
        [category_id, name, price, total, id],
        function (error, rows, field) {
            if (error) {
                res.status(400).json('error')
            } else {
                connect.query(
                    'SELECT category.name FROM category WHERE category.id=?',
                    [category_id],
                    function (error, rowsegCategory, field) {
                        if (error) {
                            res.status(202).json('error category')
                        } else {
                            const category = rowsegCategory
                            const data = {
                                status: 202,
                                message: 'update data succesfully',
                                result: {
                                    id: id,
                                    category_id: category_id,
                                    category_name: category[0].name,
                                    name: name,
                                    price: price,
                                    total: total
                                }
                            }
                            res.status(202).json(data).end()
                        }
                    }
                )
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
            'DELETE FROM product WHERE id=?',
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