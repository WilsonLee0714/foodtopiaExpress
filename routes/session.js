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
    .route("/user")
    .post(function (req, res) {//登入判斷與儲存
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
                    req.session.email = rows[0].email;
                    req.session.sid = rows[0].sid;
                    req.session.login = 1;
                    res.redirect('http://localhost:3001/memberCenter/basicInfo');
                    // res.send(req.session);
                } else {
                    res.redirect('http://localhost:3001/login');
                }
            })
        }
    });
router
    .route("/logout")
    .get(function (req, res) {//登入判斷與儲存
        req.session.destroy();
        res.redirect('http://localhost:3001/homePage');

    });
router
    .route("/login")
    .get(function (req, res) {//登入判斷與儲存
        if (req.session.login) {
            res.redirect('http://localhost:3001/memberCenter/basicInfo');
        } else {
            res.redirect('http://localhost:3001/login');
        }

    });
router
    .route("/info")
    .get(function (req, res) {//登入判斷與儲存
        // res.setHeader("Access-Control-Allow-Credentials","true");
        res.send(req.session);
        // res.send(req.session.email);
        // res.send('okok');
    });


module.exports = router;
