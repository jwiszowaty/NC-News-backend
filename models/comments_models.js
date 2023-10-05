const { log } = require("console");
const db = require("../db/connection")
const articles = require("../db/data/test-data/articles")

exports.selectCommentsByArticleId = async (article_id) => {
    const result = await db.query(
        `SELECT comment_id, votes, created_at, author, body, article_id FROM comments
        WHERE article_id = $1
        ORDER BY created_at DESC`,
        [article_id]
    );
    if (result.rows.length === 0 && article_id <= articles.length) {
        return Promise.reject({ status: 200, msg: 'No comments found for this article' })
    } else if (article_id < 1 || article_id >= articles.length) {
        return Promise.reject({ status: 404, msg: 'Article not found' })
    } else if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: 'Comments not found' })
    }
    else {
        return result.rows
    }
}