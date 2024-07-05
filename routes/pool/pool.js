var mysql = require("mysql");

var pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "mysql@123",
  database: "thesatika",
  port: 3306,
  multipleStatements: true,
  connectionLimit: 100,
});

module.exports = pool;
