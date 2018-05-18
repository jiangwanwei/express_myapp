const {Post} = require('../lib/mongo')
module.exports = {
    create: post => Post.create(post).exec(),
}