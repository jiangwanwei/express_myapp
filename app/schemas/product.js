var mongoose = require('mongoose');

var ProductSchema = new mongoose.Schema({
    name: String,
    cover: String,
    describe: String,
    introduction: String,
    recommend: {
        type: Number,
        default: 0,
    },
    hot: {
        type: Number,
        default: 0,
    },
    allow_coupon: {
        type: Number,
        default: 0,
    },
    open: {
        type: Number,
        default: 1,
    },
    sort: Number,
    meta: {
        createAt: {
            type: Date,
            default: Date.now(),
        },
        updateAt: {
            type: Date,
            default: Date.now(),
        }
    }
})

ProductSchema.pre('save', function(next) {
    console.log(this, 2)
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }

    next();
})

ProductSchema.statics = {
    fetch(cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb)
    },
    findById(_id, cb) {
        return this
            .findOne({_id})
            .exec(cb)
    }
}

module.exports = ProductSchema