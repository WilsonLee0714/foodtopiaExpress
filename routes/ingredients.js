var express = require("express");
var router = express.Router();
var mysql = require("mysql");


//建立連線
var connection = mysql.createConnection({
  host: "localhost",
  database: "foodtopia",
  user: "foodtopia",
  password: "",
  // port: 3306

});
connection.connect();


// http://localhost:3000/api/ingredients_meat
router
  .route("/ingredients_meat")
  .get(function(req, res) {
    //GET http://localhost:3000/xxx/ingredients
    //  res.send("get all product");
    connection.query("select * from igr_test where product_id between 1101 and 1517 ", function(error, results) {
      if (error) throw error;
      res.json(results);
    });
  })

// http://localhost:3000/api/ingredients_dairy
  router
  .route("/ingredients_dairy")
  .get(function(req, res) {
    //GET http://localhost:3000/xxx/ingredients
    //  res.send("get all product");
    connection.query("select * from igr_test where product_id between 2101 and 2501 ", function(error, results) {
      if (error) throw error;
      res.json(results);
    });
  })

  
// http://localhost:3000/api/ingredients_other
router
.route("/ingredients_other")
.get(function(req, res) {
  //GET http://localhost:3000/xxx/ingredients
  //  res.send("get all product");
  connection.query("select * from igr_test where product_id between 3101 and 3809 ", function(error, results) {
    if (error) throw error;
    res.json(results);
  });
})

// http://localhost:3000/api/ingredients_seafood
router
.route("/ingredients_seafood")
.get(function(req, res) {
  //GET http://localhost:3000/xxx/ingredients
  //  res.send("get all product");
  connection.query("select * from igr_test where product_id between 4101 and 4246 ", function(error, results) {
    if (error) throw error;
    res.json(results);
  });
})

// http://localhost:3000/api/ingredients_fruit
router
.route("/ingredients_fruit")
.get(function(req, res) {
  //GET http://localhost:3000/xxx/ingredients
  //  res.send("get all product");
  connection.query("select * from igr_test where product_id between 5101 and 5132 ", function(error, results) {
    if (error) throw error;
    res.json(results);
  });
})

// http://localhost:3000/api/ingredients_vegetable
router
.route("/ingredients_vegetable")
.get(function(req, res) {
  //GET http://localhost:3000/xxx/ingredients
  //  res.send("get all product");
  connection.query("select * from igr_test where product_id between 6101 and 6828 ", function(error, results) {
    if (error) throw error;
    res.json(results);
  });
})


  // SELECT * FROM igr_test
  // WHERE product_name
  // BETWEEN 101001 AND 101020;


module.exports = router;
