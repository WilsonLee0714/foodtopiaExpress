var express = require('express');
var router = express.Router();
var mysql = require("mysql");

//建立連線
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'foodtopia',
    password: '',
    database: 'foodtopia',
    // port: 3306
});

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
    .get(function (req, res) {
        connection.query(
            "SELECT c.sid, c.member_sid, c.qty, c.product_id, p.product_name, p.price, p.spec, p.product_img " +
            "FROM cart AS c INNER JOIN igr_test AS p ON c.product_id=p.product_id " +
            "WHERE member_sid=?", [req.session.sid],
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
        console.log(req.session.sid)
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
                res.json("商品數量已修改")
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
                res.json("商品已刪除");
            })
    });

router
    .route("/addCart/:product_id")
    //加入購物車
    .get(function (req, res) {
        var product_id = req.params.product_id;
        connection.query(
            "SELECT sid, qty " +
            "FROM cart " +
            "WHERE member_sid=? AND product_id=?", [req.session.sid, product_id],
            function (error, row) {
                if (error)
                    throw error;

                if (!row.length) {
                    connection.query(
                        "INSERT INTO cart (member_sid, product_id) " +
                        "VALUES (?,?)", [req.session.sid, product_id],
                        function (error) {
                            if (error)
                                throw error;
                        })
                } else {
                    let newQty = row[0].qty + 1,
                        sid = row[0].sid
                    connection.query(
                        "UPDATE cart " +
                        "SET qty=? " +
                        "WHERE sid=?", [newQty, sid],
                        function (error) {
                            if (error)
                                throw error;
                        })
                }
            });
        res.json({
            message: "新增成功"
        });
    });

router
    .route("/allAddCart")
    //食譜一鍵加入購物車
    .post(function (req, res) {
        let products = req.body.products;
        for (i = 0; i < products.length; i++) {
            let product_id = products[i].ingredients_id
            connection.query(
                "SELECT sid, qty " +
                "FROM cart " +
                "WHERE member_sid=? AND product_id=?", [req.session.sid, product_id],
                function (error, row) {
                    if (error)
                        throw error;
                    if (!row.length) {
                        connection.query(
                            "INSERT INTO cart (member_sid, product_id) " +
                            "VALUES (?,?)", [req.session.sid, product_id],
                            function (error) {
                                if (error)
                                    throw error;
                            })
                    } else {
                        let newQty = row[0].qty + 1,
                            sid = row[0].sid
                        connection.query(
                            "UPDATE cart " +
                            "SET qty=? " +
                            "WHERE sid=?", [newQty, sid],
                            function (error) {
                                if (error)
                                    throw error;
                            })
                    }
                });
        }
        res.json({
            message: "新增成功"
        });
    });

router
    .route("/cleanCart")
    //清空購物車商品
    .delete(function (req, res) {
        connection.query(
            "DELETE " +
            "FROM cart " +
            "WHERE member_sid=?", [req.session.sid],
            function (error) {
                if (error)
                    throw error;
                })
                res.json("購物車已經清空");
    });

module.exports = router;