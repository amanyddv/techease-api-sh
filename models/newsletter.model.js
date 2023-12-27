const mongoose=require('mongoose');

const newsletterSchema = mongoose.Schema({
    title: { type: String },
    content: { type: String }
  });
  
  const Newsletter = mongoose.model("newsletterCollection", newsletterSchema);

module.exports=Newsletter;