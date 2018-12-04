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

connection.connect(function (err) {
    if (err) {
        console.error("error connecting: " + err.stack);
        return;
    }
    console.log("connected as id " + connection.threadId);
});



router
    .route("/order")
    //建立訂單
    .post(function (req, res) {
        var _body = req.body,
            fields = req.body.fields,
            products = req.body.products,
            now = new Date(),
            year = now.getFullYear(),
            month = now.getMonth() + 1,
            date = now.getDate(),
            hours = now.getHours(),
            minutes = now.getMinutes(),
            seconds = now.getSeconds(),
            dateData = new Date(fields.date),
            timeData = new Date(fields.time),
            shipYear = dateData.getFullYear(),
            shipMonth = dateData.getMonth() + 1,
            shipDate = dateData.getDate(),
            shipHours = timeData.getHours(),
            _shipDate = `${shipYear}-${shipMonth}-${shipDate}`,
            _shipTime = `${shipHours}:00:00`;
        if (month < 10) {
            month = '0' + month;
        }
        if (date < 10) {
            date = '0' + date;
        }
        if (hours < 10) {
            hours = '0' + hours;
        }
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        if (seconds < 10) {
            seconds = '0' + seconds;
        }
        var _order_num = `${fields.sid}${year}${month}${date}${hours}${minutes}${seconds}`;

        connection.query(
            "INSERT INTO orders (order_num, member_sid, name, tel, mobile, zipCode, county, district, address, ship, ship_date, ship_time, note, pay, amount) " +
            "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [
                _order_num, fields.sid, fields.name, fields.tel, fields.mobile, fields.zipCode, fields.county, fields.district, fields.address,
                fields.ship, _shipDate, _shipTime, fields.note, fields.pay, _body.amount
            ],
            function (error) {
                if (error)
                    throw error;
            })
        for (i = 0; i < products.length; i++) {
            connection.query(
                "INSERT INTO orders_details (order_num, product_sid, product_name, price, qty) " +
                "VALUES (?,?,?,?,?)", [
                    _order_num, products[i].sid, products[i].product_name, products[i].price, products[i].qty,
                ],
                function (error) {
                    if (error)
                        throw error;
                })
        }
        res.json({
            message: '新增成功'
        })
    });


module.exports = router;