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

//blog月份分類連結迴圈
router
  .route("/menu")
  .get(function(req, res) {
    connection.query("SELECT * FROM menu ORDER BY `id` DESC LIMIT 6", function(error, results) {
      if (error) throw error;
      res.json(results);
    });
  });

//menu單筆資料
router
.route("/menu/:id")
.get(function(req, res) {
  connection.query("select * from `menu` WHERE `id`=?", req.params.id,function(error,row){
    if(error) throw error;
    res.json(row);
  });
}) 
  
module.exports = router;