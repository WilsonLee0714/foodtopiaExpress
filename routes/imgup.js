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
//上傳檔名
router
  .route("/upload_img_name")
  .get(function(req, res) {//讀所有資料
    connection.query("SELECT img_name FROM community where `sid`=?",[req.session.sid],function(error,rows){
      if (error) throw error;
      res.json(rows);
    })
  }) 
  .put(function(req, res) {//新增資料
     var _body = req.body;
     console.log(_body)
    connection.query("UPDATE community SET img_name=? WHERE sid=?",[_body.img_name, req.session.sid],function(error){
       if (error) throw error;
       res.json({ message: "新增成功" });
    })
  });
//welcome修改
router
  .route("/upload_welcome")
  .get(function(req, res) {//讀所有資料
    connection.query("SELECT welcome FROM community where `sid`=?",[req.session.sid],function(error,rows){
      if (error) throw error;
      res.json(rows);
    })
  }) 
  .put(function(req, res) {//新增資料
     var _body = req.body;
     console.log(_body)
    connection.query("UPDATE community SET welcome=? WHERE sid=?",[_body.welcome, req.session.sid],function(error){
       if (error) throw error;
       res.json({ message: "新增成功" });
    })
});
//introduction修改
router
  .route("/upload_introduction")
  .get(function(req, res) {//讀所有資料
    connection.query("SELECT introduction FROM community where `sid`=?",[req.session.sid],function(error,rows){
      if (error) throw error;
      res.json(rows);
    })
  }) 
  .put(function(req, res) {//新增資料
     var _body = req.body;
     console.log(_body)
    connection.query("UPDATE community SET introduction=? WHERE sid=?",[_body.introduction, req.session.sid],function(error){
       if (error) throw error;
       res.json({ message: "新增成功" });
    })
});
//社群修改
router
  .route("/upload_community")
  .get(function(req, res) {//讀所有資料
    connection.query("SELECT `id`,`facebook`, `instagram`, `google_plus`, `youtube`, `email` FROM `community` WHERE `sid`=?",[req.session.sid],function(error,rows){
      if (error) throw error;
      res.json(rows);
    })
  }) 
  .put(function(req, res) {//新增資料
     var _body = req.body;
    connection.query("UPDATE `community` SET `facebook`=?,`instagram`=?,`google_plus`=?,`youtube`=?,`email`=? WHERE sid=?",[_body.facebook,_body.instagram,_body.google_plus,_body.youtube,_body.email,req.session.sid],function(error){
       if (error) throw error;
       res.json({ message: "新增成功" });
    })
});
module.exports = router;