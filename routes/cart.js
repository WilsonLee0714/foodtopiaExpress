var express = require('express');
var router = express.Router();
var mysql = require('mysql');

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
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + connection.threadId);
});

router
    .route('/cart')
    //取得購物車內容
    .get(function (req, res) {
        connection.query(
            "SELECT c.sid, c.member_sid, c.qty, c.product_id, p.product_name, p.price, p.spec, p.product_img " +
            "FROM cart AS c INNER JOIN igr_test AS p ON c.product_id=p.product_id " +
            "WHERE member_sid=?", [req.session.sid],
            function (err, rows) {
                if (err)
                    throw err;
                res.json(rows)
            })
    })
    //修改或刪除購物車商品
    .put(function (req, res) {
        let sid = req.body.sid,
            type = req.body.type;
        switch (type) {
            case 'min':
                connection.query(
                    "SELECT qty " +
                    "FROM cart " +
                    "WHERE sid=?", [sid],
                    function (err, row) {
                        if (err)
                            throw err;
                        let qty = row[0].qty;
                        if (qty > 1) {
                            qty -= 1
                            connection.query(
                                "UPDATE cart " +
                                "SET qty=? " +
                                "WHERE sid=?", [qty, sid],
                                function (err) {
                                    if (err)
                                        throw err;
                                    res.json('商品數量已修改')
                                })
                        }
                    })
                break;
            case 'plus':
                connection.query(
                    "SELECT qty " +
                    "FROM cart " +
                    "WHERE sid=?", [sid],
                    function (err, row) {
                        if (err)
                            throw err;
                        let qty = row[0].qty + 1;
                        connection.query(
                            "UPDATE cart " +
                            "SET qty=? " +
                            "WHERE sid=?", [qty, sid],
                            function (err) {
                                if (err)
                                    throw err;
                                res.json('商品數量已修改')
                            })
                    })
                break;
            case 'del':
                connection.query(
                    "DELETE " +
                    "FROM cart " +
                    "WHERE sid=?", [sid],
                    function (err) {
                        if (err)
                            throw err;
                        res.json('購物車已經清空');
                    })
                break;
        }
    })
    //清空購物車商品
    .delete(function (req, res) {
        connection.query(
            "DELETE " +
            "FROM cart " +
            "WHERE member_sid=?", [req.session.sid],
            function (err) {
                if (err)
                    throw err;
                res.json('購物車已經清空');
            })
    });

router
    .route('/addCart/:product_id')
    //加入購物車
    .get(function (req, res) {
        var product_id = req.params.product_id;
        connection.query(
            "SELECT sid, qty " +
            "FROM cart " +
            "WHERE member_sid=? AND product_id=?", [req.session.sid, product_id],
            function (err, row) {
                if (err)
                    throw err;

                if (!row.length) {
                    connection.query(
                        "INSERT INTO cart (member_sid, product_id) " +
                        "VALUES (?,?)", [req.session.sid, product_id],
                        function (err) {
                            if (err)
                                throw err;
                            res.json({
                                message: '新增成功'
                            });
                        })
                } else {
                    let newQty = row[0].qty + 1,
                        sid = row[0].sid
                    connection.query(
                        "UPDATE cart " +
                        "SET qty=? " +
                        "WHERE sid=?", [newQty, sid],
                        function (err) {
                            if (err)
                                throw err;
                            res.json({
                                message: '新增成功'
                            });
                        })
                }
            });
    });

// router
//     .route('/allAddCart')
//     //食譜一鍵加入購物車
//     .post(function (req, res) {
//         var products = req.body.products,
//             commitNum = 0
//         connection.beginTransaction(function (err) {
//             if (err) {
//                 throw err;
//             }
//             for (i = 0; i < products.length; i++) {
//                 let product_id = products[i].ingredients_id;

