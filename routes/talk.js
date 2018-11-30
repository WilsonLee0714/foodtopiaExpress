var express = require('express');
var router = express.Router();
var mysql = require("mysql");

var connection = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'',
  database:'foodtopia',
});
// connection.connect();
connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
});

router
  .route("/upload_talk")
  .get(function(req, res) {//讀所有資料
    connection.query("SELECT * FROM comment `topia_comment_id` ",function(error,rows){
      if (error) throw error;
      res.json(rows);
    })
  }) 
  .post(function(req, res) {//新增資料
     var _user = req.body;
    connection.query("insert into comment set ?", _user,function(error){
       if (error) throw error;
       res.json({ message: "新增成功" });
    })
  }); 

module.exports = router;