const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics_controller");
const { getEndpoints } = require("./controllers/endpoints_controller");
const { getArticleById , getArticles, patchVotesbyArticleId} = require("./controllers/articles_controller")
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require('./errors/index.js');

app.use(express.json())

app.get("/api", getEndpoints)

app.get("/api/topics", getTopics)

app.get("/api/articles/:article_id", getArticleById)

app.get('/api/articles', getArticles)

app.patch("/api/articles/:article_id", patchVotesbyArticleId)

app.all("/*", (req, res) => {
  res.status(404).send({message: 'No such path...\n...yet'})
})

app.use(handleCustomErrors)
app.use(handlePsqlErrors)
app.use(handleServerErrors)


module.exports = app;