//                 connection.query(
//                     "SELECT sid, qty " +
//                     "FROM cart " +
//                     "WHERE member_sid=? AND product_id=?", [req.session.sid, product_id],
//                     function (err, row) {
//                         if (err) {
//                             connection.rollback(function () {
//                                 throw err;
//                             });
//                         }
//                         if (!row.length) {
//                             connection.query(
//                                 "INSERT INTO cart (member_sid, product_id) " +
//                                 "VALUES (?,?)", [req.session.sid, product_id],
//                                 function (err) {
//                                     if (err) {
//                                         connection.rollback(function () {
//                                             throw err;
//                                         });
//                                     }
//                                     commitNum += 1
//                                     if (commitNum == products.length) {
//                                         connection.commit(function (err) {
//                                             if (err) {
//                                                 connection.rollback(function () {
//                                                     throw err;
//                                                 });
//                                             }
//                                             connection.end();
//                                         });
//                                     }
//                                 })
//                         } else {
//                             let newQty = row[0].qty + 1,
//                                 sid = row[0].sid
//                             connection.query(
//                                 "UPDATE cart " +
//                                 "SET qty=? " +
//                                 "WHERE sid=?", [newQty, sid],
//                                 function (err) {
//                                     if (err) {
//                                         connection.rollback(function () {
//                                             throw err;
//                                         });
//                                     }
//                                     commitNum += 1
//                                     if (commitNum == products.length) {
//                                         connection.commit(function (err) {
//                                             if (err) {
//                                                 connection.rollback(function () {
//                                                     throw err;
//                                                 });
//                                             }
//                                             connection.end();
//                                         });
//                                     }
//                                 })
//                         }
//                     });
//                 // if (commitNum == products.length) {
//                 //     connection.commit(function (err) {
//                 //         if (err) {
//                 //             connection.rollback(function () {
//                 //                 throw err;
//                 //             });
//                 //         }
//                 //         connection.end();
//                 //         res.json({
//                 //             message: '新增成功'
//                 //         });
//                 //     });

//                 // }
//             }
//         });
//         // res.json({
//         //     message: '新增成功'
//         // });
//     });



// router
//     .route('/allAddCart')
//     //食譜一鍵加入購物車
//     .post(function (req, res) {
//         let products = req.body.products;
//             for (i = 0; i < products.length; i++) {
//                 let product_id = products[i].ingredients_id
//                 connection.query(
//                     "SELECT sid, qty " +
//                     "FROM cart " +
//                     "WHERE member_sid=? AND product_id=?", [req.session.sid, product_id],
//                     function (err, row) {
//                         if (err)
//                             throw err;
//                         if (!row.length) {
//                             connection.query(
//                                 "INSERT INTO cart (member_sid, product_id) " +
//                                 "VALUES (?,?)", [req.session.sid, product_id],
//                                 function (err) {
//                                     if (err)
//                                         throw err;
//                                 })
//                         } else {
//                             let newQty = row[0].qty + 1,
//                                 sid = row[0].sid
//                             connection.query(
//                                 "UPDATE cart " +
//                                 "SET qty=? " +
//                                 "WHERE sid=?", [newQty, sid],
//                                 function (err) {
//                                     if (err)
//                                         throw err;
//                                 })
//                         }
//                     });
//             }
//         res.json({
//             message: '新增成功'
//         });
//     });

router
    .route('/allAddCart')
    //食譜一鍵加入購物車
    .post(function (req, res) {
        return new Promise((resolve, reject) => {
                let products = req.body.products,
                    addNum = 0;
                for (i = 0; i < products.length; i++) {
                    let product_id = products[i].ingredients_id
                    connection.query(
                        "SELECT sid, qty " +
                        "FROM cart " +
                        "WHERE member_sid=? AND product_id=?", [req.session.sid, product_id],
                        function (err, row) {
                            if (err)
                                throw err;
                            if (!row.length) {
                                connection.query(
                                    "INSERT INTO cart (member_sid, product_id) " +
                                    "VALUES (?,?)", [req.session.sid, product_id],
                                    function (err) {
                                        if (err)
                                            reject(err);
                                        else {
                                            addNum += 1;
                                            if (addNum = products.length) {
                                                resolve();
                                            }
                                        }
                                    })
                            } else {
                                let newQty = row[0].qty + 1,
                                    sid = row[0].sid
                                connection.query(
                                    "UPDATE cart " +
                                    "SET qty=? " +
                                    "WHERE sid=?", [newQty, sid],
                                    function (err) {
                                        if (err)
                                            reject(err);
                                        else {
                                            addNum += 1;
                                            if (addNum = products.length) {
                                                resolve();
                                            }
                                        }
                                    })
                            }
                        });
                }
            })
            .then(() => {
                res.json({
                    message: '新增成功'
                });
            })
            .catch(err => {
                res.status(500).json({
                    message: '新增失敗'
                });
            });

    });


module.exports = router;