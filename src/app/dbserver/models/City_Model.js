const mysql = require('mysql');


const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '0865783836',
    database : 'citizenz'
});

module.exports = db;




