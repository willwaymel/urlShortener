

var express = require('express');
var mongodb = require('mongodb');
var validUrl = require('valid-url');
var app = express();
var shortid = require('shortid');//for generating unique ids for urls

app.use(express.static('public'));

app.use('/public', express.static(process.cwd() + '/public'));

// app.route('/_api/package.json')
//   .get(function(req, res, next) {
//     console.log('requested');
//     fs.readFile(__dirname + '/package.json', function(err, data) {
//       if(err) return next(err);
//       res.type('txt').send(data.toString());
//     });
//   });
  
// app.route('/')
//     .get(function(req, res) {
// 		  res.sendFile(process.cwd() + '/views/index.html');
//     })


app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

//serve index
//check if 8000 already exists
//check if url exists? 
//create new 8000 check if it exists loop?

// Standard URI format: mongodb://[dbuser:dbpassword@]host:port/dbname, details set in .env
var uri = 'mongodb://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+':'+process.env.PORT+'/'+process.env.DB;

var id = 0;

function randomURL(){
  // id = Math.floor(Math.random() * (10000 - 1000) + 1000);
  id = shortid.generate();
  return "https://way-shorter-url.glitch.me/" + id;
}

// app.get(/\/new\/(.+$)/m, function(req, res) {//here's my old - not working to get whole string

app.get('/new/*', function(req, res){
  console.log(req.originalUrl);

    var urlObject = {};
    var oldURL = req.originalUrl.replace(/^\/new\//, "");//this is necessary to get any query strings after possible ? in url, otherwise ignored by req.params
    console.log(oldURL);
    if (validUrl.isWebUri(oldURL)){//test if valid URL
        console.log("it's valid");
        // it IS valid
        var shortenedURL = randomURL();
        //add to the database? add a redirect
        urlObject = {original_url: oldURL, short_url: shortenedURL}
        console.log(id + " is the new ID");
        var databaseEntry = [{
          original_url: oldURL, urlID: id
        }];
        
        mongodb.MongoClient.connect(uri, function(err, db) {
          if(err) throw err;
          var urls = db.collection('urls');
                urls.insert(databaseEntry, function(err, result) {
                  if(err) throw err;
                console.log('ive written to the db');
                  db.close();
            });    
            });
        
        res.end(JSON.stringify(urlObject));//display the two urls
    } else {//it's NOT valid 
        console.log("its not valid url");
        urlObject.error = "Wrong url format, make sure you have a valid protocol and real site.";
        res.end(JSON.stringify(urlObject));
        }
});
// app.get(/\/([1-9]{1}\d{3})$/, function (req, res) {//regex looking for /1000 through /9999
app.get('/*', function (req, res) {
  
  var searchedID = req.params[0];
  console.log("I'm in the redirect app.get - here's the searched id " + searchedID + "its type is " + typeof searchedID);
  // res.send(JSON.stringify(searchedID));
  var lookedUpUrl = {};
  mongodb.MongoClient.connect(uri, function(err, db) {
    if(err) throw err;
    //lookup the id in our database and return the url it corresponds to.
    
      db.collection('urls').findOne({urlID:searchedID}, function(err, result){
        if(err) console.log(err);
        if (result) {
            // console.log(result.original_url + " this is the looked up web address" + typeof result + JSON.stringify(result));
            lookedUpUrl = result.original_url;
            console.log(lookedUpUrl);
            db.close();
            // res.redirect(JSON.stringify(result.original_url));
            res.redirect(301, lookedUpUrl);  
        } else {
            console.log('theres no URL for that id or there is a problem');
            var errorObject = {error: "There's no URL for that id in our database."};
            // urlObject.error = "Wrong url format, make sure you have a valid protocol and real site.";
            res.end(JSON.stringify(errorObject));
        }
        
    });
    
    //redirect to that url
  });
  
  // res.redirect(301, JSON.stringify(lookedUpUrl));

  // res.end('');
  // res.end("bye");
  // res.end(JSON.stringify(lookedUpUrl));
});

// listen for requests :)
var listener = app.listen("3000", function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

