

var ex=require("express");
var app=ex()
const { createClient } = require('@supabase/supabase-js')
const bodyParser =require("body-parser")
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
const path =require('path')
const cors=require("cors");
app.use(cors());


const multer = require("multer");

var upload = multer({
}).single('file');



mongoose=require("mongoose");
const supabase = createClient(
 "https://oealfnepepsbsdmsnqkq.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lYWxmbmVwZXBzYnNkbXNucWtxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY3NDExMzAxNSwiZXhwIjoxOTg5Njg5MDE1fQ.z0WBLNt1hrWgrAuANfZ9Ck8jqNICuQ7ptB5IVsDzMO8"
);

uri="mongodb+srv://vercel-admin-user-63b8143875b0f4614e499e12:G6FPKHcoZnC74XOu@cluster0.3bawqzz.mongodb.net/socialmed?retryWrites=true&w=majority"
async function run(){
await mongoose.connect(uri);
}




prosocialmedchema=mongoose.Schema({name:{type:String},email:{type:String},password:{type:String},profile:{type:String}});
var profile=mongoose.model("profile",prosocialmedchema);

prosocialmedchema2=mongoose.Schema({email:{type:String},post:{type:String},comment:{type:String}});
var posts=mongoose.model("posts",prosocialmedchema2);

msg=mongoose.Schema({email:{type:String},msg:{type:String}})
var msg=mongoose.model("msg",msg);

app.post("/addData", upload ,async function(req,res) 
{
    filename="empty"
    if(req.file){
    filename=Date.now()+path.extname(req.file.originalname)
  await supabase.storage.from('socialmed').upload(filename, req.file.buffer,{
    headers: {
      'Content-Type': req.file.mimetype,
      'Content-Length': req.file.buffer
    }})  

    const  url =  await supabase
    .storage
    .from('socialmed')
    .getPublicUrl(filename, 60)

    }
        const k = new profile({
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            profile:filename
        });
        res.json(k)
        k.save()
    });
    



app.post("/showData" ,async function(req,res){
    
   
    profile.findOne({email:req.body.email,password:req.body.password},function(err,k){
       if(err){
        res.json(err)
       }
       else{
       res.json(k)
       }
    });
    
});

app.post("/feed",async function(req,res){
    
    console.log(req.body.email)
   
    posts.find({email:req.body.email},function(err,feed){
           
            res.json(feed)
        
    });
});

app.post("/addPost" ,upload,async function(req,res){
    

    filename="empty"
    if(req.file){
    console.log(req.body)
    filename=Date.now()+path.extname(req.file.originalname)
  await supabase.storage.from('socialmed').upload(filename, req.file.buffer,{
    headers: {
      'Content-Type': req.file.mimetype,
      'Content-Length': req.file.buffer
    }})  

    const  url =  await supabase
    .storage
    .from('socialmed')
    .getPublicUrl(filename, 60)
    }
        d={
            email:req.body.email,
            comment:req.body.comment,
            post:filename
        }
        
        let k = new posts(d);
        res.json(k)
        k.save()
    
});

app.get("/peopleInfo" ,async function(req,res){
    
    profile.find(function(req,data){
        res.json(data)
        console.log(data)
    });
});

app.post("/send" ,async function(req,res){
    
    d={
        email:req.body.email,
        msg:req.body.msg
    }
    res.json(d)
    let k=new msg(d)
    k.save()
})
app.get("/chat" ,async function(req,res){
    
    msg.find(function(req,data){
        res.json(data)
        console.log(data)
    });
})
app.post("/forget" ,async function(req,res){
    
   
    var myquery = {email:req.body.email} && {password:req.body.oldpassword};
    var newvalues = { $set: {password:req.body.newpassword} };
    profile.updateOne(myquery,newvalues, function(err, res) {
        if (err) throw err;
        console.log("1 document updated");
      });
    })
    

app.post("/changepic",upload ,async function(req,res){
    
    filename="empty"
    if(req.file){
    console.log(req.body)
    filename=Date.now()+path.extname(req.file.originalname)
  await supabase.storage.from('socialmed').upload(filename, req.file.buffer,{
    headers: {
      'Content-Type': req.file.mimetype,
      'Content-Length': req.file.buffer
    }})  

    const  url =  await supabase
    .storage
    .from('socialmed')
    .getPublicUrl(filename, 60)
    }
        console.log(filename)
        var myquery = {email:req.body.email} ;
        var newvalues = { $set: {profile:filename} };
        profile.updateOne(myquery,newvalues, function(err, res) {
            if (err) throw err;
            console.log("1 document updated");
          });
        
          res.json(filename)

        });
        
 


run()
app.listen(7000,function(){
    console.log("server is running");});
