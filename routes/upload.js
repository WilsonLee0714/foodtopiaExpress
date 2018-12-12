var express = require('express');
var router = express.Router();
var mysql = require("mysql");
const multer  = require('multer');

var connection = mysql.createConnection({
    host:'localhost',
    user:'foodtopia',
    password:'',
    database:'foodtopia', //資料庫名稱
    port: 3306

});

connection.connect(function(err) {
    if (err) {
      console.error("error connecting: " + err.stack);
      return;
    }
    console.log("connected as id " + connection.threadId);
});
//月份篩選
router
  .route("/upload_date") 
  .get(function(req, res) {
    connection.query("SELECT * FROM upload_date ORDER BY `id` DESC LIMIT 4", function(error, results) {
      if (error) throw error;
      res.json(results);
    });
  });
router
.route("/upload_date/:id") 
.get(function(req, res) {
  connection.query("SELECT * FROM upload_date WHERE `id`=?",req.params.id, function(error, results) {
    if (error) throw error;
    res.json(results);
  });
});

//上傳食材篩選
router
  .route("/upload_ingredients_name")
  .get(function(req, res) {
    connection.query("SELECT * FROM upload_ingredients_name", function(error, results) {
      if (error) throw error;
      res.json(results);
    });
  });
router
.route("/upload_ingredients/:sid") 
.get(function(req, res) {
  connection.query("SELECT * FROM upload_ingredients WHERE `sid`=?",req.params.sid, function(error, results) {
    if (error) throw error;
    res.json(results);
  });
});

//上傳食譜
router
  .route("/upload_menu_total")
  .post(function(req, res) {
      var _body = req.body;
      connection.query("INSERT INTO `menu01`(`menu`,`menu_img`,`Introduction`,`difficult`,`time`,`serving`,`member_id`,`upload_time_sid`) VALUES (?,?,?,?,?,?,?,?)",[_body.menu,_body.menu_img,_body.Introduction,_body.difficult,_body.time,_body.serving,req.session.sid,_body.upload_time_sid],function(error){
        if (error) throw error;
        connection.query("SELECT `id` FROM `menu01` ORDER BY `id` DESC LIMIT 1",function(error,rows){
          if (error) throw error;
          connection.query("INSERT INTO `ingredients_name`(`id`,`name_1`,`name_2`,`name_3`,`name_4`,`name_5`,`name_6`) VALUES (?,?,?,?,?,?,?)",[rows[0].id,_body.name_1,_body.name_2,_body.name_3,_body.name_4,_body.name_5,_body.name_6],function(error){
            if (error) throw error;
            connection.query("INSERT INTO `step_img`(`id`,`step_img_1`,`step_img_2`,`step_img_3`,`step_img_4`,`step_img_5`,`step_img_6`) VALUES (?,?,?,?,?,?,?)",[rows[0].id,_body.step_img_1,_body.step_img_2,_body.step_img_3,_body.step_img_4,_body.step_img_5,_body.step_img_6],function(error){
              if (error) throw error;
              connection.query("INSERT INTO `step`(`id`,`step_1`,`step_2`,`step_3`,`step_4`,`step_5`,`step_6`) VALUES (?,?,?,?,?,?,?)",[rows[0].id,_body.step_1,_body.step_2,_body.step_3,_body.step_4,_body.step_5,_body.step_6],function(error){
                if (error) throw error;
                connection.query("INSERT INTO `ingredients`(`sid`,`ingredients_img`,`ingredients_name`,`ingredients_id`) VALUES (?,?,?,?)",[rows[0].id,"PG"+_body.dataCar1,_body.name_1,_body.dataCar1],function(error){
                  if (error) throw error;
                  connection.query("INSERT INTO `ingredients`(`sid`,`ingredients_img`,`ingredients_name`,`ingredients_id`) VALUES (?,?,?,?)",[rows[0].id,"PG"+_body.dataCar2,_body.name_2,_body.dataCar2],function(error){
                    if (error) throw error;
                    connection.query("INSERT INTO `ingredients`(`sid`,`ingredients_img`,`ingredients_name`,`ingredients_id`) VALUES (?,?,?,?)",[rows[0].id,"PG"+_body.dataCar3,_body.name_3,_body.dataCar3],function(error){
                      if (error) throw error;
                      connection.query("INSERT INTO `ingredients`(`sid`,`ingredients_img`,`ingredients_name`,`ingredients_id`) VALUES (?,?,?,?)",[rows[0].id,"PG"+_body.dataCar4,_body.name_4,_body.dataCar4],function(error){
                        if (error) throw error;
                        connection.query("INSERT INTO `ingredients`(`sid`,`ingredients_img`,`ingredients_name`,`ingredients_id`) VALUES (?,?,?,?)",[rows[0].id,"PG"+_body.dataCar5,_body.name_5,_body.dataCar5],function(error){
                          if (error) throw error;
                          connection.query("INSERT INTO `ingredients`(`sid`,`ingredients_img`,`ingredients_name`,`ingredients_id`) VALUES (?,?,?,?)",[rows[0].id,"PG"+_body.dataCar6,_body.name_6,_body.dataCar6],function(error){
                            if (error) throw error;
                            connection.query("INSERT INTO `ingredients`(`sid`,`ingredients_img`,`ingredients_name`,`ingredients_id`) VALUES (?,?,?,?)",[rows[0].id,"PG"+_body.dataCar7,_body.name_7,_body.dataCar7],function(error){
                              if (error) throw error;
                              res.json({ message: "上傳食譜成功" });
                            })
                          })
                        })
                      })
                    })
                  })
                })
              })
            })
          })
        })
      })
    })

//設定上傳檔案的資料夾
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/upload_recipes/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({ storage: storage })
// ---------------------------------------
var storage1 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/upload_recipes1/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload1 = multer({ storage: storage1 })
// ---------------------------------------
var storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/upload_recipes2/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload2 = multer({ storage: storage2 })
// ---------------------------------------
var storage3 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/upload_recipes3/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload3 = multer({ storage: storage3 })
// ---------------------------------------
var storage4 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/upload_recipes4/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload4 = multer({ storage: storage4 })
// ---------------------------------------
var storage5 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/upload_recipes5/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload5 = multer({ storage: storage5 })
// ---------------------------------------
var storage6 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/upload_recipes6/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload6 = multer({ storage: storage6 })
// ---------------------------------------
//上傳圖片
router.post('/upload',upload.single('image'),function(req,res,next){
  res.send(req.file);
})
router.post('/upload1',upload1.single('image'),function(req,res,next){
  res.send(req.file);
})
router.post('/upload2',upload2.single('image'),function(req,res,next){
  res.send(req.file);
})
router.post('/upload3',upload3.single('image'),function(req,res,next){
  res.send(req.file);
})
router.post('/upload4',upload4.single('image'),function(req,res,next){
  res.send(req.file);
})
router.post('/upload5',upload5.single('image'),function(req,res,next){
  res.send(req.file);
})
router.post('/upload6',upload6.single('image'),function(req,res,next){
  res.send(req.file);
})

module.exports = router;