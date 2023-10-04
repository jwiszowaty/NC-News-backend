const { selectCommentsByArticleId } = require("../models/comments_models")

exports.getCommentsByArticleId = async (req, res, next) => {
    try {
        const { article_id } = req.params
        const comments = await selectCommentsByArticleId(article_id)
        return res.status(200).send({ comments })
    } catch (err) {
        next(err)
    }
}