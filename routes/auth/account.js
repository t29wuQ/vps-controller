const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongose = require('mongoose');
const User = require('../../models/user');

router.post('/signup', function(req, res){
    let userid = req.body.userid;
    let password = req.body.password;
    User.find({"userid" : userid}, function(err, result){
        if (err)
            console.log(err);
        if (result.length == 0){
            console.log("register");
            let user = new User();
            user.userid = userid;
            user.password = password;
            user.save(function(err){
                if (err)
                    console.log(err);
                    res.send("new created account");
            });
        } else {
            res.send('already userid');
        }
    });
});

router.post('/signin', function(req, res){
    let userid = req.body.userid;
    let password = req.body.password;
    User.find({"userid" : userid}, function(err, result){
        if (err)
            console.log(err);
        if (result[0].password == password)
            res.send('true');
        else
            res.send('Faild login');
    });
});


module.exports = router;