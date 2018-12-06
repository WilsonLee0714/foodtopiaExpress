var express = require('express');
var router = express.Router();
var mysql = require("mysql");

//建立連線
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'foodtopia',
  password : '',
  database : 'foodtopia',
//   port: 3306

});
connection.connect();

// http://localhost:3000/xxx/recipe/:id&:ca
router.route('/recipe_list')
    .get(function(req, res){
        //GET http://localhost:3000/xxx/recipe
        // res.send("get all recipe")
        connection.query('select * from `menu` WHERE `difficult` Like "困難" limit 3', function(error, results) {
            if(error) throw error;
            res.json(results)
            console.log("Database foodtopia connected")
        })
    })
    // .post(function(req, res){
    //     //POST http://localhost:3000/xxx/recipe
    //     // req.body
    // })

// http://localhost:3000/api/recipe/1
router.route('/recipe_list/1')
.get(function(req, res){
    //GET http://localhost:3000/api/recipe/2  
    // 讀取:id參數的值 req.params.id
    // res.send("get recipe id " + req.params.id);
    connection.query(
        'SELECT * FROM `menu`', function(error,results){
            console.log(results)
        if(error) throw error;
        res.json(results)
        
      })

})
// .put(function(req, res){
//     //GET http://localhost:3000/api/recipe/2 
//     res.send("修改" + req.params.id + "資料");
// })
// .delete(function(req, res){
//     //GET http://localhost:3000/api/recipe/2  
//     res.send("刪除" + req.params.id + "資料");
// })

module.exports = router;