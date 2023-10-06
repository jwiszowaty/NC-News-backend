const db = require('../connection')

exports.selectAllTopics = async (topic) => {
    let result;
    if (topic) {
        result = await db.query(`SELECT * FROM topics WHERE slug = $1`, [topic])
    } else {
        result = await db.query(`SELECT * FROM topics`)
    }

    if (result.rows.length === 0) {
        return Promise.reject({status: 404, msg: 'No articles found on this topic'})
    } else {
        return result.rows
    }
}