const mysql = require('mysql');

/**
 * mysqlとの接続設定
 */
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'densan',
    database: 'vps_db',
    insecureAuth : true
});

module.exports = connection;