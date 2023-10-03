const { selectArticleById } = require("../models/articles_model")

exports.getArticleById = async (req, res, next) => {
    try {
        const { article_id } = req.params
        const article = await selectArticleById(article_id)
        return res.status(200).send({ article: article })
    } catch (err) {
        next(err)
    }
}
