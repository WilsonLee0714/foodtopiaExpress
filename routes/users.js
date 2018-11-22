var express = require('express');
var router = express.Router();
var mysql = require("mysql");
//session
// var cookieParser = require('cookie-parser');
// var session = require('express-session');
// var app = express(); 
// app.use(cookieParser());
// app.use(session({ secret: "Shh, its a secret!" }));
//session


//建立連線
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'foodtopia',
  port: 3306
});
// connection.connect();
connection.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
});


router
  .route("/login")
  .post(function (req, res) {//登入判斷與儲存

    if (req.session.user) {
      var user = req.session.user;
      req.session.destroy();
      res.json(user);

    } else {
      var email = req.body.email;
      var password = req.body.password;
      if (email == "") {
        res.redirect('http://localhost:3001/login');
        // res.json('wrong')
      } else {
        connection.query("SELECT * FROM `members` WHERE email = ? AND password = ?", [email, password], function (error, rows) {
          if (error) throw error;
          if (rows != "" && rows[0].email == 'ckhtpe@gmail.com') {
            res.redirect('http://localhost/foodtopia/ab_list.php');
          } else if (rows != "") {
            // req.session.user = { state: '已經登入' };
            res.redirect('http://localhost:3001/memberCenter/basicInfo');
            // res.json(rows);
          } else {
            res.redirect('http://localhost:3001/login');
          }
        })
      }
    }
  });
router
  .route("/logout")
  .get(function (req, res) {//登入判斷與儲存
    req.session.user.destroy();
    res.redirect('http://localhost:3001/homePage');

  })




//   .get(function (req, res) {//登入資料取得
//   // req.session.user = 9;
//   if (req.session.user) {
//     var user = req.session.user;
//     // var email=user.email;
//     res.json(user);
//   } else {
//     res.send('未登入！');
//   }
// });
// router
//   .route("/loginInfo")
//   .post(function (req, res) {//登入資料取得
//     req.session.user = 9;

//     if (req.session.user) {
//       var user = req.session.user;
//       // var email=user.email;
//       res.json(user);
//     } else {
//       res.send('你还没有登录，先登录下再试试！');
//     }
//   });


module.exports = router;
