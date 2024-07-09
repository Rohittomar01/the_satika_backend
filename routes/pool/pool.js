var mysql = require("mysql");

var pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "3352",
  database: "thesatika",
  port: 3306,
  multipleStatements: true,
  connectionLimit: 100,
});

module.exports = pool;
