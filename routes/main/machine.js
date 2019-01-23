const express = require('express');
const router = express.Router();
const UserMachine = require('../../models/machine');
const exec = require('child_process').exec;
const execPath = require('path').resolve(__dirname, './exec.sh');
const queryExec = require("../../query_exec");
require('date-utils');


/**
 * エラー文のjsonを返す
 * @param {String} error 
 */
const getErrorJson = function(error){
    return {status: 1, log: error};
}

/**
 * shellコマンドを実行する
 * @param {String} command 実行コマンド
 */
const execShellCommand = function(command){
    return new Promise(function(resolve, reject){
        exec(execPath + " " + command, function(error, stdout, stderr){
            if (error){
                console.log(command + " execShellCommand Error: " + error);
                reject(new Error(error));
                return;
            }
            resolve({stdout: stdout, stderr: stderr});
        });
    })
}


/**
 * ルーターの追加
 */
router.post('/router/add', async function(req, res){
    try{
        const user_id_search = await queryExec("select login_id, user_id from user where login_id='"+req.session.login_id+"';")
        const user_id = user_id_search[0].user_id;
        const name = user_id+"_router_"+new Date().toFormat("YYYYMMDDHH24MISS");
        const command = "'ip netns add " + name + "'";
        console.log(command + "-> " + await execShellCommand(command));
        const open_id = "router_"+new Date().toFormat("YYYYMMDDHH24MISS");
        const display_name = "router";
        const type = "router";
        const x = req.body.x;
        const y = req.body.y;
        await queryExec("insert into machine (open_id, user_id, name, display_name, type, x, y) values ('"
                        +open_id+"','"+user_id+"','"+name+"','"+display_name+"','"+type+"',"+x+","+y+");");
        res.json({
            status: 0,
            id: open_id,
            name: display_name,
            log: "Success: add router on your topology"
        });
    } catch(error){
        console.log(error);
        res.json(getErrorJson(error));
    }
});

//ルータの削除
router.post('/router/del', function(req, res){

});

/**
 * スイッチの追加
 * OpenVSwitchのbridge名は15文字を超えるとエラーを吐くので乱数で生成
 */
router.post('/switch/add', async function(req, res){
    try{
        const user_id_search = await queryExec("select login_id, user_id from user where login_id='"+req.session.login_id+"';")
        const user_id = user_id_search[0].user_id;
        let name = ""; //15文字
        let search_name;
        const switch_name_char_set = "abcdefghijklmnopqrstuvwxyz0123456789";
        do {
            name = "";
            for (let i=0;i < 15;i++)
                name += switch_name_char_set[Math.floor(Math.random()* switch_name_char_set.length)];
            search_name = await queryExec("select name from machine where name='"+name+"';");
        } while (search_name.length != 0); //既存のbridge名と重複したら再生性
        const command = "'ovs-vsctl add-br " + name + "'";
        console.log(command + "-> " + await execShellCommand(command));
        const open_id = "switch_"+new Date().toFormat("YYYYMMDDHH24MISS");
        const display_name = "switch";
        const type = "switch";
        const x = req.body.x;
        const y = req.body.y;
        await queryExec("insert into machine (open_id, user_id, name, display_name, type, x, y) values ('"
                        +open_id+"','"+user_id+"','"+name+"','"+display_name+"','"+type+"',"+x+","+y+");");
        res.json({
            status: 0,
            id: open_id,
            name: display_name,
            log: "Success: add switch on your topology"
        });
    } catch(error){
        console.log(error);
        res.json(getErrorJson(error));
    }
});

//スイッチの削除
router.post('/switch/del', function(req, res){

});

//仮想マシンの追加
router.post('/vm/add', async function(req, res){
    try{
        const user_id_search = await queryExec("select login_id, user_id from user where login_id='"+req.session.login_id+"';")
        const user_id = user_id_search[0].user_id;
        const name = user_id+"_vm_"+new Date().toFormat("YYYYMMDDHH24MISS");
        const open_id = "vm_"+new Date().toFormat("YYYYMMDDHH24MISS");
        const display_name = "vm";
        const type = "vm";
        const x = req.body.x;
        const y = req.body.y;
        await queryExec("insert into machine (open_id, user_id, name, display_name, type, x, y) values ('"
                        +open_id+"','"+user_id+"','"+name+"','"+display_name+"','"+type+"',"+x+","+y+");");
        res.json({
            status: 0,
            id: open_id,
            name: display_name,
            log: "Success: add vm on your topology"
        });
    } catch(error){
        console.log(error);
        res.json(getErrorJson(error));
    }
});

//仮想マシンの削除
router.post('/vm/del', function(req, res){
    
});


/**
 * ポートの追加
 */
router.post('/port/add', async function(req,res){
    try{
        const user_id_search = await queryExec("select login_id, user_id from user where login_id='"+req.session.login_id+"';");
        const user_id = user_id_search[0].user_id;
        const is_exist_machine = await queryExec("select open_id, user_id from machine where open_id='"+req.body.id+"' and user_id='"+user_id+"';");
        if (is_exist_machine.length == 0){
            res.json({
                status: 1,
                log: "Error"
            });
            return;
        }
        const port_sum_search = await queryExec("select machine_id from port where machine_id='"+req.body.id+"';");
        const open_number = port_sum_search.length;
        open_id = "port_"+new Date().toFormat("YYYYMMDDHH24MISS");
        await queryExec("insert into port (open_id, machine_id, open_number) values ('"
                        +open_id+"','"+req.body.id+"','"+open_number+"');");
        res.json({
            status: 0,
            id: open_id,
            number: open_number,
            log: "Success: add port on your machine"
        });
    } catch(error){
        console.log(error);
        res.json(getErrorJson(error));
    }
});


/**
 * vethの追加
 */
router.post('/veth/add', async function(req, res){
    
});

//vethの削除
router.post('/veth/del', function(req, res){

});

module.exports = router;