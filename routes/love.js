var express = require('express');
var router = express.Router();
var mysql = require("mysql");

var connection = mysql.createConnection({
  host:'localhost',
  user:'foodtopia',
  password:'',
  database:'foodtopia',
  // port: 3306

});
// connection.connect();
connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
});
//收藏依照食譜搜尋
router
  .route("/love/:recipe_id")
  .get(function(req, res) {
    connection.query("SELECT * FROM love where `member_id`=? AND `recipe_id`=?",[req.session.sid,req.params.recipe_id],function(error,rows){
      if (error) throw error;
      res.json(rows);
    })
  })
router
  .route("/love")
  .post(function(req, res) {
    var _body = req.body;
    connection.query("SELECT * FROM `love` where `member_id`=? AND `recipe_id`=?",[req.session.sid,_body.recipe_id],function(error,rows){
      if(!rows.length){
        connection.query("INSERT INTO love set ?",{member_id:req.session.sid,recipe_id:_body.recipe_id},function(error){
          if (error) throw error;
          res.json({ message: "新增成功" });
       })
      }else{
        connection.query("DELETE FROM `love` WHERE `member_id`=? AND `recipe_id`=?",[req.session.sid,_body.recipe_id],function(error){
          if (error) throw error;
          res.json("取消收藏");
        })
      }
    })
  })
  //收藏依照會員搜尋
  router
  .route("/love_m")
  .get(function(req, res) {
    connection.query("SELECT `menu`.*, `love`.`recipe_id` FROM `love` JOIN `menu` ON `menu`.`id`=`love`.`recipe_id` where `love`.`member_id`=?",[req.session.sid],function(error,rows){
      if (error) throw error;
      res.json(rows);
    })
  })

  // .route("/love")
  // .post(function(req, res) {
  //   var _body = req.body;
  //   connection.query("SELECT * FROM `love` where `member_id`=? AND `recipe_id`=?",[req.session.sid,_body.recipe_id],function(error,rows){
  //     if(!rows.length){
  //       connection.query("INSERT INTO love set ?",{member_id:req.session.sid,recipe_id:_body.recipe_id},function(error){
  //         if (error) throw error;
  //         res.json({ message: "新增成功" });
  //      })
  //     }else if(res.rows==1){
  //      connection.query("INSERT INTO love set ?",{member_id:req.session.sid,recipe_id:_body.recipe_id,love=2},function(error){
  //         if (error) throw error;
  //         res.json({ message: "取消收藏" });
  //      })
  //     }else {
  //      connection.query("INSERT INTO love set ?",{member_id:req.session.sid,recipe_id:_body.recipe_id,love=1},function(error){
  //         if (error) throw error;
  //         res.json({ message: "加入收藏" });
  //      })
  //      }
  //   })
  // })

module.exports = router;
