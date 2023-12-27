// middlewares.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const configureMiddlewares = (app) => {
  // Use body-parser for JSON and URL-encoded bodies
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  // Enable CORS for all routes
  app.use(cors());
};

module.exports = configureMiddlewares;
