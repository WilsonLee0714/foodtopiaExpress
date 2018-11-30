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
  .route("/menu")
  .get(function(req, res) {
    connection.query("Select * from menu", function(error, rows) {
      if (error) throw error;
      res.json(rows);
    });
  });

//月份分類
router
.route("/menu/:upload_time_sid")
.get(function(req, res) {
  connection.query("select * from `menu` WHERE `upload_time_sid`=?",req.params.upload_time_sid, function(error, rows) {
    if (error) throw error;
    res.json(rows);
  });
});

module.exports = router;