var cheerio = require('cheerio');
var request = require('request');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
// var logger = require('morgan');

// configure our app for morgan and body parser
// app.use(logger('dev'));
app.use(bodyParser.urlencoded({
	extended: false
}));

// static file support with public folder
app.use(express.static('app'));

//mongo
var mongojs = require('mongojs');
// var databaseUrl = '';
// var collections = '';

//handlebars
var exphbs = require('express-handlebars');
var hbs = require('handlebars');

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//routes
require('./app/routing/html-routes.js')(app);

var db = mongojs(process.env.MONGODB_URI);
db.on('error', function(err) {
  console.log('Database Error:', err);
});



//============ End Setup Files ==============/



//============ Port =========================/

var port = process.env.PORT || 3001;

app.listen(port, function(){
	console.log('App running on port ' + port);

});
