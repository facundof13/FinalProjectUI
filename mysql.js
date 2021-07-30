const mysql = require('mysql2/promise');
console.log(process.env.MYSQL_PASSWORD);
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: process.env.MYSQL_PASSWORD,
    database: 'final_project',
})

module.exports = pool;