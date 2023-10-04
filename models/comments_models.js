const db = require("../db/connection")

exports.selectCommentsByArticleId = async (article_id) => {
    const result = await db.query
        (`SELECT comment_id, votes, created_at, author, body, article_id FROM comments
        WHERE article_id = $1
        ORDER BY created_at DESC`,
        [article_id]);
    if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: 'No comments found for this article' })
    }
    else {
        return result.rows
    }
}
exports.insertComment = async (body, author, article_id) => {
    const result = await db.query(
        `INSERT INTO comments
        (body, author, article_id)
        VALUES
        ($1, $2, $3)
        RETURNING *;`,
        [body, author, article_id]
    )
    if (result.rows.length === 0) {
        return Promise.reject({ status: 400, msg: 'Bad request: comment posting failed' })
    }
    else {
        return result.rows[0]
    }
}