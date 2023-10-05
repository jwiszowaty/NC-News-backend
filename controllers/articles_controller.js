const { selectArticleById, selectAllArticles } = require("../models/articles_model")

exports.getArticleById = async (req, res, next) => {
    try {
        const { article_id } = req.params
        const article = await selectArticleById(article_id)
        return res.status(200).send({ article })
    } catch (err) {
        next(err)
    }
}

exports.getArticles = async (req, res, next) => {
    try {
        const articles = await selectAllArticles()
        return res.status(200).send({articles})
    } catch (err) {
        next(err)
    }
}

// exports.patchVotesByArticleId = async (req, res, next) => {

// }