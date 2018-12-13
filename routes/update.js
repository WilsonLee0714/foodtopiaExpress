var express = require('express');
var router = express.Router();
var mysql = require("mysql");

var connection = mysql.createConnection({
    host:'localhost',
    user:'foodtopia',
    password:'',
    database:'foodtopia',
    port: 3306
});

connection.connect(function(err) {
    if (err) {
      console.error("error connecting: " + err.stack);
      return;
    }
    console.log("connected as id " + connection.threadId);
});

//個人近期上傳食譜
router
  .route("/menu")
  .get(function(req, res) {
    connection.query("SELECT * FROM `menu01` WHERE `member_id`=? LIMIT 4",[req.session.sid], function(error, results) {
      if (error) throw error;
      res.json(results);
    });
});
//其他會員近期上傳食譜
router
  .route("/member_menu/:sid")
  .get(function(req, res) {
    connection.query("SELECT * FROM `menu01` WHERE `member_id`=? ORDER BY `id` DESC LIMIT 4",req.params.sid, function(error, results) {
      if (error) throw error;
      res.json(results);
    });
});

//食譜內容頁單筆資料
router
.route("/menu/:id")
.get(function(req, res) {
  connection.query("select * from `menu01` WHERE `id`=?", req.params.id,function(error,row){
    if(error) throw error;
    res.json(row);
  });
}) 
router
.route("/nutritional_value/:id")
.get(function(req, res) {
  connection.query("select * from `nutritional_value` WHERE `id`=?", req.params.id,function(error,row){
    if(error) throw error;
    res.json(row);
  });
}) 
router
.route("/step/:id")
.get(function(req, res) {
  connection.query("select * from `step` WHERE `id`=?", req.params.id,function(error,row){
    if(error) throw error;
    res.json(row);
  });
}) 
router
.route("/step_img/:id")
.get(function(req, res) {
  connection.query("select * from `step_img` WHERE `id`=?", req.params.id,function(error,row){
    if(error) throw error;
    res.json(row);
  });
}) 
  
module.exports = router;