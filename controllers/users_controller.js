const { selectAllUsers } = require("../models/users_model")

exports.getUsers = async (req, res, next) => {
    try {
        const users = await selectAllUsers()
        return res.status(200).send({ users })
    } catch (err) {
        next(err)
    }
}