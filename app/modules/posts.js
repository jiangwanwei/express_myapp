const {Post} = require('../lib/mongo')
const marked = require('marked')

// 将 post 的 content 从 markdown 转换成 html
Post.plugin('contentToHtml', {
    afterFind: results => results.map(post => {
        post.content = marked(post.content)
        return post
    }),
    afterFindOne: result => {
        if (result) {
            result.content = marked(result.content)
        }
        return result
    }
})

module.exports = {
    // 创建一片文章
    create: post => Post.create(post).exec(),
    // 通过文章 id 获取一篇文章
    getPostById: _id => {
        return Post
            .findOne({ _id })
            .populate({ path: 'author', model: 'User' })
            .addCreateAt()
            .contentToHtml()
            .exec()
    },
    // 按创建时间降序获取所有用户文章或者某个特定用户的所有文章
    getPosts: author => {
        const query = {}
        if (author) {
            query.author = author
        }
        return Post
            .find(query)
            .populate({ path: 'author', model: 'User' })
            .sort({ _id: -1 })
            .addCreateAt()
            .contentToHtml()
            .exec()

    },
    // 通过文章 id 给 pv 加 1
    incPv: _id => {
        return Post
            .update({ _id }, { $inc: { pv: 1 }})
            .exec()
    }
}