const db = require('../connection')

exports.selectAllTopics = async () => {
    const result = await db.query(`SELECT * FROM topics`)
return result.rows
}