const db = require("../connection")

exports.selectCommentsByArticleId = async (article_id) => {
    const result = await db.query(
        `SELECT comment_id, votes, created_at, author, body, article_id FROM comments
        WHERE article_id = $1
        ORDER BY created_at DESC`,
        [article_id]
    )
    return result.rows
}
exports.selectCommentById = async (comment_id) => {
    const result = await db.query(
        `SELECT * FROM comments
        WHERE comment_id = $1`,
        [comment_id]
    )
    if (result.rows.length === 0) {
        return Promise.reject({status: 404, msg: 'Comment not found'})
    }
    else {
        return result.rows
    }
}
exports.deleteCommentById = async (comment_id) => {
    const result = await db.query(
        `DELETE FROM comments
        WHERE comment_id = $1`,
        [comment_id]
    )
    return result.rows
}