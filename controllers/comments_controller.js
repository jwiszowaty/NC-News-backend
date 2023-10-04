const { selectCommentsByArticleId, insertComment } = require("../models/comments_models")

exports.getCommentsByArticleId = async (req, res, next) => {
    try {
        const { article_id } = req.params
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
        const comment = await insertComment(body, author, article_id)
        console.log(comment);
        return res.status(201).send({ comment })
    } catch (err) {
        next(err)
    }
}