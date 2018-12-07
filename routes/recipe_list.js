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
        connection.query('select * from `sector` ', function(error, results) {
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
router.route('/recipe_list/:id')
.get(function(req, res){
    //GET http://localhost:3000/api/recipe_list/2  
    // 讀取:id參數的值 req.params.id
    // res.send("get recipe id " + req.params.id);
    connection.query(
        'SELECT * FROM `sector` WHERE `category_id`=?', req.params.id,function(error,results){
            // console.log(results)
        if(error) throw error;
        res.json(results)
        
      })

})


// 子分類下的食譜
router.route('/recipe_sub/1')
.get(function(req, res){
    //GET http://localhost:3000/api/recipe_list/sub2  
    // 讀取:id參數的值 req.params.id
    // res.send("get recipe id " + req.params.id);
    // var subCateId = [ 'country_id', 'serving_id', 'occasion_id', 'difficult_id', 'time_id' ] 
    connection.query(
        'SELECT * FROM `menu` WHERE `category_id`=1', function(error,results){
            // console.log(results)
        if(error) throw error;
        res.json(results);
        // console.log(req.params.id)
      })
})
// how do i read different column when i have variable category id?
//  xxxFAILxxx 1. we can't write variables into SQL query  
//  2. we try to write different fetch API? how many api would it be?


module.exports = router;