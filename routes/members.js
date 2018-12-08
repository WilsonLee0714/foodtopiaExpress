var express = require('express');
var router = express.Router();
var mysql = require("mysql");

//建立連線
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'foodtopia',
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
  .route("/members")
  .get(function (req, res) {//讀所有資料
    connection.query("select * from members", function (error, rows) {
      if (error) throw error;
      res.json(rows);
    })
  })
  .post(function (req, res) {//註冊用
    var email = req.body.email;
    var nick_name = req.body.nick_name;
    connection.query("select * from members WHERE email=?", email, function (error, rows) {
      if (error) throw error;
      if (rows != '') {
        res.send('帳號重複');
      } else {
        
        var _user = req.body;
        connection.query("insert into members set ?", _user, function (error) {
          if (error) throw error;
          // gmail
          const nodemailer = require('nodemailer');

          // Generate test SMTP service account from ethereal.email
          // Only needed if you don't have a real mail account for testing
          nodemailer.createTestAccount((err, account) => {
            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
              service: 'Gmail',
              auth: {
                user: 'foodtopiatpe@gmail.com',
                pass: '7890uiop'
              }
            });

            // setup email data with unicode symbols
            let mailOptions = {
              from: '"foodtopia驗證信" <foodtopiatpe@gmail.com>', // sender address
              to: email, // list of receivers
              subject: '註冊驗證信', // Subject line
              text: '點選連結驗證此信箱', // plain text body
              html: `Hello ${nick_name}<br><p>您註冊的信箱為${email}</p><br><a href="http://localhost:3000/session/active?email=${email}">點選連結驗證此信箱..</a>` // html body
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                return console.log(error);
              }
              console.log('Message sent: %s', info.messageId);
              // Preview only available when sending through an Ethereal account
              console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
              res.redirect('http://localhost:3001/registerSuccessful');

              // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
              // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
            });

          });

          // 
          //  res.json({ message: "新增成功" });
        })

      }
      
    })
  });
router
  .route("/members/:id")
  .get(function (req, res) {
    connection.query("select * from members where id=?", req.params.id, function (error, row) {
      if (error) throw error;
      res.json(row);
    });
  })
  .put(function (req, res) {//修改資料
    var _member = req.body;
    var id = req.params.id;
    connection.query("update members set ? where id=?", [_member, id], function (error) {
      if (error) throw error;
      res.json({ message: "修改成功" });
    })

  })
  .delete(function (req, res) {//刪除資料
    connection.query("delete from members where id=?", req.params.id, function (error) {
      if (error) throw error;
      res.json({ message: "刪除成功" });
    })
  });
router
  .route("/resend")
  .post(function (req, res) {
    var email = req.body.email;
    // gmail
    const nodemailer = require('nodemailer');

    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    nodemailer.createTestAccount((err, account) => {
      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'foodtopiatpe@gmail.com',
          pass: '7890uiop'
        }
      });

      // setup email data with unicode symbols
      let mailOptions = {
        from: '"foodtopia驗證信" <foodtopiatpe@gmail.com>', // sender address
        to: email, // list of receivers
        subject: '註冊驗證信', // Subject line
        text: '點選連結驗證此信箱', // plain text body
        html: `若無註冊可以不須理會此封郵件<p>您註冊的信箱為${email}</p><br><a href="http://localhost:3000/session/active?email=${email}">點選連結驗證此信箱..</a>` // html body
      };

      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        res.redirect('http://localhost:3001/registerSuccessful');

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
      });

    });
  })





module.exports = router;
