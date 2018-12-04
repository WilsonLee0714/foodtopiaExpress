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
    //取得購物車內容
    .post(function (req, res) { 
        var _sid = req.body.sid;
        connection.query(
            "SELECT c.sid, c.member_sid, c.qty, p.product_name, p.price, p.spec, p.product_img " +
            "FROM cart AS c INNER JOIN ingird_datasheet AS p ON c.product_id=p.product_id " +
            "WHERE member_sid=?", [_sid],
            function (error, rows) {
                if (error)
                    throw error;
                res.json(rows)
            })
    });


router
    .route("/cart/:sid")
    //取得購物車商品數量
    .get(function (req, res) { 
        connection.query(
            "SELECT qty " +
            "FROM cart " +
            "WHERE sid=?", req.params.sid,
            function (error, row) {
                if (error)
                    throw error;
                res.json(row);
            });
    })
    //修改購物車商品數量
    .put(function (req, res) { 
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
    //刪除購物車商品
    .delete(function (req, res) { 
        connection.query(
            "DELETE " +
            "FROM cart " +
            "WHERE sid=?", req.params.sid,
            function (error) {
                if (error)
                    throw error;
                res.send("商品已刪除");
            })
    });

    router
    .route("/addCart")
    //加入購物車
    .post(function (req, res) { 
      var _body = req.body;
      connection.query(
          "INSERT INTO cart (member_sid, product_id, qty) "+
          "VALUES (?, ?, ?)",[_body.sid, _body.product_sid, _body.qty], function (error) {
        if (error)
          throw error;
        res.json({
          message: "新增成功"
        });
      })
    });

module.exports = router;