var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BlogSchema = new Schema({
    title: String,
    author: String,
    content: String,
    topper: {
        type: Boolean,
        default: false,
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
})

BlogSchema.pre('save', function(next) {
    this.meta.updateAt = Date.now();
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt;
    }
    next();
})

BlogSchema.statics = {
    fetch(cb) {
        return this.find({})
                   .sort('meta.updateAt')
                   .exec(cb);
    },
    findById(_id, cb) {
        return this.find({_id}).exec(cb);
    }
}

module.exports = BlogSchema