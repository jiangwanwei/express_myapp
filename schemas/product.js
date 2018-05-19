var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
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
    sort: {
        type:Number,
        min:0,       //年龄最小18
        max:120     //年龄最大120
    },
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
}, {
    collection: 'myProduct',   // 自定义collection名称
    // id: false,
    // _id: false,
})

ProductSchema.pre('save', function(next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    next();
})

ProductSchema.statics = {
    fetch(cb) {
        this.find({})
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