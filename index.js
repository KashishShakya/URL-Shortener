const express = require("express");
const fs = require('fs');
const path = require('path');

const app=express();
const PORT = 3000;
const data = path.join(__dirname, "./urls.json");
app.set("view engine", "ejs");
app.set("views",path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/',  (req,res)=>{
  let urls={};
  if(fs.existsSync(data)){
    urls=JSON.parse(fs.readFileSync(data,"utf-8"));
  }
  return res.render("main", {urls, request:req});
});

app.post("/shorten", (req,res)=>{
  const longUrl = req.body.longUrl;
  const shortId = Math.random().toString(36).substring(2,8);
  let urls ={};
  if(fs.existsSync(data)){
    urls=JSON.parse(fs.readFileSync(data,"utf-8"));
  }
  urls[shortId] = longUrl;
  fs.writeFileSync(data, JSON.stringify(urls,null,2));
  res.redirect("/");
});

app.get("/:shortId",(req,res)=>{
  const urls = JSON.parse(fs.readFileSync(data,"utf-8"));
  const longUrl = urls[req.params.shortId];
  if(longUrl){
    res.redirect(longUrl);
  }
  else{
    res.status(404).send("Short URL not found");
  }
});



app.listen(PORT,()=>console.log(`Server started at http://localhost:${PORT}`))