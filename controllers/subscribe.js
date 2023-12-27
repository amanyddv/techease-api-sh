
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Newsletter = require('../models/newsletter.model');
const Email = require('../models/subscriber.email');
const emailUtils = require('../utils/emailUtil');
const thankyoumail=require('../utils/thankyoumail')
require('dotenv').config();

async function subscribe (req, res) {
    // Your existing subscribe route logic
    console.log("Fetching newsletter feeds");
  
    try {
      const { email } = req.body;
  
      // Validate if the email is provided
      if (!email) {
        return res.status(400).json({ error: 'Email address is required' });
      }
  
      // Create a new Email object
      const newEmail = new Email({ email });
  
      // Save the email to the database
      await newEmail.save();
  
      // Send a thank you email to the subscriber
      const transporter = emailUtils.createTransporter();

  
      
  
  
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Thank You for Subscribing! 🎉',
        html: thankyoumail,
      };
  
     await transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          console.log('Thank you email sent: ' + info.response);
          res.status(201).json({ message: 'Email address stored successfully' });
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

 
  module.exports=subscribe;