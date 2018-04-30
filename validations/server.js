var express = require("express");
var morgan = require("morgan");
var mongoose = require("mongoose");
var app = express();
var bodyParser = require('body-parser');
var router = express.Router();
var appRoutes = require('./app/routes/api')(router);
var path = require('path');
var passport=require('passport');
var social= require('./app/passport/passport')(app,passport)
var port = 3000;

app.use(morgan('dev')); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname+'/public'));
app.use('/api',appRoutes);

mongoose.connect("mongodb://localhost:27017/fittalks",function(err){
    if(err){
        console.log("not connected to database"+err);
    }
    else{
        console.log("connected to database");
    }

});

app.get('*',function(req,res){
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});




app.listen(port, () => {
    console.log("Server listening on port " + port);
  });