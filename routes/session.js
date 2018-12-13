var express = require('express');
var router = express.Router();
var mysql = require("mysql");
// url
var url = require('url');




// 
//建立連線
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'foodtopia',
    password: '',
    database: 'foodtopia',
    // port: 3306
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
    .post(function (req, res) {//登入
        var email = req.body.email;
        var password = req.body.password;
        var theUrl = req.body.theUrl;
        if (email == "") {
            res.redirect('http://localhost:3001/login');
            // res.json('wrong')
        } else {
            connection.query("SELECT * FROM `members` WHERE email = ? AND password = ?", [email, password], function (error, rows) {
                if (error) throw error;
                if (rows != "" && rows[0].email == 'foodtopia@gmail.com') {
                    res.redirect('http://localhost/foodtopia/ab_list.php');
                } else if (rows != "" && rows[0].account != 1) {
                    res.send("信箱還未激活");
                } else if(rows != "") {
                    req.session.email = rows[0].email;
                    req.session.sid = rows[0].sid;
                    req.session.name = rows[0].name;
                    req.session.nickname = rows[0].nick_name;
                    req.session.password = rows[0].password;
                    req.session.profile = rows[0].profile;
                    req.session.mobile = rows[0].mobile;
                    req.session.county = rows[0].county;
                    req.session.district = rows[0].district;
                    req.session.zipCode = rows[0].zipCode;
                    req.session.address = rows[0].address;
                    req.session.county = rows[0].county;
                    req.session.district = rows[0].district;
                    req.session.zipCode = rows[0].zipCode;
                    req.session.address = rows[0].address;
                    req.session.login = 1;
                    res.redirect(theUrl);
                    // res.send(req.session);
                    
                    //登入會員時候新增blog表單資料
                    connection.query("SELECT * FROM community where `sid`=?", [req.session.sid], function (error, rows) {
                        if (!rows.length) {
                          connection.query("insert into community set ?", { img_name: "Tifa.jpg", welcome: "請設定部落格歡迎用語", introduction: "請設定部落格簡介", sid: req.session.sid }, function (error) {
                            if (error) throw error;
                          })
                        }
                    })
                    
                } else {
                    res.redirect('http://localhost:3001/login');
                }
            })
        }
    });
router
    .route("/logout")
    .get(function (req, res) {//登出
        req.session.destroy();
        res.redirect('http://localhost:3001/homePage');

    });
router
    .route("/login")
    .get(function (req, res) {//是否已經登入
        if (req.session.login) {
            console.log(req.session);
            res.redirect('http://localhost:3001/memberCenter/basicInfo');
        } else {
            res.redirect('http://localhost:3001/login');
        }

    });
router
    .route("/info")
    .get(function (req, res) {//取登入帳號資料
        // res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
        // res.setHeader("Access-Control-Allow-Credentials", "true");
        res.send(req.session);
        // res.send(req.session.email);
        // res.send('okok');
    })
    .post(function (req, res) {//修改資料
        // res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
        // res.setHeader("Access-Control-Allow-Credentials", "true");  
        var _member = req.body;
        console.log(_member);
        var id = req.body.sid;
        console.log(id);
        connection.query("update members set ? where sid=?", [_member, id], function (error) {
            // req.session.nickname = req.body.nick_name;
            // req.session.password = req.body.password;
            // req.session.name = req.body.name;
            // req.session.address = req.body.address;
            // req.session.mobile = req.body.mobile;
            if (true) {
                connection.query("SELECT * FROM `members` where sid=?", id, function (error, rows) {
                    console.log(rows[0].sid)
                    req.session.email = rows[0].email;
                    req.session.sid = rows[0].sid;
                    req.session.name = rows[0].name;
                    req.session.nickname = rows[0].nick_name;
                    req.session.password = rows[0].password;
                    req.session.profile = rows[0].profile;
                    req.session.mobile = rows[0].mobile;
                    req.session.county = rows[0].county;
                    req.session.district = rows[0].district;
                    req.session.zipCode = rows[0].zipCode;
                    req.session.address = rows[0].address;
                    req.session.login = 1;
                    res.redirect('http://localhost:3001/memberCenter/basicInfo');
                })
            }
        });

    });
router
    .route("/active")
    .get(function (req, res) {//激活
        var _member = req.query.email;
        console.log('test');
        console.log(req.query.email);
        console.log('test');
        connection.query("update members set account=1 where email=?", [_member], function (error) {
            res.send('信箱激活成功!!');
        });
    })




module.exports = router;
