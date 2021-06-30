var express = require('express');
var router = express.Router();
const Swal = require('sweetalert');

var mysql = require('mysql');

//db connection
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_user'
});

connection.connect(function(err) {
    if (!err) {
        console.log('database is connected');
    } else {
        console.log('error connecting database');
    }
});
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/form', function(req, res, next) {
    res.render('add-form.ejs');
});

router.post('/form', function(req, res) {
    // console.log(req, body);
    const mybodydata = {
        user_name: req.body.user_name,
        user_email: req.body.user_email,
        user_mobile: req.body.user_mobile
    }
    connection.query("insert into tbl_user set ?", mybodydata, function(err, result) {
        if (err) throw err;
        res.redirect('/display');
    });
});

//fetch record from table
router.get('/display', function(req, res, next) {
    connection.query("select * from tbl_user", function(err, db_row) {
        if (err) throw err;
        console.log(db_row);
        res.render('display-table', { db_rows_array: db_row });
    })
});

//delete user by ID 
router.get('/delete/:id', function(req, res) {
    var deleted = req.params.id;
    console.log('delete id is ' + deleted);
    connection.query("delete from tbl_user where user_id = ? ", [deleted], function(err, db_row) {
        if (err) throw err;
        console.log(db_row);
        console.log("record deleted");
        res.redirect('/display');
    })
});

//get single user By Id
router.get('/show/:id', function(req, res) {
    var showid = req.params.id;
    console.log("show id is " + showid);

    connection.query("select * from tbl_user where user_id = ? ", [showid], function(err, db_rows) {
        console.log(db_rows);
        if (err) throw err;
        res.render("show", { db_rows_array: db_rows });
    })
});
//get single user for edit record
router.get('/edit/:id', function(req, res) {
    console.log("Edit id is : " + req.params.id);
    var user_id = req.params.id;
    connection.query("select * from tbl_user where user_id = ? ", [user_id], function(err, db_rows) {
        if (err) throw err;
        console.log(db_rows);
        res.render("edit-form", { db_rows_array: db_rows });
    })
});

//update record using post method
router.post('/edit/:id', function(req, res) {
    console.log("Edit id is : " + req.params.id);
    var userid = req.params.id;

    var username = req.body.user_name;
    var useremail = req.body.user_email;
    var usermobile = req.body.user_mobile;

    connection.query("update tbl_user set user_name = ?, user_email = ?, user_mobile = ? where user_id =?", [username, useremail, usermobile, userid], function(err, respond) {
        if (err) throw err;
        res.redirect('/display');
    });
});

module.exports = router;