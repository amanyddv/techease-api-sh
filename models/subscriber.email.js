const mongoose = require("mongoose")

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

  module.exports=Email;