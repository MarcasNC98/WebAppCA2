//Code based upon Lecturer Joshua Cassidy's 'staff-todos-part-6' example on Moodle https://mymoodle.ncirl.ie/course/view.php?id=702

//Enables routing using express.js
var express = require('express');
var router = express.Router();
//Syncs MySQL database with webpage
var MySql = require('sync-mysql');
var connection_details = require("../modules/connection_details")

//Gets the root page, aka the index page. Connects to MySQL using the details entered in connection_details.js page
router.get('/', function (req, res, next) {
  var connection = new MySql({
    user: connection_details.user,
    password: connection_details.password,
    host: connection_details.host,
    database: connection_details.database
  })
  //Creates a variable 'order's that will select all from products, inner join orders on products.product_id, which will then equal orders.product_id
  var orders = connection.query('select * from products inner join orders on products.product_id = orders.product_id;')
  //Renders the page header for the root/index webpage
  res.render('index', { title: 'Customers Order List', orders: orders, page_header: '', link: '' });
});

//Gets the /add function
router.get('/add', function (req, res, next) {
  var connection = new MySql({
    user: connection_details.user,
    password: connection_details.password,
    host: connection_details.host,
    database: connection_details.database
  });
  //Creates a variable 'order' that will select all from products from the SQL database
  var orders = connection.query('select * from products;')

  //Renders the add_orders.ejs page
  res.render('add_orders', { orders: orders })
});

//Function to add information into orders table in SQL database
router.post("/add", function (req, res, next) {
  //Creating the variables that correspond to the table headers in my SQL database
  var product_id = req.body.product_id
  var forename = req.body.forename
  var surname = req.body.surname
  var address = req.body.address
  var city = req.body.city
  var county = req.body.county
  var eircode = req.body.eircode
  var order_date = req.body.order_date

  var connection = new MySql({
    user: connection_details.user,
    password: connection_details.password,
    host: connection_details.host,
    database: connection_details.database
  });
  //Inserts the value entered for each variable into the database using an INSERT function
  connection.query("INSERT INTO orders(forename, surname, address, city, county, eircode, order_date, product_id) VALUES ((?), (?), (?), (?), (?), (?), (?), (?));", [forename, surname, address, city, county, eircode, order_date, product_id]);
  
  console.log(req.body)
  //Once data is inserted, the website will redirect you to add order tracking information
  res.redirect("/tracking/add")
})

//Gets the delete function
router.get('/delete', function (req, res, next) {
  var order_id = req.query.order_id
  var connection = new MySql({
    user: connection_details.user,
    password: connection_details.password,
    host: connection_details.host,
    database: connection_details.database
  });
  //Will delete from the orders table any information where order_id equals the value in the variable order_id.
  connection.query("DELETE FROM orders where order_id = (?);", [order_id])
  //When information is deleted, redirects back to the root page, which is my 'current orders' page 
  res.redirect('/')
})

//Gets the update function
router.get('/update', function (req, res, next) {
  var order_id = req.query.order_id
  //Creates a variable that will alert the user if an error occurs during the updating of order information
  var error = req.query.error
  //Renders the 'update_orders.ejs' page
  res.render('update_orders', { order_id: order_id, error: error })
})

//Function that will enable the updating of order information
router.post('/update', function (req, res, next) {
  var order_id = req.body.order_id
  var forename = req.body.forename
  var surname = req.body.surname
  var address = req.body.address
  var city = req.body.city
  var county = req.body.county
  var eircode = req.body.eircode
  var order_date = req.body.order_date

  var connection = new MySql({
    user: connection_details.user,
    password: connection_details.password,
    database: connection_details.database,
    host: connection_details.host
  })
  //Updates the orders set
  var query_string = "UPDATE orders set"
  var params = []
  if (forename) {
    query_string += ' forename = (?)'
    params.push(forename)
  }
  if (surname) {
    if (forename || address || city || county || eircode || order_date) {
      query_string += ", "
    }
    query_string += ' surname = (?) '
    params.push(surname)
  }
  if (address) {
    if (forename || surname || city || county || eircode || order_date) {
      query_string += ", "
    }
    query_string += ' address = (?) '
    params.push(address)
  }
  if (city) {
    if (forename || surname || address || county || eircode || order_date) {
      query_string += ", "
    }
    query_string += ' city = (?) '
    params.push(city)
  }
  if (county) {
    if (forename || surname || address || city || eircode || order_date) {
      query_string += ", "
    }
    query_string += ' county = (?) '
    params.push(county)
  }
  if (eircode) {
    if (forename || surname || address || city || county || order_date) {
      query_string += ", "
    }
    query_string += ' eircode = (?) '
    params.push(eircode)
  }
  //If the fields have not been updated, an error message will display alerting the user to update fields
  query_string += "WHERE order_id = (?)"
  if (!forename && !surname && !address && !city && !county && !eircode && !order_date) {
    res.redirect("/update?order_id=" + order_id + "&error=You need to update some data")
  }
  params.push(order_id)
  connection.query(query_string, params)
  //Once the data has been updated, user will be redirected back to the root page
  res.redirect('/')
})

module.exports = router;
