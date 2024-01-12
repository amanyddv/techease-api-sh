
const express = require('express');
const nodemailer = require('nodemailer');
const Newsletter = require('../models/newsletter.model');
const contactSchema = require('../models/contact.model');

async function contact(req, res) {
    // Your existing newsletterfeeds route logic
    console.log(req.body);
    
    obj=new contactSchema(req.body);
    await obj.save();

  };
  
 
  module.exports = {
    contact: contact
  };