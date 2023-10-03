const { selectAllTopics } = require('../models/topics_model')
exports.getTopics = (req, res, next) => {
    selectAllTopics()
    .then((topics) => res.status(200).send({message: topics}))
}
