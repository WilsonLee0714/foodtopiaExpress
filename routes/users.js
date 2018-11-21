var express = require('express');
var router = express.Router();
var mysql = require("mysql");



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
  .post(function (req, res) {//登入判斷
    var email = req.body.email;
    var password = req.body.password;
    if (email == "") {
      res.redirect('http://localhost:3001/login');
      // res.json('wrong')
    } else {
      connection.query("SELECT * FROM `members` WHERE email = ? AND password = ?", [email, password], function (error, rows) {
        if (error) throw error;
        if (rows != "") {
          req.session.loginID = rows;
          res.redirect('http://localhost:3001/memberCenter/basicInfo');
          // res.json(rows);
        } else {
          res.redirect('http://localhost:3001/login');
        }
      })
    }
  });


module.exports = router;
