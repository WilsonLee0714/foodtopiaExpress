var express = require("express");
var router = express.Router();
var mysql = require("mysql");


//建立連線
var connection = mysql.createConnection({
  host: "localhost",
  database: "foodtopia",
  user: "foodtopia",
  password: "",
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



// http://localhost:3000/api/:category
router
  .route("/:category")
  .get(function(req, res) {
    console.log(req.params.category)
    var category
    switch (req.params.category) {
      case 'fruit':
      category = '新鮮水果';
      break;
      case 'vegetable':
      category = '新鮮蔬菜';
      break;
      case 'meat':
      category = '肉類';
      break;
      case 'dairy':
      category = '乳製品';
      break;
      case 'seafood':
      category = '海鮮類';
      break;
      case 'other':
      category = '食物櫃';
      break;
    }
    //GET http://localhost:3000/xxx/ingredients
    //  res.send("get all product");
    connection.query("SELECT * FROM igr_test WHERE main_category=? ",[category],function(err, rows) {
      if (err) throw err;
      res.json(rows);
      console.log(rows)
    });
  })


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
