/*
 * Copyright (c) 2016 ObjectLabs Corporation
 * Distributed under the MIT license - http://opensource.org/licenses/MIT
 *
 * Written with: mongodb@2.1.3
 * Documentation: http://mongodb.github.io/node-mongodb-native/
 * A Node script connecting to a MongoDB database given a MongoDB Connection URI.
*/

// server.js
// where your node app starts

// init project
var express = require('express');
var mongodb = require('mongodb');
var validUrl = require('valid-url');
var app = express();


app.use(express.static('public'));

app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

//serve index
//check if 8000 already exists
//check if url exists? 
//create new 8000 check if it exists loop?


// app.get('/', function(req, res) {
  
// })
//want to return this 
// {
// original_url: "https://www.facebook.com",
// short_url: "https://little-url.herokuapp.com/7963"
// }


// Standard URI format: mongodb://[dbuser:dbpassword@]host:port/dbname, details set in .env
var uri = 'mongodb://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+':'+process.env.PORT+'/'+process.env.DB;

var id = 0;

function randomURL(){
  //check if the new random number is already in the database
  id = Math.floor(Math.random() * (10000 - 1000) + 1000);
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
        //
        var urls = db.collection('urls');
        urls.insert(databaseEntry, function(err, result) {
          if(err) throw err;
        console.log('ive written to the db')
        })

});
      res.end(JSON.stringify(urlObject));//display the two urls
} else {//it's NOT valid 
    console.log("its not valid url");
    urlObject.error = "Wrong url format, make sure you have a valid protocol and real site.";
    res.end(JSON.stringify(urlObject));
    }
  

});
app.get(/\/([1-9]{1}\d{3})$/, function (req, res) {//regex looking for /1000 through /9999
  
  var searchedID = parseInt(req.params[0]);
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

// app.get("/", function (request, response) {
//   response.send(dbSongs);
// });

// listen for requests :)
var listener = app.listen("3000", function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

  // var songs = db.collection('songs');
  // dbSongs+="Creating collection 'songs'<br />";
  
   // Note that the insert method can take either an array or a dict.

//   songs.insert(seedData, function(err, result) {
    
//     if(err) throw err;

//     /*
//      * Then we need to give Boyz II Men credit for their contribution
//      * to the hit "One Sweet Day".
//      */

//     songs.update(
//       { song: 'One Sweet Day' }, 
//       { $set: { artist: 'Mariah Carey ft. Boyz II Men' } },
//       function (err, result) {
        
//         if(err) throw err;

//         /*
//          * Finally we run a query which returns all the hits that spend 10 or
//          * more weeks at number 1.
//          */

//         songs.find({ weeksAtOne : { $gte: 10 } }).sort({ decade: 1 }).toArray(function (err, docs) {

//           if(err) throw err;

//           docs.forEach(function (doc) {
//             console.log(
//               'In the ' + doc['decade'] + ', ' + doc['song'] + ' by ' + doc['artist'] + 
//               ' topped the charts for ' + doc['weeksAtOne'] + ' straight weeks.'
//             );
//             dbSongs+="Adding "+doc['artist']+" - "+doc['song']+" into 'songs'<br />";
//           });
         
//           // Since this is an example, we'll clean up after ourselves.
//           songs.drop(function (err) {
//             dbSongs+="Dropping collection 'songs'<br />";
//             if(err) throw err;
          
            // Only close the connection when your app is terminating.
            // db.close(function (err) {
            //   dbSongs+="Closing db " + process.env.DB;
            //   dbSongs+="<script src=\"https://button.glitch.me/button.js\" data-style=\"glitch\"></script><div class=\"glitchButton\" style=\"position:fixed;top:20px;right:20px;\"></div>";
            //   if(err) throw err;
            // });
        //   });
        // });
  //     }
  //   );
  // });
// Create seed data
// var seedData = [
//   {
//     decade: '1970s',
//     artist: 'Debby Boone',
//     song: 'You Light Up My Life',
//     weeksAtOne: 10
//   },
//   {
//     decade: '1980s',
//     artist: 'Olivia Newton-John',
//     song: 'Physical',
//     weeksAtOne: 10
//   },
//   {
//     decade: '1990s',
//     artist: 'Mariah Carey',
//     song: 'One Sweet Day',
//     weeksAtOne: 16
//   }
// ];