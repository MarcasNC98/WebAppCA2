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
  //Creates a variable 'tracking' that will select all from orders, inner join tracking on orders.order_id, which will then equal tracking.order_id
  var tracking = connection.query('select * from orders inner join tracking on orders.order_id = tracking.order_id;')

  //Renders the page header for the root/index webpage
  res.render('tracking', { title: 'Tracking List', tracking: tracking, page_header: '', link: '' });
});

//Gets the /add function
router.get('/add', function (req, res, next) {
  var connection = new MySql({
    user: connection_details.user,
    password: connection_details.password,
    host: connection_details.host,
    database: connection_details.database
  });
  //The variable 'tracking' will select all from orders in the SQL database
  var tracking = connection.query('select * from orders;')

  //Renders the 'add_tracking.ejs' page
  res.render('add_tracking', { tracking: tracking })
});

//Function into tracking table in database
router.post("/add", function (req, res, next) {
  var order_id = req.body.order_id
  var courier = req.body.courier
  var shipping_date = req.body.shipping_date
  var connection = new MySql({
    user: connection_details.user,
    password: connection_details.password,
    host: connection_details.host,
    database: connection_details.database
  });
  //Inserts the value entered for each variable into the database using an INSERT function
  connection.query("INSERT INTO tracking(courier, shipping_date, order_id) VALUES ((?), (?), (?));", [courier, shipping_date, order_id]);

  console.log(req.body)
  //Once data is entered, will redirect the user back to the current tracking info page
  res.redirect("/tracking")
})

//Gets the delete function
router.get('/delete', function (req, res, next) {
  var tracking_id = req.query.tracking_id
  var connection = new MySql({
    user: connection_details.user,
    password: connection_details.password,
    host: connection_details.host,
    database: connection_details.database
  });
  //Will delete from the tracking table any information where tracking_id equals the value in the variable tracking_id.
  connection.query("DELETE FROM tracking where tracking_id = (?);", [tracking_id])
  //Redirects back to the currenttracking info page when data is deleted
  res.redirect('/tracking')
})

//Gets the update function
router.get('/update', function (req, res, next) {
  var tracking_id = req.query.tracking_id
  //Creates a variable that will alert the user if an error occurs during updating tracking information
  var error = req.query.error
  //Renders the 'update_tracking.ejs' page
  res.render('update_tracking', { tracking_id: tracking_id, error: error })
})

//Function that will enable the updating of tracking information
router.post('/update', function (req, res, next) {
  var tracking_id = req.body.tracking_id
  var courier = req.body.courier
  var shipping_date = req.body.shipping_date
  var connection = new MySql({
    user: connection_details.user,
    password: connection_details.password,
    database: connection_details.database,
    host: connection_details.host
  })
  //Updates the tracking set
  var query_string = "UPDATE tracking set"
  var params = []
  if (courier) {
    query_string += ' courier = (?)'
    params.push(courier)
  }
  if (shipping_date) {
    if (courier) {
      query_string += ", "
    }
    query_string += ' shipping_date = (?) '
    params.push(shipping_date)
  }
  query_string += "WHERE tracking_id = (?)"
  if (!courier && !shipping_date) {
    res.redirect("/tracking/update?tracking_id=" + tracking_id + "&error=You must update some fields")
  }
  params.push(tracking_id)
  connection.query(query_string, params)
  //Redirects the user to the current tracking info page when data is updated
  res.redirect('/tracking')
})

module.exports = router;
