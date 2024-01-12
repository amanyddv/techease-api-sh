
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const subscribeSphere = require('../models/subscribeSphere.model');
const Email = require('../models/subscriber.email');
const sendEmail = require('../utils/sendmail');

require('dotenv').config();
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
  });
  
  const userRegistraionData={}
  
  
  function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000);
  }
  
  // Temporary storage for OTP verification
  const otpData = {};
  
  // Registration endpoint
  async function userRegistration(req, res){
    console.log(req.body.email)
    const { email } = req.body;
    try {
      // Generate OTP
      console.log("receive")
      const otp = generateOTP();
  
      // Set OTP expiration to 30 seconds from now
      const otpExpiration = Date.now() + 60000;
  
      // Store OTP and its expiration in temporary storage
      otpData[email] = {
        otp,
        otpExpiration,
      };
      userRegistraionData[email]={
       
    email:req.body.email,
    title:req.body.title,
   
      }
      console.log("check")
      console.log(userRegistraionData[email])
      // Send OTP via email
      await sendOTPviaEmail(email, otp);
  
      return res.json({ message: 'OTP sent successfully' });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ message: 'Failed to send OTP' });
    }
  };
  
  
  // Send OTP via email
  async function sendOTPviaEmail(email, otp){
    console.log(otp)
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER, // sender address
        to: email,
        subject: 'OTP Verification',
        html: `
        <html>
          <body>
            <div style="text-align: center; padding: 20px;">
              <h1>🌟 Hello!</h1>
              <p>Thank you for registering. Your OTP (One-Time Password) for verification is: <strong>${otp}</strong>.</p>
              <p>🕒 Please use this code within the next 60 seconds to complete the registration process.</p>
              <p style="font-size: 14px; color: #777;">(This OTP is valid for a short duration for security reasons.)</p>
            </div>
          </body>
        </html>
      `,
      });
      
    } catch (error) {
      throw new Error('Failed to send OTP via email');
    }
  }
  
  async function verifyOTPAndRegister(req, res){
    console.log('verify');
    const { otp, email } = req.body;
    console.log(email)
    console.log(otp)
    const storedOTPData = otpData[email];
    console.log(storedOTPData.otp)
    console.log(storedOTPData.otpExpiration)
  
    const userData=userRegistraionData[email];
    console.log(userData)
    obj = {
      
      email:userData.email,
      title:userData.title,
     
  
    }
   
  
  
    if (!storedOTPData) {
      console.log('Invalid email')
  
      return res.status(400).json({ message: 'Invalid email' })
    }
    otpExpiration=storedOTPData.otpExpiration;
    storedOTP=storedOTPData.otp
    console.log( otp)
    if (otp == storedOTPData.otp && Date.now() <= storedOTPData.otpExpiration) {
      console.log('match')
      // OTP is valid
      // Perform additional registration lgic here
  
      // Clear OTP data for the verified email
      //   delete otpData[email];
      console.log(obj)
      const ss = new subscribeSphere( obj );
      console.log(ss)

      await ss.save();
  
      console.log('OTP verification successful')
  
      obj.password=""
      obj.message="OTP verification successful"
      return res.json(obj);
    } else if (otp != storedOTP) {
      console.log('Invalid OTP')
  
      return res.json({ message: 'Invalid OTP' });
    } else if (Date.now() > otpExpiration) {
      console.log('expired')
      return res.json({ message: 'OTP has expired' });
    }
  };
  
  module.exports = {
    userRegistration,verifyOTPAndRegister,
  };