const { selectCommentsByArticleId, selectCommentById, deleteCommentById } = require("../models/comments_models")
const { selectArticleById} = require("../models/articles_model")

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
exports.removeCommentById = async (req, res, next) => {
    try {
        const { comment_id } = req.params
        await selectCommentById(comment_id)
        const comment = await deleteCommentById(comment_id)
        return res.status(204).send({ comment })
    } catch (err) {
        next(err)
    }
}