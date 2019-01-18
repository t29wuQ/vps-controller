const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserMachine = new Schema({
    userid : {type: String, require: true, unique: true}, //ログイン用のuserid
    usernumber : {type : Number, require: true, unique: true}, //内部用のuserid
    machines : [{
        name : {type: String, require: true, unique: true}, //機器の名称
        display_name : {type: String, require: true}, //表示用の名称
        description : {type : String}, //機器の説明
        type : {type: String, require: true}, //機器の種類 ex)ルータ スイッチ
        x : {type: Number, require: true}, //canvas上のx座標
        y : {type: Number, require: true}, //canvas上のy座標
        port : [{
            status: {type: Number, require: true}, //0, 設定が無効 1, 接続がされていない 2, 接続中
            name : {type: String, require: true}, //内部ポート名
            open_port_number : {type: Number, require: true}, //公開用のポート番号
            ip_address : {type: String}, //ポートipアドレス
            mac_address : {type: String} //ポートmacアドレス
        }]
    }],
    veth : [{
        port1 : {type: String, require: true}, //接続先ポート
        port2 : {type: String, require: true}, //接続先ポート
        name : {type: String, require: true}, //veth名
        begin_x : {type: Number, require: true}, //canvas描画時の線の始点x座標
        begin_y : {type: Number, require: true}, //canvas描画時の線の始点y座標
        end_x : {type: Number, require: true}, //canvas描画時の線の終点x座標
        end_y : {type: Number, require: true}, //canvas描画時の線の終点y座標
    }]
});

module.exports = mongoose.model('usermachine', UserMachine);

