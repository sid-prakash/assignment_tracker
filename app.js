var express = require('express');
var http = require('http');
var path = require("path");
var bodyParser = require('body-parser');
var helmet = require('helmet');
var rateLimit = require("express-rate-limit");
var app = express();
var server = http.createServer(app);

var mysql = require('mysql');

var con = mysql.createConnection({
  host:'coms-319-g27.class.las.iastate.edu',
  user:'gp27',
  password:'Password@!1',
  database:'gp27',
  multipleStatements: true
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});


app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname));
app.use(helmet());
app.use(limiter);
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.get('/', function(req,res){
  res.render("Login");
});

var loginName;
var loginData;

app.post('/login',(req, res) => {
  console.log(req.body);
  con.query("call loginUser(?, ?, @output); select @output;", [req.body.Email, req.body.psw], function (err, results, fields) {
    if (err) {
        console.log("err:", err);
    } else {
      var rows = JSON.stringify(JSON.parse(JSON.stringify(results[1])));
      console.log(rows);
       if(rows.includes('Login Success')){
        con.query("select fname, UserID from users where username = ?;", [req.body.Email], function (err, results, fields){
          if (err) {
            console.log("err:", err);
          }
          else{
            var out = (Object.values(JSON.parse(JSON.stringify(results))));
            con.query("select * from assignments where UserID = ?;", out[0].UserID, function (err, data, fields){
            if (err) {
              console.log("err:", err);
            }
            else{
              loginName = out[0].fname;
              loginData = data;
              res.render("Home", {
                name: loginName ,
                uid: out[0].UserID ,
                userData: loginData,
              });
            }
            });
          }   
        });
      }
      else {
        res.end("Invalid login!");
      }  
  }
  });
});

app.get('/CreateUser', function(req,res){
    res.render("CreateUser", {
                  usc: false,
                });
});


// connection.query(sql, req.body.Email, req.body.password, req.body.Name, req.body.Name)

//use req.body to get data from forms

//need to 
app.post('/add',(req, res) => {

  var name = req.body.fname.split(' ');
  con.query("call addUser(?,?,?,?)", [req.body.username, req.body.phash[0].toString(), req.body.fname, req.body.lname], function (err, results, fields) {
    if (err) {
        console.log("err:", err);
        res.end('There was an error adding user');
    } else {
      console.log(results);
      res.render("CreateUser", {
                usc: true,
              });
    }
    res.end()

  });
});


app.post('/delete',(req, res) => {

    con.query("delete from assignments where aid = 10;", function (err, results, fields) {
      if (err) {
          console.log("err:", err);
          res.end('There was an error adding user');
      } else {
          con.query("select fname from users where UserID = ?;", [req.body.uid], function (err, results, fields){
                if (err) {
                  console.log("err:", err);
                }
                else{
                  var out = (Object.values(JSON.parse(JSON.stringify(results))));
                  con.query("select * from assignments where UserID = ?;", req.body.uid, function (err, data, fields){
                  if (err) {
                    console.log("err:", err);
                  }
                  else{
                    res.render("Home", {
                      name: out[0].fname,
                      uid: req.body.uid,
                      userData: data
                    });
                  }
                  });
                }   
              });
      }
    });
  });





app.get('/Home', function(req,res){
  console.log(req.query.aclass);
  res.render("Home", {
    name: loginName,
    userData: loginData,
    uid: req.query.uid
  });
});


app.get('/AddAssignments', function(req,res){
  console.log(req.query.aclass);
  res.render("AddAssignment", {
    uid: req.query.uid
  });
});

app.post('/addassignment',(req, res) => {
  //   var name = req.body.fname.split(' ');
    con.query("call addAssignment(?,?,?,?,?,?)", [req.body.uid, req.body.aclass, req.body.aname, req.body.dyear, req.body.dmonth, req.body.dday], function (err, results, fields) {
      if (err) {
          console.log("err:", err);
          res.end('There was an error adding the assignment');
      } else {
        con.query("select fname from users where UserID = ?;", [req.body.uid], function (err, results, fields){
              if (err) {
                console.log("err:", err);
              }
              else{
                var out = (Object.values(JSON.parse(JSON.stringify(results))));
                con.query("select * from assignments where UserID = ?;", req.body.uid, function (err, data, fields){
                if (err) {
                  console.log("err:", err);
                }
                else{
                  res.render("Home", {
                    name: out[0].fname,
                    uid: req.body.uid,
                    userData: data
                  });
                }
                });
              }   
            });
      }
    });
});


app.get('/edit', function(req,res){
  console.log(req.query.aclass);
  res.render("Edit", {
    aid: req.query.aid,
    uid: req.query.uid,
    aname: req.query.aname,
    aclass: req.query.aclass,
    dday: req.query.dday,
    dmonth: req.query.dmonth,
    dyear: req.query.dyear
    });
    //res.send("userId is set to " + req.query.uid + " aname = " + req.query.aname + " class = "+ req.query.class);
});


app.post('/updateA',(req, res) => {

    con.query("call updateAssignment(?,?,?,?, ?, ?, ?)", [req.body.aid, req.body.uid, req.body.aclass, req.body.aname, req.body.dyear, req.body.dmonth, req.body.dday], function (err, results, fields) {
      if (err) {
          console.log("err:", err);
          res.end('There was an error updating assignment user');
      } else {
        console.log(results);
        con.query("select fname from users where UserID = ?;", [req.body.uid], function (err, results, fields){
              if (err) {
                console.log("err:", err);
              }
              else{
                var out = (Object.values(JSON.parse(JSON.stringify(results))));
                con.query("select * from assignments where UserID = ?;", req.body.uid, function (err, data, fields){
                if (err) {
                  console.log("err:", err);
                }
                else{
                  res.render("Home", {
                    name: out[0].fname,
                    uid: req.body.uid,
                    userData: data
                  });
                }
                });
              }   
            });
      }
  
    });
  });




server.listen(3000,function(){ 
    console.log("Server listening on port: 3000");
})
