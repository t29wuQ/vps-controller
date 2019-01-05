const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let User = new Schema({
    userid : {type: String, require: true, unique: true},
    password : {type: String, require: true}
});

module.exports = mongoose.model('user', User)