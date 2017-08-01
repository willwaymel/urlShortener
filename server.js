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
var dbSongs="";

app.use(express.static('public'));

// Create seed data
var seedData = [
  {
    decade: '1970s',
    artist: 'Debby Boone',
    song: 'You Light Up My Life',
    weeksAtOne: 10
  },
  {
    decade: '1980s',
    artist: 'Olivia Newton-John',
    song: 'Physical',
    weeksAtOne: 10
  },
  {
    decade: '1990s',
    artist: 'Mariah Carey',
    song: 'One Sweet Day',
    weeksAtOne: 16
  }
];

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

app.get('/new/*', function(req, res) {
    var urlObject = {};
  console.log(req.params[0]);
    var oldURL = req.params[0];
    if (validUrl.isWebUri(oldURL)){//test if valid URL
        console.log("it's valid");
        // it IS valid
        var shortenedURL = randomURL();
        //add to the database? add a redirect
        urlObject = {original_url: oldURL, short_url: shortenedURL}
        
        var databaseEntry = [{
          original_url: oldURL, urlID: id
        }];
        
    

mongodb.MongoClient.connect(uri, function(err, db) {
  if(err) throw err;
  //
  var urls = db.collection('urls');
  urls.insert(databaseEntry, function(err, result) {
    if(err) throw err;
    
  })
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
});
      res.end(JSON.stringify(urlObject));//display the two urls
} else {//it's NOT valid 
    console.log("its not valid url");
    urlObject.error = "Wrong url format, make sure you have a valid protocol and real site.";
    res.end(JSON.stringify(urlObject));
    }
  

});
app.get("/:id", function (req, res) {
  console.log("im here in the /id section");
  mongodb.MongoClient.connect(uri, function(err, db) {
  if(err) throw err;
    //lookup the id in our database and return the url it corresponds to.
    
    //redirect to that url
  });
  res.end("redirect should happen");
});

app.get("/", function (request, response) {
  response.send(dbSongs);
});

// listen for requests :)
var listener = app.listen("3000", function () {
  console.log('Your app is listening on port ' + listener.address().port);
});