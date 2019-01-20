const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserMachine = new Schema({
    userid : {type: String, require: true, unique: true}, //ログイン用のuserid
    usernumber : {type : Number, require: true, unique: true}, //内部用のuserid
    machines : [{
        open_machine_id : {type : String, require: true}, //公開用の機器ID
        name : {type: String, require: true}, //機器の実名称
        display_name : {type: String, require: true}, //表示用の名称
        description : {type : String}, //機器の説明
        type : {type: String, require: true}, //機器の種類 ex)ルータ スイッチ
        x : {type: Number, require: true}, //canvas上のx座標
        y : {type: Number, require: true}, //canvas上のy座標
        ports : [{
            status: {type: Number, require: true}, //0, 設定が無効 1, 接続がされていない 2, 接続中
            open_port_id : {type: String, require: true}, //公開用ポートID
            port_name : {type: String, require: true}, //実ポート名
            open_port_number : {type: Number, require: true}, //公開用のポート番号
            opposed_open_port_id: {type: String, require: true}, //対向ポートid
            opposed_port_name :  {type: String, require: true}, //対向実ポート名
            ip_address : {type: String}, //ポートipアドレス
            mac_address : {type: String}, //ポートmacアドレス
            x : {type: Number, require: true}, //canvas描画時の線のx座標
            y : {type: Number, require: true} //canvas描画時の線のy座標
        }]
    }]
});

module.exports = mongoose.model('usermachine', UserMachine);

