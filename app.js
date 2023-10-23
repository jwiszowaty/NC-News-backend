const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics_controller");
const { getEndpoints } = require("./controllers/endpoints_controller");
const { getCommentsByArticleId, removeCommentById, postComment} = require("./controllers/comments_controller")
const { getArticleById , getArticles, patchVotesbyArticleId} = require("./controllers/articles_controller")
const { getUsers } = require("./controllers/users_controller")
const { handleCustomErrors, handlePsqlErrors, handleServerErrors } = require('./errors/index.js');
const cors = require('cors');

app.use(cors())

app.use(express.json())

app.get("/api", getEndpoints)

app.get("/api/topics", getTopics)

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles/:article_id/comments", getCommentsByArticleId)

app.get('/api/articles', getArticles)

app.delete("/api/comments/:comment_id", removeCommentById)

app.patch("/api/articles/:article_id", patchVotesbyArticleId)

app.post("/api/articles/:article_id/comments", postComment)

app.get("/api/users", getUsers)

app.all("/*", (req, res) => {
  res.status(404).send({message: 'No such path...\n...yet'})
})
app.use(handleCustomErrors)
app.use(handlePsqlErrors)
app.use(handleServerErrors)


module.exports = app;
