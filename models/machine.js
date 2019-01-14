const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserMachine = new Schema({
    userid : {type: String, require: true, unique: true},
    usernumber : {type : Number, require: true, unique: true},
    machines : [{
        id : {type: String, require: true, unique: true},
        name : {type: String, require: true},
        display_name : {type: String, require: true},
        description : {type : String},
        type : {type: String, require: true},
        x : {type: Number, require: true},
        y : {type: Number, require: true},
        port : [{
            id : {type: String, require: true},
            name : {type: String, require: true},
            access_point : {type: String, require: true},
            x : {type: Number, require: true},
            y : {type: Number, require: true},
            ip_address : {type: String},
            mac_address : {type: String}
        }]
    }]
});

module.exports = mongoose.model('usermachine', UserMachine);

