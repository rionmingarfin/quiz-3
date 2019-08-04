'use strich'

module.exports  = function (app){
    const category = require('../controller/category')
    const product = require('../controller/product')
    const user = require('../controller/user')
    const auth = require('../controller/auth')
    //routes category
    app.get('/',category.welcome)
    app.post('/api/v1',auth,category.insert)
    app.get('/api/v1',category.getAll)
    app.patch('/api/v1/:id',auth,category.update)
    app.delete('/api/v1/:id',auth,category.delete)

    //routes product
    app.get('/api/v2',product.getAll)
    app.post('/api/v2',auth,product.insert)
    app.patch('/api/v2/:id',auth,product.update)
    app.delete('/api/v2/:id',auth,product.delete)

    //user
    app.post('/api/v3',user.insert)
    app.post('/api/v3/login',user.login)
    app.patch('/api/v3/changePassword/:id',user.changePassword)
    app.post('/api/v3/sendemail',user.sendEmail)
    app.post('/api/v3/resetpassword',user.resetPassword)
}