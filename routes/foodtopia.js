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
    connection.query("Select * from menu01", function(error, rows) {
      if (error) throw error;
      res.json(rows);
    });
});
//menu全部食譜
router
  .route("/menu/:page")
  .get(function (req, res) {
    //先統計總共幾筆資料
    var query = "select count(*) as TotalCount from menu01 WHERE `member_id`=?"; //用SQL找總共多少筆
    var totalCount = 0;
    connection.query(query,[req.session.sid], function (error, row) {
      if (error) throw error;
      totalCount = row[0].TotalCount;

      //讀出分頁資料
      var LimitNum = 6;   //一次讀取6筆資料
      var startNum = 0;    //從第幾筆開始讀
      if (req.params.page) {                //?
        page = parseInt(req.params.page); //parseInt化
        startNum = (page - 1) * LimitNum; //依據頁數讀取第一筆的項目id
      }
      var query = "select * from `menu01` WHERE `member_id`=? ORDER BY `id` DESC limit ? OFFSET ? "; //每頁項目範圍
      var params = [req.session.sid,LimitNum, startNum];
      query = mysql.format(query, params); //format -> 將query取得的項目轉化成params格式
      connection.query(query, function (error, row) {
        if (error) throw error;
        res.json({ TotalCount: totalCount, datas: row });
      });
    });
  })
//menu依照會員抓上傳食譜
router
  .route("/member_menu/:sid")
  .get(function(req, res) {
    connection.query("Select * from menu01 WHERE `member_id`=? ORDER BY `id` DESC",req.params.sid,function(error, rows) {
      if (error) throw error;
      res.json(rows);
    });
});
//食譜內容頁-食材
router
  .route("/ingredients/:sid")
  .get(function(req, res) {
    connection.query("Select * from ingredients WHERE `sid`=?",req.params.sid,function(error, rows) {
      if (error) throw error;
      res.json(rows);
    });
});
//個人部落格評論篩選
router
  .route("/member_comment")
    .get(function(req, res) {
    connection.query("SELECT `menu01`.`member_id`,`menu01`.`menu`, `comment`.* FROM `comment` JOIN `menu01` ON `menu01`.`id`=`comment`.`recipe_id`  WHERE `menu01`.`member_id`=? ORDER BY `id` DESC LIMIT 3",[req.session.sid],function(error,rows){
      if (error) throw error;
      res.json(rows);
    })
})
//會員部落格評論篩選
router
  .route("/member_comment/:sid")
    .get(function(req, res) {
    connection.query("SELECT `menu01`.`member_id`,`menu01`.`menu`, `comment`.* FROM `comment` JOIN `menu01` ON `menu01`.`id`=`comment`.`recipe_id`  WHERE `menu01`.`member_id`=? ORDER BY `id` DESC LIMIT 3",req.params.sid,function(error,rows){
      if (error) throw error;
      res.json(rows);
    })
})

module.exports = router;