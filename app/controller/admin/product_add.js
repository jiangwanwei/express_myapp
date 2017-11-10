var Product = require('../../modules/product');
var {Map} = require('immutable');

module.exports = (req, res) => {
    var {
        body,
    } = req;
    if (body._id) {
        Product.findById(body._id, (err, product) => {
            if (err) console.log(err);
            // let _product = Map(product).merge(Map(body)).toJS();
            // _product = new Product(_product);
            // product._id = body._id;
            product.name = 'dddd333';
            console.log(product)
            product.save((err, pro) => {
                if (err) console.log(err)
                res.send({
                    code: 0,
                    data: [],
                    msg: 'update success'
                })
            })
        })
    } else {
        var _product = new Product({
            name: body.name,
            cover: body.cover,
            describe: body.describe,
            introduction: body.introduction,
            sort: body.sort,
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

    
    
}