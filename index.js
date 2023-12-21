const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const nodemailer = require('nodemailer');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Database connection
mongoose.connect("mongodb+srv://vercel-admin-user-63b8143875b0f4614e499e12:G6FPKHcoZnC74XOu@cluster0.3bawqzz.mongodb.net/newsletterdb?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });

// Define the newsletter schema and model
const newsletterSchema = mongoose.Schema({
  title: { type: String },
  content: { type: String }
});

const Newsletter = mongoose.model("newsletterCollection", newsletterSchema);

const emailSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
  });
  
  const Email = mongoose.model('Email', emailSchema);

// Route for posting newsletter
app.post("/postnewsletter", async function (req, res) {
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

    await newsletterObject.save();

    // Fetch all email addresses from the database
    const emails = await Email.find({}, 'email');

    // Create a transporter for sending emails (replace with your email configuration)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: "techeasenewsletter@gmail.com",
        pass: "yitj prjp rqzf zeyv", 

      },
    });

    // Define the email content
    const mailOptions = {
      from: 'techeasenewsletter@gmail.com',
      subject: title,
      text: content,
    };

    // Send the newsletter to each email address
    for (const email of emails) {
      mailOptions.to = email.email;
      
      await transporter.sendMail(mailOptions);

      // Optional: Add a delay between sending emails to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    res.status(200).json({ message: 'Newsletter saved and sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

});

// Route for retrieving newsletter feeds
app.get("/newsletterfeeds", function (req, res) {
  console.log("Fetching newsletter feeds");
  
  Newsletter.find()
    .then((data) => {
      res.json(data);
      console.log(data);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Internal Server Error");
    });
});
app.get("/",function(req,res){
    res.send("work")
})

app.post("/subscribe", async function (req, res) {
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
    
        res.status(201).json({ message: 'Email address stored successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
  });

// Start the server
const PORT = 7000;
app.listen(PORT, function () {
  console.log(`Server is running on port ${PORT}`);
});
