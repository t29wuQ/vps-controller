const express = require('express');
const router = express.Router();
const UserMachine = require('../../models/machine');
const exec = require('child_process').exec;
const execPath = require('path').resolve(__dirname, './exec.sh');
const queryExec = require("../../query_exec");
require('date-utils');

const random_name_char_set = "abcdefghijklmnopqrstuvwxyz0123456789";

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
        do {
            name = "";
            for (let i=0;i < 15;i++)
                name += random_name_char_set[Math.floor(Math.random()* random_name_char_set.length)];
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
        await queryExec("insert into port (open_id, user_id, machine_id, open_number) values ('"
                        +open_id+"','"+user_id+"','"+req.body.id+"','"+open_number+"');");
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
    try{
        const user_id_search = await queryExec("select login_id, user_id from user where login_id='"+req.session.login_id+"';");
        const user_id = user_id_search[0].user_id;
        const open_id = "veth_"+new Date().toFormat("YYYYMMDDHH24MISS");
        const port_id = [req.body.port1, req.body.port2];
        const machine_list = [];
        for (let i = 0;i < 2;i++){
            const get_machine_id = await queryExec("select open_id, machine_id from port where open_id='"+port_id[i]+"';")
            if (get_machine_id.length == 0){
                console.log("存在しないポートです");
                return;
            }
            const is_exist_machine = await queryExec("select open_id, user_id, type from machine where open_id='"+get_machine_id[0].machine_id+"' and user_id='"+user_id+"';");
            if (is_exist_machine == 0){
                console.log("存在しない機器です");
                return;
            }
            let name = ""; //15文字
            let search_name1, search_name2;
            do {
                name = "";
                for (let i=0;i < 15;i++)
                    name += random_name_char_set[Math.floor(Math.random()* random_name_char_set.length)];
                search_name1 = await queryExec("select name from port where name='"+name+"';");
                search_name2 = await queryExec("select name from machine where name='"+name+"';");
            } while (search_name1.length != 0 || search_name2.length != 0); //既存のbridge名と重複したら再生性
            machine_list.push({machine: is_exist_machine, port_name: name, port_id: port_id[i]});
        }
        console.log(machine_list.length);
        if (machine_list.length != 2){
            res.json({
                status: 1,
                log: "Error"
            });
            return;
        }
        const command = "'ip link add "+machine_list[0].port_name+" type veth peer name "+machine_list[1].port_name+"'";
        console.log(command + "-> " + await execShellCommand(command));
        for (let i = 0;i < 2;i++){
            if (machine_list[i].type == "router"){
                const command = "'ip link set "+machine_list[i].port_name+" netns "+machine_list[i].name+" up'";
                console.log(command + "-> " + await execShellCommand(command));
            } else if (machine_list[i].type == "switch"){
                const command = "'ovs-vsctl add-port "+machine_list[i].name+" "+machine_list[i].port_name+"'";
                console.log(command + "-> " + await execShellCommand(command));
            } else if (machine_list[i].type == "vm"){

            }
            await queryExec("update port set name='"+machine_list[i].port_name+"' where open_id='"+machine_list[i].port_id+"';");
        }
        await queryExec("insert into veth (open_id, user_id, port1, port2) values ('"
                        +open_id+"','"+user_id+"','"+machine_list[0].port_id+"','"+machine_list[1].port_id+"');");
        res.json({
            status: 0,
            id: open_id,
            log: "Success: connection port"
        });
    } catch(error){
        console.log(error);
        res.json(getErrorJson(error));
    }
});

//vethの削除
router.post('/veth/del', function(req, res){

});

/**
 * ユーザーの機器ポートvethを全て読み込み返す
 */
router.get('/load', async function(req, res){
    try{
        const user_id_search = await queryExec("select login_id, user_id from user where login_id='"+req.session.login_id+"';");
        const user_id = user_id_search[0].user_id;
        const get_machine = await queryExec("select open_id, user_id, display_name, description, type, x, y from machine where user_id='"+user_id+"';");
        const get_port = await queryExec("select open_id, user_id, machine_id, open_number, ip_address, mac_address from port where user_id='"+user_id+"';");
        const get_veth = await queryExec("select open_id, user_id, port1, port2 from veth where user_id='"+user_id+"';");
        const machine_json = []
        const port_json = []
        const veth_json = []
        get_machine.forEach(machine => {
            machine_json.push({id: machine.open_id, name: machine.display_name, description: machine.description, type: machine.type, x: machine.x, y: machine.y});
        });
        get_port.forEach(port => {
            port_json.push({id: port.open_id, machine_id: port.machine_id, number: port.open_number, ip_address: port.ip_address, mac_address: port.mac_address})
        });
        get_veth.forEach(veth => {
            veth_json.push({id: veth.open_id, port1: veth.port1, port2: veth.port2});
        });
        res.json({
            machine: machine_json,
            port: port_json,
            veth: veth_json
        });
    } catch(error){
        console.log(error);
        res.json(getErrorJson(error));
    }
});

module.exports = router;