const express = require("express");
const app = express();
const { getTopics } = require("../controllers/topics_controller");

app
  .get("/api/topics", getTopics)

app.use((err, req, res, next) => {
  console.log(err, res);
  res.status(500).send({ msg: 'Internal Server Error' });
});
module.exports = app;
