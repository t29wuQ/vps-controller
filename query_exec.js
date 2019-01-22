const connection = require('./mysql');

/**
 * queryを実行
 * @param {String} query 
 */
const queryExec = function(query){
    return new Promise(function(resolve, reject){
        connection.query(query, function(err, rows, fields){
            if (err){
                console.log(Error);
                reject(new Error(err.sqlMessage));
                return;
            }
            resolve(rows);
        });
    })
}

module.exports = queryExec;