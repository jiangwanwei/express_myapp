var Product = require('../../modules/product');


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