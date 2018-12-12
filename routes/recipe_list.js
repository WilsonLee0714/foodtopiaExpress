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
router.route('/recipe_list/:id')
    .get(function(req, res){
        //GET http://localhost:3000/xxx/recipe
        // res.send("get all recipe")
        connection.query('select * from `sector` where `category_id`=?',req.params.id, function(error, results) {
            if(error) throw error;
            res.json(results)
            // console.log("Database foodtopia connected")
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


// 子分類下的食譜，須由不同API抓不同欄位
router.route('/country/:id')
.get(function(req, res){
    //GET http://localhost:3000/api/country/:id  
    // 讀取:id參數的值 req.params.id
    // res.send("get recipe id " + req.params.id);
    // var subCateId = [ 'country_id', 'serving_id', 'occasion_id', 'difficult_id', 'time_id' ] 
    connection.query(
        'SELECT `menu`.*, `members`.`nick_name` FROM `members` JOIN `menu` ON `menu`.`member_id`=`members`.`sid` WHERE `country_id`=?',req.params.id, function(error,results){
            // console.log(results)
        if(error) throw error;
        res.json(results);
        // console.log(req.params.id)
      })
})

router.route('/occasion/:id')
.get(function(req, res){
    //GET http://localhost:3000/api/occasion/:id  
    // 讀取:id參數的值 req.params.id
    // res.send("get recipe id " + req.params.id);
    // var subCateId = [ 'country_id', 'serving_id', 'occasion_id', 'difficult_id', 'time_id' ] 
    connection.query(
        'SELECT `menu`.*, `members`.`nick_name` FROM `members` JOIN `menu` ON `menu`.`member_id`=`members`.`sid` WHERE `occasion_id`=?',req.params.id, function(error,results){
            // console.log(results)
        if(error) throw error;
        res.json(results);
        // console.log(req.params.id)
      })
})

router.route('/serving/:id')
.get(function(req, res){
    //GET http://localhost:3000/api/serving/:id  
    // 讀取:id參數的值 req.params.id
    // res.send("get recipe id " + req.params.id);
    // var subCateId = [ 'country_id', 'serving_id', 'occasion_id', 'difficult_id', 'time_id' ] 
    connection.query(
        'SELECT `menu`.*, `members`.`nick_name` FROM `members` JOIN `menu` ON `menu`.`member_id`=`members`.`sid` WHERE `serving_id`=?',req.params.id, function(error,results){
            // console.log(results)
        if(error) throw error;
        res.json(results);
        // console.log(req.params.id)
      })
})

router.route('/difficult/:id')
.get(function(req, res){
    //GET http://localhost:3000/api/difficult/:id  
    // 讀取:id參數的值 req.params.id
    // res.send("get recipe id " + req.params.id);
    // var subCateId = [ 'country_id', 'serving_id', 'occasion_id', 'difficult_id', 'time_id' ] 
    connection.query(
        'SELECT `menu`.*, `members`.`nick_name` FROM `members` JOIN `menu` ON `menu`.`member_id`=`members`.`sid` WHERE `difficult_id`=?',req.params.id, function(error,results){
            // console.log(results)
        if(error) throw error;
        res.json(results);
        // console.log(req.params.id)
      })
})
router.route('/time/:id')
.get(function(req, res){
    //GET http://localhost:3000/api/time/:id  
    // 讀取:id參數的值 req.params.id
    // res.send("get recipe id " + req.params.id);
    // var subCateId = [ 'country_id', 'serving_id', 'occasion_id', 'difficult_id', 'time_id' ] 
    connection.query(
        'SELECT `menu`.*, `members`.`nick_name` FROM `members` JOIN `menu` ON `menu`.`member_id`=`members`.`sid` WHERE `time_id`=?',req.params.id, function(error,results){
            // console.log(results)
        if(error) throw error;
        res.json(results);
        // console.log(req.params.id)
      })
})

// 大分類
router.route('/category/:id')
.get(function(req, res){
    //GET http://localhost:3000/api/category/1  
    // 讀取:id參數的值 req.params.id
    // res.send("get recipe id " + req.params.id);
    connection.query(
        'SELECT * FROM `category`',function(error,results){
            // console.log(results)
        if(error) throw error;
        res.json(results)
        
      })

})
// how do i read different column when i have variable category id?
//  xxxFAILxxx 1. we can't write variables into SQL query  
//  2. we try to write different fetch API? how many api would it be?


module.exports = router;