var express = require('express');
var router = express.Router();
var mysql = require("mysql");

//建立連線
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'foodtopia',
  password : '',
  database : 'foodtopia',
//   port: 3306

});
connection.connect();

// http://localhost:3000/api/recipe
router.route('/recipe')
    .get(function(req, res){
        // GET http://localhost:3000/xxx/recipe
        // res.send("get all recipe")
        connection.query("select * from menu ", function(error, results) {
            if(error) throw error;
            res.json(results)
            console.log("Database foodtopia connected")
        })
    })
    // .post(function(req, res){
    //     //POST http://localhost:3000/xxx/recipe
    //     // req.body
    // })

// http://localhost:3000/api/recipe/1
router.route('/recipe/:id')
.get(function(req, res){ 
    //GET http://localhost:3000/api/recipe/2  
    // 讀取:id參數的值 req.params.id
    // res.send("get recipe id " + req.params.id);
    connection.query(
        'select * from menu01 where id=?',req.params.id, function(error,results){
        if(error) throw error;
        res.json(results)
      })

})
// .put(function(req, res){
//     //GET http://localhost:3000/api/recipe/2 
//     res.send("修改" + req.params.id + "資料");
// })
// .delete(function(req, res){
//     //GET http://localhost:3000/api/recipe/2  
//     res.send("刪除" + req.params.id + "資料");
// })

//評論
router
  .route("/recipe_comment/:id")
  .get(function(req, res) {
    connection.query("SELECT * FROM comment where `recipe_id`=?",req.params.id,function(error,rows){
      if (error) throw error;
      res.json(rows);
    })
})
router
  .route("/nickname_comment")
    .get(function(req, res) {
    connection.query("SELECT `nick_name` FROM members where `sid`=?",[req.session.sid],function(error,rows){
      if (error) throw error;
      res.json(rows);
    })
})
router
  .route("/comment_upload")
    .post(function(req, res) {//發表評論
        var _body = req.body;
        connection.query("INSERT INTO `comment`(`comment`, `recipe_id`, `members_id`, `comment_name`, `profile`) VALUES (?,?,?,?,?)",[_body.comment,_body.recipe_id,req.session.sid,req.session.nickname,req.session.profile],function(error){
        if (error) throw error;
        res.json({ message: "新增成功" });
        })
})
//隨機4筆食譜
router
  .route("/recipe_rand")
  .get(function(req, res) {
    connection.query("SELECT * FROM menu01 ORDER BY RAND() LIMIT 4",function(error,rows){
      if (error) throw error;
      res.json(rows);
    })
})
//食譜作者
router
  .route("/recipe_members/:id")
  .get(function(req, res) {
    connection.query("SELECT `members`.`nick_name`,`members`.`profile`,`members`.`sid`, `menu01`.`member_id`, `menu01`.`id` FROM `menu01` JOIN `members` ON `menu01`.`member_id`=`members`.`sid` where `id`=?",req.params.id,function(error,rows){
      if (error) throw error;
      res.json(rows);
    })
})
module.exports = router;