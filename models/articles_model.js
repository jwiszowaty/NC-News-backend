const db = require("../connection")

exports.selectArticleById = async (article_id) => {
    
    result = await db.query(
        `SELECT articles.*, COUNT(comments.article_id)::integer  AS comment_count FROM articles
        LEFT JOIN comments
        ON articles.article_id = comments.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.article_id;`,
        [article_id]
    )

    if (result.rows.length === 0) {
        return Promise.reject({status: 404, msg: 'Article not found'})
    }
    
    else {
        return result.rows[0]
    }
}

exports.selectAllArticles = async (topic, sort_by = 'created_at', order = 'DESC') => {
    
    const categories = ['author', 'title', 'created_at', 'votes', 'comment_count']
    if (!['ASC', 'DESC'].includes(order.toUpperCase())) {
        return Promise.reject({status: 400, msg: 'Invalid order value'})
    }
    if (!categories.includes(sort_by.toLowerCase())) {
        return Promise.reject({status: 400, msg: 'Invalid category'})
    }
    const sorting = sort_by === 'comment_count' ? 'comment_count' : `articles.${sort_by}`
    let result;
    let queryStr = `SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, COUNT(comments.article_id)::integer  AS comment_count FROM articles
    LEFT JOIN comments
    ON comments.article_id = articles.article_id`
    
    if (topic) {
        queryStr += ` WHERE topic = $1 GROUP BY articles.article_id ORDER BY ${sorting} ${order};`
        result = await db.query(queryStr, [topic])
        if (result.rows.length === 0) {
            return Promise.reject({status: 404, msg: 'No articles found on this topic'})
        } else {
            return result.rows
        }
    } else {
        queryStr += ` GROUP BY articles.article_id ORDER BY ${sorting} ${order};`
        result = await db.query(queryStr)
        return result.rows
    }
    
    
}

exports.updateVotesByArticleId = async (article_id, inc_vote) => {
    const result = await db
    .query(
    `UPDATE articles
    SET
        votes = votes + $1
    WHERE article_id = $2
    RETURNING *;`,
    [inc_vote, article_id]
    )
    return result.rows[0]
}