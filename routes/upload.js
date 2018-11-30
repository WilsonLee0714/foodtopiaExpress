var express = require('express');
var router = express.Router();
var mysql = require("mysql");

var connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'foodtopia' //資料庫名稱
});

connection.connect(function(err) {
    if (err) {
      console.error("error connecting: " + err.stack);
      return;
    }
    console.log("connected as id " + connection.threadId);
});

router
  .route("/upload_date") //資料表名稱
  .get(function(req, res) {
    connection.query("SELECT * FROM upload_date ORDER BY `id` DESC LIMIT 6", function(error, results) {
      if (error) throw error;
      res.json(results);
    });
  });


module.exports = router;