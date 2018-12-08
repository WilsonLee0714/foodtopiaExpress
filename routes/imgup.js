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

//讀取blog個人資料
router
  .route("/upload_community")
  .get(function(req, res) {
    connection.query("SELECT * FROM community where `sid`=?",[req.session.sid],function(error,rows){
      if (error) throw error;
      res.json(rows);
    })
  })
  // connection.query("SELECT * FROM community where `sid`=?", [req.session.sid], function (error, rows) {
  //   if (rows) {
  //     connection.query("insert into community set ?", { img_name: "Tifa", welcome: "請設定部落格歡迎用語", introduction: "請設定部落格簡介", sid: req.session.sid }, function (error) {
  //       if (error) throw error;
  //     })
  //   } else {
  //       res.json(rows);
  //     }
  // })

//上傳檔名
router
  .route("/upload_img_name") 
  .put(function(req, res) {//修改圖片
     var _body = req.body;
    connection.query("UPDATE community SET img_name=? WHERE sid=?",[_body.img_name, req.session.sid],function(error){
       if (error) throw error;
       res.json({ message: "新增成功" });
    }) 
  });
//welcome修改
router
  .route("/upload_welcome")
  .put(function(req, res) {//修改welcome
     var _body = req.body;
    connection.query("UPDATE community SET welcome=? WHERE sid=?",[_body.welcome, req.session.sid],function(error){
       if (error) throw error;
       res.json({ message: "新增成功" });
    })
});
//introduction修改
router
  .route("/upload_introduction")
  .put(function(req, res) {//修改introduction
     var _body = req.body;
    connection.query("UPDATE community SET introduction=? WHERE sid=?",[_body.introduction, req.session.sid],function(error){
       if (error) throw error;
       res.json({ message: "新增成功" });
    })
});
//社群修改
router
  .route("/upload_community")
  .put(function(req, res) {//社群修改
     var _body = req.body;
    connection.query("UPDATE `community` SET `facebook`=?,`instagram`=?,`google_plus`=?,`youtube`=? WHERE sid=?",[_body.facebook,_body.instagram,_body.google_plus,_body.youtube,req.session.sid],function(error){
       if (error) throw error;
       res.json({ message: "新增成功" });
    })
});
module.exports = router;