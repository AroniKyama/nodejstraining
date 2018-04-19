var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require('body-parser');
var port = 3000;
 
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/node-demo");

//app config
app.set("view engine","ejs");
app.use(express.static("public"));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//mangoose/model config
var nameSchema = new mongoose.Schema({
    firstName: String,
    lastName: String
  });

  var User = mongoose.model("User", nameSchema);
  

//routes
app.get("/", (req, res) => {
    res.render("index");
});

app.post("/users", (req, res) => {
  var myData = new User(req.body);
  myData.save()
    .then(item => {
      console.log("item saved to database");
      res.render("userlist");
    })
    .catch(err => {
      console.log("unable to save to database");
    });
});

app.get("/users",(req,res)=>{
  User.find({},function(err,users){
    if(err){
      console.log("error");
    }
    else{
      res.render("userlist", {"users": users});
    }
  });
 
})


 
app.listen(port, () => {
  console.log("Server listening on port " + port);
});