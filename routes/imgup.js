var express = require('express');
var router = express.Router();
var mysql = require("mysql");
const multer  = require('multer');

var connection = mysql.createConnection({
  host:'localhost',
  user:'foodtopia',
  password:'',
  database:'foodtopia',
  port: 3306

});
// connection.connect();
connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
});

//設定上傳檔案的資料夾
// var upload = multer({ dest: 'public/uploads/' })
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

var upload = multer({ storage: storage })

//上傳圖片
router.post('/upload',upload.single('image'),function(req,res,next){
  res.send(req.file);
})

router
  .route("/upload_name")
  .get(function(req, res) {//讀所有資料
    connection.query("SELECT * FROM community ORDER BY `id` DESC LIMIT 1",function(error,rows){
      if (error) throw error;
      res.json(rows);
    })
  }) 
  .post(function(req, res) {//新增資料
     var _user = req.body;
    connection.query("insert into community set ?", _user,function(error){
       if (error) throw error;
       res.json({ message: "新增成功" });
    })
  }); 

// //新增圖片
// router
//   .route("/upload_name")
//   .get(function(req, res) {//讀所有資料
//     connection.query("SELECT `members`.*, `community`.* FROM `members` JOIN `community` ON `members`.`sid`=`community`.`id`",function(error,rows){
//       if (error) throw error;
//       res.json(rows);
//     })
//   }) 
//   .post(function(req, res) {
//      var _user = req.body;
//     connection.query("insert into community set ?", _user,function(error){
//        if (error) throw error;
//        res.json({ message: "新增成功" });
//     })
//   }); 
// //修改圖片檔名
//   router
//   .route("/upload_name/:sid")
//   .get(function(req, res) {
//     connection.query("SELECT `members`.*, `community`.* FROM `members` JOIN `community` ON `members`.`sid`=`community`.`id` where sid=?", req.params.sid,function(error,row){
//       if(error) throw error;
//       res.json(row);
//     });
//   }) 
//   .put(function(req, res) {
//        var _member = req.body;  
//        var id = req.params.id;
//        connection.query("update `members`, `community` FROM `members` JOIN `community` ON `members`.`sid`=`community`.`id` set ? where sid=?",[_member, id],function(error){
//           if(error) throw error;
//           res.json({ message: "修改成功" });
//        })

//   }) 

module.exports = router;