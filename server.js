var express = require('express');
var bodyParser = require('body-parser');
var morganLog = require('morgan');
var mongoose = require('mongoose');
var request = require('request');
var cheerio = require('cheerio');
var Port = process.env.PORT || 8080;
var app = express();

//middleware
app.use(morganLog('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static('public'));

//set up mongoose Database
mongoose.connect('mongodb://localhost/hackernews');
var db = mongoose.connection;

db.on('error', function(err){
  console.log('Your error is: ', err);
});

db.once('open', function(){
  console.log('Connected to database');
});

//imports
var myNote = require('./models/myNote.js');
var myScrape = require('./models/myScrape.js');

//set up get/post requests here
app.get('/', function(req, res){
  res.send(index.html);
});

//scrape from Hacker news
app.get('/news', function(req, res){
  request('https://news.ycombinator.com/', function(err, res, html){
    if(err){
      res.send(err)
    }
    var $ = cheerio.load(html);
    var results = {};
    $('td.title').each(function(index, element){
      results.title = $(element).text();
      results.link = $(element).find('a.storylink').first().attr('href');
      var entry = new myScrape(results);
      entry.save(function(err, story){
        if(err){
          console.log(err);
        }
        else{
          console.log(story);
        }
      });
    });
  });
  res.send("scrape successful");
});

//show scraped articles
app.get('/stories', function(req, res){
  myScrape.find({}, function(err, story){
    if(err){
      console.log(err);
    }
    else{
      res.json(story);
    }
  });
});

//grab stories by id
app.get('/stories/:id', function(req, res){
  myScrape.findOne({'_id': req.params.id})
  .populate('notes')
  .exec(function(err, story){
    if(err){
      console.log(err)
    }
    else{
      res.json(story);
    }
  });
});

//post request for the notes
app.post('/stories/:id', function(req, res){
  var newNote = new myNote(req.body);
  newNote.save(function(err, story){
    if(err){
      console.log(err);
    }
    else{
      myScrape.findOneAndUpdate({'_id': req.params.id}, {'note': story._id})
      .exec(function(err, story){
        if(err){
          console.log(err);
        }
        else{
          res.send(story);
        }
      });
    }
  });
});

//fire up the server
app.listen(Port, function(){
  console.log('Server running on Port: ' + Port);
});
