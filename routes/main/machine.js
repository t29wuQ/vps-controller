const express = require('express');
const router = express.Router();
const UserMachine = require('../../models/machine');
const exec = require('child_process').exec;
const execPath = require('path').resolve(__dirname, './exec.sh');

//ルータの追加
router.post('/router/add', function(req, res){
    exec(execPath + " 'ovs-vsctl add-br " + req.body.name + "'", function(error, stdout, stderr){
        if (error)
            console.log(error);
        console.log("stdout" + stdout);
        console.log("stderr" + stderr);
        res.send('test');
    });
    // let userid = req.session.userid;
    // let name = req.body.name;
    // let type = "router";
    // let x = req.body.x;
    // let y = req.body.y;
    // let machine = {id}
    
    // UserMachine.find({"userid" : userid}, function(err, result){
    //     if (err)
    //         console.log(err);
    //     exec("../exec.sh ovs-vsctl add-br " + name, function(error, stdout, stderr){
    //         if (error)
    //             console.log(error);
    //         console.log("stdout" + stdout);
    //         console.log("stderr" + stderr);
    //     });
        
    //     usermachine.userid = userid;
    //     usermachine.
    //     user.save(function(err){
    //         if (err)
    //             console.log(err);
    //         res.send("new created account");
    //     });
    // });
});

//ルータの削除
router.post('/router/del', function(req, res){

});

//スイッチの追加
router.post('/switch/add', function(req, res){

});

//スイッチの削除
router.post('/switch/del', function(req, res){

});

//仮想マシンの追加
router.post('/vm/add', function(req, res){

});

//仮想マシンの削除
router.post('/vm/del', function(req, res){

});

//vethの追加
router.post('/veth/add', function(req, res){

});

//vethの削除
router.post('/veth/del', function(req, res){

});

module.exports = router;