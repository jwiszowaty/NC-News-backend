const express = require("express");
const app = express();
const { getTopics } = require("../controllers/topics_controller");
const { getEndpoints } = require("../controllers/endpoints_controller");
<<<<<<< HEAD
const { getArticleById } = require("../controllers/articles_controller")
const { getCommentsByArticleId, postComment} = require("../controllers/comments_controller")
=======
const { getArticleById , getArticles} = require("../controllers/articles_controller")
>>>>>>> main
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require('./errors/index.js');

app.get("/api", getEndpoints)

app.get("/api/topics", getTopics)

app.get("/api/articles/:article_id", getArticleById)

<<<<<<< HEAD
app.get("/api/articles/:article_id/comments", getCommentsByArticleId)
=======
app.get('/api/articles', getArticles)
app.all("/*", (req, res) => {
  res.status(404).send({message: 'No such path...\n...yet'})
})
>>>>>>> main

app.use(handleCustomErrors)
app.use(handlePsqlErrors)
app.use(handleServerErrors)


module.exports = app;
