
var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require("body-parser");


var DB_USER = process.env.DB_USER;
var DB_PASS = process.env.DB_PASS;


var connection = mysql.createConnection({
  host: 'localhost',
  user: DB_USER,
  password: DB_PASS,
  database: 'bulletinboard'
});
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
connection.connect();


app.listen(3000);
console.log('listening on port 3000');

app.get("/", function(req, res) {
  connection.query('SELECT * from messages ', function(error, result) {
    res.render("home", {result: result});
  })
});

app.get("/", function(req, res) {
  res.render("home");
});


app.post("/home", function(req, res) {
  var tittle = req.body.tittle;
  var body = req.body.body;
  var datos = {
    tittle: tittle,
    body: body

  }
  connection.query('INSERT INTO messages SET ?', datos, function(error, result) {
    console.log("here insert")
console.log(result);
    res.redirect("/");
  })
});


app.get("/post/:id", function(req, res) {
  var idd = req.params.id;
  connection.query('SELECT * FROM messages where id=?', idd, function(err, result) {
    if (err) {
      console.log(err)
    } else {
      res.render("post", {resultado: result});

    }
  })

})
app.post("/home/:id", function(req, res) {
  var iddd = req.params.id;
connection.query('DELETE FROM messages where id=?',iddd, function(error, result) {
  res.redirect("/");
})
})

app.get('*', function(request, response) {
  response.status(404).send('Page Not Found.');
});
