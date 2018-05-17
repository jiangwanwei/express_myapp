var Product = require('../../modules/product');
// var {Map, fromJS} = require('immutable');
var _ = require('lodash');

exports.update = exports.add = (req, res) => {
    var {
        body,
    } = req;
    if (req.params.id) {
        Product.findById(req.params.id, (err, product) => {
            if (err) console.log(err);
            // let _product = Map(product).merge(Map(body)).toJS();
            // _product = new Product(_product);
            let _product = _.assign(product, body);
            _product.save((err, pro) => {
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
                    msg: err.message
                })
                return console.log(err);
            }
            res.send({
                code: 0,
                data: [],
                msg: 'add success'
            })
        })
    }
}
exports.findAll = (req, res) => {
    Product.fetch((err, data) => {
        if (err) console.log(err);
        res.send({
            code: 0,
            data,
        })
    })
}
exports.findOne = (req, res) => {
    let {id} = req.params;
    if (id) {
        Product.findById(id, (err, data) => {
            if (err) console.log(err);
            if (!data) {
                return res.send({
                    code: 1,
                    msg: err.message
                })
            }
            res.send({
                code: 0,
                data,
            })
        })
    }
}

exports.delete = (req, res) => {
    let {id} = req.params;
    if (id) {
        Product.remove({_id: id}, (err, data) => {
            if (err) console.log(err);
            res.send({
                code: 0,
                data: [],
            })
        })
    }
}
