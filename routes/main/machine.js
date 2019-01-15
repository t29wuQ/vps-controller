const express = require('express');
const router = express.Router();
const UserMachine = require('../../models/machine');
const exec = require('child_process').exec;
const execPath = require('path').resolve(__dirname, './exec.sh');
const randomID = require('../../crypto/random_id');

//ルータの追加
router.post('/router/add', function(req, res){
    
    let userid = req.session.userid;
    
    UserMachine.find({"userid" : userid}, function(error, result){
        if (error)
            res.send(error);
        let userMachine = result[0];
        let name = userid + userMachine.machines.length;
        let id = (String(userMachine.usernumber) + String(userMachine.machines.length) + "0000000000000000").slice(0, 16);
        let type = "router";
        let x = req.body.x;
        let y = req.body.y;
        exec(execPath + " 'ovs-vsctl add-br " + name + "'", function(error, stdout, stderr){
            if (error)
                res.send(error);
            console.log("ovs-vsctl add-br " + name + " stdout: " + stdout);
            console.log("ovs-vsctl add-br " + name + " stderr: " + stderr);
            exec(execPath + " 'ovs-vsctl set bridge " + name + " other-config:datapath-id=" + id + "'", function(error, stdout, stderr){
                if (error)
                    res.send(error);
                console.log("ovs-vsctl set bridge " + name + " other-config:datapath-id=" + id + " stdout: " + stdout);
                console.log("ovs-vsctl set bridge " + name + " other-config:datapath-id=" + id + " stderr: " + stderr);
                let router = { id : id, name : name, type : "router", x : x, y : y};
                result[0].machines.push(router);
                result[0].save(function(error){
                    if (error)
                        res.send(error);
                    res.send("success : add router on your topology");
                });
                
            });
        });
    });
});

//ルータの削除
router.post('/router/del', function(req, res){

});

//スイッチの追加
router.post('/switch/add', function(req, res){
    let userid = req.session.userid;
    
    UserMachine.find({"userid" : userid}, function(error, result){
        if (error)
            res.send(error);
        let userMachine = result[0];
        let name = userid + userMachine.machines.length;
        let id = (String(userMachine.usernumber) + String(userMachine.machines.length) + "0000000000000000").slice(0, 16);
        let type = "switch";
        let x = req.body.x;
        let y = req.body.y;
        exec(execPath + " 'ovs-vsctl add-br " + name + "'", function(error, stdout, stderr){
            if (error)
                res.send(error);
            console.log("ovs-vsctl add-br " + name + " stdout: " + stdout);
            console.log("ovs-vsctl add-br " + name + " stderr: " + stderr);
            exec(execPath + " 'ovs-vsctl set bridge " + name + " other-config:datapath-id=" + id + "'", function(error, stdout, stderr){
                if (error)
                    res.send(error);
                console.log("ovs-vsctl set bridge " + name + " other-config:datapath-id=" + id + " stdout: " + stdout);
                console.log("ovs-vsctl set bridge " + name + " other-config:datapath-id=" + id + " stderr: " + stderr);
                let router = { id : id, name : name, type : "router", x : x, y : y};
                result[0].machines.push(router);
                result[0].save(function(error){
                    if (error)
                        res.send(error);
                    res.send("success : add switch on your topology");
                });
                
            });
        });
    });
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

const addMachine = function(name, id){
    exec(execPath + " 'ovs-vsctl add-br " + name + "'", function(error, stdout, stderr){
        if (error || stderr)
            return -1;
        console.log("stdout" + stdout);
        exec(execPath + " 'ovs-vsctl set bridge " + name + " other-config:datapath-id=" + id, function(error, stdout, stderr){
            if (error || stderr)
                return -1;
            console.log("stdout" + stdout);
            return 0;
        });
    });
}

module.exports = router;