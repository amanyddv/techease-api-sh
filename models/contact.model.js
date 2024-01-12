const mongoose = require("mongoose")

const contact = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    name:{type:String},
    query:{type:String},
  });
  
  const contactSchema = mongoose.model('Contact', contact);

  module.exports=contactSchema;