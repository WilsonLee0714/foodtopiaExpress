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
    .route("/cart")
    .post(function (req, res) { //取得購物車內容
        var _email = req.body.email;
        connection.query(
            "SELECT c.sid, c.email, c.qty, p.product_name, p.price, p.spec, p.product_img " +
            "FROM cart AS c INNER JOIN ingird_datasheet AS p ON c.product_id=p.product_id " +
            "WHERE email=?", [_email],
            function (error, rows) {
                if (error)
                    throw error;
                res.json(rows)
            })
    });

router
    .route("/cart/:sid")
    .get(function (req, res) { //取得購物車商品數量
        connection.query(
            "SELECT sid, qty " +
            "FROM cart " +
            "WHERE sid=?", req.params.sid,
            function (error, row) {
                if (error)
                    throw error;
                res.json(row);
            });
    })
    .put(function (req, res) { //修改購物車商品數量
        var qty = req.body.qty;
        var sid = req.params.sid;
        connection.query(
            "UPDATE cart " +
            "SET qty=? " +
            "WHERE sid=?", [qty, sid],
            function (error) {
                if (error)
                    throw error;
                res.send("商品數量已修改")
            })
    })
    .delete(function (req, res) { //刪除購物車商品
        connection.query("DELETE " +
            "FROM cart " +
            "WHERE sid=?", req.params.sid,
            function (error) {
                if (error)
                    throw error;
                res.send("商品已刪除");
            })
    });

module.exports = router;