var express = require("express");
var router = express.Router();
var mysql = require("mysql");


//建立連線
var connection = mysql.createConnection({
  host: "localhost",
  database: "proj_f01",
  user: "root",
  password: ""
});
connection.connect();


// http://localhost:3000/api/ingredients
router
  .route("/ingredients")
  .get(function(req, res) {
    //GET http://localhost:3000/xxx/ingredients
    //  res.send("get all product");
    connection.query("select * from igr_test", function(error, results) {
      if (error) throw error;
      res.json(results);
    });
  })

 

module.exports = router;
