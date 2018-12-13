var express = require('express');
var router = express.Router();
var mysql = require("mysql");

var connection = mysql.createConnection({
    host:'localhost',
    user:'foodtopia',
    password:'',
    database:'foodtopia',
  port: 3306
  //資料庫名稱
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
    connection.query("Select * from `menu01` WHERE `member_id`=? ORDER BY `id` DESC",[req.session.sid], function(error, rows) {
      if (error) throw error;
      res.json(rows);
    });
  });

//個人單月的食譜清單
router
.route("/menu/:upload_time_sid")
.get(function(req, res) {
  connection.query("select * from `menu01` WHERE `upload_time_sid`=? AND `member_id`=?",[req.params.upload_time_sid,req.session.sid], function(error, rows) {
    if (error) throw error;
    res.json(rows);
  });
});
//其他會員單月的食譜清單
router
.route("/member_menu/:upload_time_sid/:sid")
.get(function(req, res) {
  connection.query("select * from `menu01` WHERE `upload_time_sid`=? AND `member_id`=?",[req.params.upload_time_sid,req.params.sid], function(error, rows) {
    if (error) throw error;
    res.json(rows);
  });
});
module.exports = router;  
