var express = require('express');
var router = express.Router();
var mysql = require("mysql");

//建立連線
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'foodtopia',
    password: '',
    database: 'foodtopia',
    port: 8889
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
        res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        var _email = req.body.email;
        connection.query("SELECT * FROM cart AS c INNER JOIN igr_test AS p ON c.product_id=p.product_id WH" +
            "ERE email=?",
            [_email],
            function (error, rows) {
                if (error)
                    throw error;
                res.json(rows)
            })
    });

router
    .route("/cart/:sid")
    .get(function (req, res) {
        connection
            .query("select * from cart where sid=?", req.params.sid, function (error, row) {
                if (error)
                    throw error;
                res.json(row);
            });

    })
    .put(function (req, res) { //修改資料
        var _cart = req.body;
        var sid = req.params.sid;
        connection.query("update cart set ? where sid=?", [
            _cart, sid
        ], function (error) {
            if (error)
                throw error;
            res.json({
                message: "修改成功"
            });
        })

    })
    .delete(function (req, res) {
        //刪除資料
        connection
            .query("delete from cart where sid=?", req.params.sid, function (error) {
                if (error)
                    throw error;
                res.json({
                    message: "刪除成功"
                });
            })
    });

module.exports = router;