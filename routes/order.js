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
    .route("/order")
    .post(function (req, res) { //建立訂單
        var _body = req.body,
            fields = req.body.fields
            
        console.log(req.body)
        connection.query(
            `INSERT INTO orders (order_num, member_sid, name, tel, mobile, city, dist, address, ship, ship_date, ship_time, note, pay, amount, created_at) `
            `VALUES (123456,${fields.sid},${fields.name},${fields.tel},${fields.mobile},${fields.city},${fields.dist},${fields.address},${fields.ship},${fields.date},${fields.time},${fields.note},${fields.pay},${_body.amount},${new Date()})`,
            function (error) {
                if (error)
                    throw error;
                res.json({
                    message: '新增成功'
                })
            })
    });


module.exports = router;