const mongoose=require('mongoose');

const subscribeSphereSphere = mongoose.Schema({
    title: { type: String },
    email: { type: String }
  });
  
  const subscribeSphere = mongoose.model("subscribeSphere", subscribeSphereSphere);

module.exports=subscribeSphere;