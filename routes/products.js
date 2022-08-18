//Code based upon Lecturer Joshua Cassidy's 'staff-todos-part-6' example on Moodle https://mymoodle.ncirl.ie/course/view.php?id=702

//Enables routing using express.js
var express = require('express');
var router = express.Router();
//Syncs MySQL database with webpage
var MySql = require('sync-mysql');
var connection_details = require("../modules/connection_details")

//Will get the root page
router.get('/', function (req, res, next) {
  var connection = new MySql({
    host: connection_details.host,
    user: connection_details.user,
    password: connection_details.password,
    database: connection_details.database
  });
  var products = connection.query("SELECT * from products");
  console.log(products);
  res.render('products', { title: 'Express', products: products });
});


//Gets the delete function
router.get('/delete', function (req, res, next) {
  var product_id = req.query.product_id
  var connection = new MySql({
    user: connection_details.user,
    password: connection_details.password,
    host: connection_details.host,
    database: connection_details.database
  });
  //Will delete from the products table where the product_id equals the value in the variable product_id
  connection.query("DELETE FROM products where product_id = (?);", [product_id])
  //Redirects the user to the products webpage
  res.redirect('/products')
})

//Function to add data into products table
router.post('/add', function (req, res, next) {
  //Creating the variables that will correspond to the table headers in my 'products' table in my SQL database
  var pName = req.body.pName
  var pType = req.body.pType
  var pAmount = req.body.pAmount
  var connection = new MySql({
    host: connection_details.host,
    user: connection_details.user,
    password: connection_details.password,
    database: connection_details.database
  })
  //Will insert into the products table the values attributed to the variables
  connection.query("INSERT INTO products (pName, pType, pAmount) VALUES ((?), (?), (?));", [pName, pType, pAmount]);
  //When data is inserted, user will be redirected to the products page
  res.redirect("/products");

})

//Gets the update function
router.get('/update', function (req, res, next) {
  var product_id = req.query.product_id
  //Creates an error variable that will display an error message to the user
  var error = req.query.error
  //Will render the 'update_products.ejs' page
  res.render('update_products', { product_id: product_id, error: error })
})

//Funnction to update the information in the products table
router.post('/update', function (req, res, next) {
  var product_id = req.body.product_id
  var pName = req.body.pName
  var pType = req.body.pType
  var pAmount = req.body.pAmount
  var connection = new MySql({
    user: connection_details.user,
    password: connection_details.password,
    database: connection_details.database,
    host: connection_details.host
  })
  var query_string = "UPDATE products set"
  var params = []
  if (pName) {
    query_string += ' pName = (?)'
    params.push(pName)
  }
  if (pType) {
    if (pName || pAmount) {
      query_string += ", "
    }
    query_string += ' pType = (?) '
    params.push(pType)
  }
  if (!isNaN(pAmount)) {
    if (pName) {
      query_string += ", "
    }
    query_string += ' pAmount = (?) '
    params.push(pAmount)
  }
  query_string += "WHERE product_id = (?)"
  if (!pName && !pType && !pAmount) {
    res.redirect("/products/update?product_id=" + product_id + "&error=You must update some fields")
  }
  params.push(product_id)
  connection.query(query_string, params)
  //Redirects the user to products page
  res.redirect('/products')
})

module.exports = router;
