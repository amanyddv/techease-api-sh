// routes.js
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Newsletter = require('../models/newsletter.model');
const Email = require('../models/subscriber.email');
const newsletterfeeds=require('../controllers/newsletterfeeds')
const subscribe=require('../controllers/subscribe');
const postnewsletter = require('../controllers/postnewsletter');

// Define middleware and routes here

router.post('/postnewsletter',postnewsletter);

// Route for retrieving newsletter feeds

router.get("/",function(req,res){
    res.send("work")
});

router.get('/newsletterfeeds',newsletterfeeds) 
router.get('/', function (req, res) {
    res.send('work');
  });
  
  router.post('/subscribe', subscribe)
module.exports = router;
