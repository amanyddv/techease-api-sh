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

mongoose.connect("mongodb+srv://vercel-admin-user-63b8143875b0f4614e499e12:G6FPKHcoZnC74XOu@cluster0.3bawqzz.mongodb.net/newsletterdb?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });

// mongoose.connect("mongodb://localhost:27017/newsletterdb")

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

    // await newsletterObject.save();

    // Fetch all email addresses from the database
    const emails = await Email.find({}, 'email');
    const emailList = emails.map(({ email }) => email);
    
    console.log(emailList);
    // Create a transporter for sending emails (replace with your email configuration)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: "Techeasenewsletter@gmail.com",
        pass: "hxkg gtli wgmb pncb", 
      },
    });

    // Send the newsletter to each email address

      const mailOptions = {
        from: "Techeasenewsletter@gmail.com",
        to:"techeasenewsletter@gmail.com",
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

    // Send a thank you email to the subscriber
    const transporter = nodemailer.createTransport({
      // Use the appropriate configuration for your email service
      service: 'gmail',
      auth: {
        user: "Techeasenewsletter@gmail.com",
        pass: "hxkg gtli wgmb pncb",
      }
    });

    const emailTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank You for Subscribing!</title>
</head>
<body style="font-family: Arial, sans-serif;">

    <h1 style="color: #4285f4;">Thank You for Subscribing to Techease Newsletter! 🎉</h1>

    <p>Hello Learner,</p>

    <p>Thank you for subscribing to the Techease newsletter! 🙌 We're excited to have you join our community where we share valuable insights and updates on various topics, including:</p>

    <ul>
        <li><strong>Coding Tips:</strong> Enhance your coding skills with useful tips and tricks.</li>
        <li><strong>Computer Science:</strong> Stay updated on the latest trends and advancements in computer science.</li>
        <li><strong>Fellowship Programs:</strong> Discover fellowship programs for professional development.</li>
        <li><strong>Hackathon Updates:</strong> Stay informed about upcoming hackathons and coding challenges.</li>
        <li><strong>IT Job Openings:</strong> Explore the latest job opportunities in the IT industry.</li>
        <li><strong>Interview Questions:</strong> Get prepared with commonly asked interview questions and tips.</li>
        <li><strong>Web Tech Insights:</strong> Explore insights into web technologies and development.</li>
    </ul>

    <p>We appreciate your interest in Techease. If you have any questions, suggestions, or specific topics you'd like us to cover, feel free to reach out to us at <a href="mailto:techeasenewsletter@gmail.com">techeasenewsletter@gmail.com</a>!</p>

    <p>Stay connected with us on Twitter! Follow <a href="https://twitter.com/TecheaseN" target="_blank">TecheaseN</a> for the latest updates, tech news, and more.</p>

    <p>Once again, welcome to the Techease community. We look forward to providing you with valuable information and keeping you updated on the exciting world of technology.</p>

    <p>Best regards,<br>
        Techease Newsletter Team<br>
    </p>

</body>
</html>
`;

// Now you can use the emailTemplate string as needed in your code.

    const mailOptions = {
      from: "techeasenewsletter@gmail.com",
      to: email,
      subject: 'Thank You for Subscribing! 🎉',
      html: emailTemplate,
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
});

// Start the server
const PORT = 7000;
app.listen(PORT, function () {
  console.log(`Server is running on port ${PORT}`);
});