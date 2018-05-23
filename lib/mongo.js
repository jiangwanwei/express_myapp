const config = require('../config')
const Mongolass = require('mongolass')
const moment = require('moment')
const objectIdToTimestamp = require('objectid-to-timestamp')

const mongolass = new Mongolass()
mongolass.connect(config.mongodb)

// 根据 id 生成创建时间 created_at
//* 24 位长的 ObjectId 前 4 个字节是精确到秒的时间戳，所以我们没有额外的存创建时间（如: createdAt）的字段。
mongolass.plugin('addCreateAt', {
    afterFind: results => {
        results.forEach(item => {
            item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm')
        })
        return results
    },
    afterFindOne: result => {
        if (result) {
            result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm')
        }
        return result
    }
})

/**
 * 用户
 */
exports.User = mongolass.model('User', {
    name: { type: 'string', required: true },
    password: { type: 'string', required: true },
    avatar: { type: 'string', required: true },
    gender: { type: 'string', enum: ['m', 'f', 'x'], default: 'x' },
    bio: { type: 'string', required: true }
})
exports.User.index({ name: 1 }, { unique: true }).exec()  // 根据用户名找到用户，用户名全局唯一
// * 定义了用户表的 schema，生成并导出了 User 这个 model，同时设置了 name 的唯一索引，保证用户名是不重复的

/**
 * api test user
 */
exports.ApiUser = mongolass.model('ApiUser', {
    username: { type: 'string', required: true },
    password: { type: 'string', required: true },
    token: { type: 'string', }
})

/**
 * 文章
 */
exports.Post = mongolass.model('Post', {
    author: { type: Mongolass.Types.ObjectId, required: true },
    title: { type: 'string', required: true },
    content: { type: 'string', required: true },
    pv: { type: 'number', default: 0 },
})
exports.Post.index({ author: 1, _id: -1 }).exec()   // 按创建时间降序查看用户的文章列表

/**
 * 评论
 */
exports.Comment = mongolass.model('Comment', {
    author: { type: Mongolass.Types.ObjectId, required: true },
    content: { type: 'string', required: true },
    postId: { type: Mongolass.Types.ObjectId, required: true },
})
exports.Comment.index({ postId: 1, _id: 1 }).exec()   // 通过文章 id 获取该文章下所有留言，按留言创建时间升序