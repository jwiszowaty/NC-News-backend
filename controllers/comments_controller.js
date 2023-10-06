const { selectCommentsByArticleId, insertComment } = require("../models/comments_models")
const { selectArticleById } = require("../models/articles_model")
const { selectUser } = require("../models/users_model")

exports.getCommentsByArticleId = async (req, res, next) => {
    try {
        const { article_id } = req.params
        await selectArticleById(article_id)
        const comments = await selectCommentsByArticleId(article_id)
        return res.status(200).send({ comments })
    } catch (err) {
        next(err)
    }
}
exports.postComment = async (req, res, next) => {
    try {
        const { body, author } = req.body
        const { article_id } = req.params
        await selectUser(author)
        await selectArticleById(article_id)
        const comment = await insertComment(body, author, article_id)
        return res.status(201).send({ comment })
    } catch (err) {
        next(err)
    }
}