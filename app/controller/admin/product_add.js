var Product = require('../../modules/product')

module.exports = (req, res) => {
    var {body} = req;
    var _product = new Product({
        name: body.name,
        cover: body.cover,
        describe: body.describe,
        introduction: body.introduction,
        sort: body.sort,
        isNew: true,
    })
    _product.save((err, product) => {
        if (err) {
            res.send({
                code: 1,
                msg: 'has a error'
            })
            return console.log(err);
        }
        res.send({
            code: 0,
            data: [],
            msg: 'success'
        })
    })
    
}