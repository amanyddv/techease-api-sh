
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Newsletter = require('../models/newsletter.model');
const Email = require('../models/subscriber.email');
require('dotenv').config();

const emailUtils = require('../utils/emailUtil');


async function postnewsletter (req, res) {
    // Your existing postnewsletter route logic
    console.log(req.body);
  
    try {
      const { title, content } = req.body;
  
      // Validate if title and content are provided
      if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
      }
  
      // Save the newsletter to the database
      const newsletterObject = new Newsletter({
        title,
        content,
      });
  
      // await newsletterObject.save();
  
      // Fetch all email addresses from the database
      const emails = await Email.find({}, 'email');
      const emailList = emails.map(({ email }) => email);
      
      console.log(emailList);
      // Create a transporter for sending emails (replace with your email configuration)
      const transporter = emailUtils.createTransporter();

  
      // Send the newsletter to each email address
  
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to:process.env.EMAIL_USER,
          bcc: emailList,
          subject: title,
          html: content,
        };
  
  
        await transporter.sendMail(mailOptions);
        
        // Optional: Add a delay between sending emails to avoid rate limiting
        // await new Promise(resolve => setTimeout(resolve, 1000));
      
  
      res.status(200).json({ message: 'Newsletter saved and sent successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }  
 
  module.exports=postnewsletter;