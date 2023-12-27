
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Newsletter = require('../models/newsletter.model');
const Email = require('../models/subscriber.email');

async function newsletterfeeds(req, res) {
    // Your existing newsletterfeeds route logic
    console.log("Fetching newsletter feeds");
    
    await Newsletter.find()
      .then((data) => {
        res.json(data);
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Internal Server Error");
      });
  };
  
 
  module.exports=newsletterfeeds;