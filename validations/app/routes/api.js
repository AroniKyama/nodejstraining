var User = require('../models/user');
var jwt = require('jsonwebtoken');
var secret='harrypotter';

module.exports= function(router){
    //user Registration route
    router.post('/users',function(req,res){
        var user = new User();
        user.name=req.body.name;
        user.username = req.body.username;
        user.password = req.body.password;
        user.email = req.body.email;
        
           // Check if request is valid and not empty or null
        if (req.body.name === null || req.body.name === ''||req.body.username === null || req.body.username === '' || req.body.password === null || req.body.password === '' || req.body.email === null || req.body.email === ''  ) {
            res.json({ success: false, message: 'Ensure username, email, and password were provided' });
        } else {
            // Save new user to database
            user.save(function(err) {
                if (err) {
                    // Check if any validation errors exists (from user model)
                    if (err.errors !== null) {
                        if (err.errors.name) {
                            res.json({ success: false, message: err.errors.name.message }); // Display error in validation (name)
                        } else if (err.errors.email) {
                            res.json({ success: false, message: err.errors.email.message }); // Display error in validation (email)
                        } else if (err.errors.username) {
                            res.json({ success: false, message: err.errors.username.message }); // Display error in validation (username)
                        } else if (err.errors.password) {
                            res.json({ success: false, message: err.errors.password.message }); // Display error in validation (password)
                        } else {
                            res.json({ success: false, message: err }); // Display any other errors with validation
                        }
                    } else if (err) {
                        // Check if duplication error exists
                        if (err.code == 11000) {
                            
                                res.json({ success: false, message: 'That username/email is already taken' }); // Display error if username already taken
                           
                        } else {
                            res.json({ success: false, message: err }); // Display any other error
                        }
                    }
               } else{
                        res.json({success:true,message:'user created'});
                    }
                 });
               }
            });
    //user LOGIN route
    router.post('/authenticate',function(req,res){
        User.findOne({username : req.body.username}).select('email username password').exec(function(err,user){
            if(err) throw err;
            if(!user){
                res.json({success:false,message:'could not authenticate user'});
            }else if(user){
                if(req.body.password){
               var validPassword= user.comparePassword(req.body.password);
                }else{
                    res.json({success:false,message:"no password provided"});
                }
               if(!validPassword){
                   res.json({success:false,message:'could not authenticate password'});
               }else{
                    var token=jwt.sign({username:user.username,email:user.email},secret,{expiresIn:'24h'});
                   res.json({success:true,message:'user autheticated', token: token});
               }
            }

        });
    });
    router.use(function(req,res,next){
        var token=req.body.token||req.body.query||req.headers['x-access-token'];
        if(token){
            //verify token
            jwt.verify(token,secret, function(err, decoded) {
                if(err){
                    res.json({success:false,message:"token invalid"});
                }else{
                    req.decoded=decoded;
                    next();
                }
              });
        }
        else{
            res.send({success:false,message:"no token provided"});
        }
    });

    router.post('/me',function(req,res){
        res.send(req.decoded);
    });
    return router;
}



