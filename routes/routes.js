// routes.js
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Newsletter = require('../models/newsletter.model');
const Email = require('../models/subscriber.email');
const newsletterfeeds=require('../controllers/newsletterfeeds')
const subscribe=require('../controllers/subscribe');
const postnewsletter = require('../controllers/postnewsletter');
const { userRegistration ,verifyOTPAndRegister} = require('../controllers/subscribeSphere');
const {contact}=require('../controllers/contact')
// Define middleware and routes here

router.post('/postnewsletter',postnewsletter);

// Route for retrieving newsletter feeds

router.get("/",function(req,res){
    res.send("work")
});

router.get('/newsletterfeeds',newsletterfeeds) 

  
  router.post('/subscribe', subscribe)


  // Define your route for sending OTP
  router.post('/sendOTP', userRegistration);
  
  // Define your route for verifying OTP and registering email
  router.post('/verifyOTPAndRegister', verifyOTPAndRegister);

  router.post('/contact',contact);
  
  module.exports = router;
