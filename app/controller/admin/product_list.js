var mongoose = require('mongoose');
var Product = require('../../modules/product');

mongoose.connect('mongodb://localhost:27017/myapp', {useMongoClient: true});


module.exports = (req, res) => {
    Product.fetch((err, data) => {
        if (err) {
            console.log(err)
        }
        res.send({
            code: 0,
            data,
            msg: 'admin.product_list controller'
        })
    })    
}