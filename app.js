const express = require("express");

const app = express();

app.get("/", (req, res) => {
  return res.status(200).json({
    name: "WD 201 Capstone Project",
    success: true,
  });
});

module.exports = app;
