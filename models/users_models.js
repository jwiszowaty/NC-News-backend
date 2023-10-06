const db = require("../connection")

exports.selectUser = async (author) => {
    const result = await db.query(
        `SELECT * FROM users
        WHERE username = $1`,
        [author]
    )
    if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: 'User not found' })
    }
    else {
        return result.rows[0]
    }
}