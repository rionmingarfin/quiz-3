'use strich'

module.exports  = function (app){
    const category = require('../controller/category')
    const product = require('../controller/product')
    const user = require('../controller/user')
    //routes category
    app.get('/',category.welcome)
    app.post('/api/v1',category.insert)
    app.get('/api/v1',category.getAll)
    app.patch('/api/v1/:id',category.update)
    app.delete('/api/v1/:id',category.delete)

    //routes product
    app.get('/api/v2',product.getAll)
    app.post('/api/v2',product.insert)
    app.patch('/api/v2/:id',product.update)
    app.delete('/api/v2/:id',product.delete)

    //user
    app.post('/api/v3',user.insert)
    app.post('/api/v3/login',user.login)
}