// app.js
const express = require('express');
const mongoose = require('mongoose');
const configureMiddlewares = require('./middlewares/configureMiddlewares');
const routes = require('./routes/routes');

const app = express();

// Configure middlewares
configureMiddlewares(app);

// mongoose.connect("mongodb://localhost:27017/newsletterdb");

// Use the routes in the app
app.use('/', routes);

// Start the server
module.exports = app;
