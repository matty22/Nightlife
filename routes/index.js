// // This kind of works if you search twice
// const express = require('express');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const yelp = require('yelp-fusion');
// // var clientResponseArray = [];

// // Set up Mongoose schema
// var Businesses = require('../models/business');

// var searchRouter = express.Router();
// searchRouter.use(bodyParser.json());

// searchRouter.get('/', function(req, res, next) {
//   res.render('../public/index');
// });

// searchRouter.route('/search')
//             .post(function(req, res, next) {
//               // Call Yelp API and fetch nightlife options near the users' search location
//               const client = yelp.client("nwgYO5N2mv0IQz9zdF82PP4oXRrRP2WkLi54tn5P3qe552w2nCcsqH4cq-jdS2xVZvCt_1H0gt02VlUt5HGu2vXr_i-Pa7VOrr57os5lkezXBO7QMiTn1_gGYRivWXYx");
//               client.search({
//                 term: req.body.term,
//                 location: req.body.location
//               }).then(response => {
//                 let apiResponseArray = response.jsonBody.businesses;
//                 let clientResponseArray = [];
//                 apiResponseArray.forEach(function(element) {
//                   // Remove cruft from Yelp API call so I can store just what I need in Mongo
//                   let reformedObj = {};
//                   reformedObj._id = element.id;
//                   reformedObj.name = element.name;
//                   reformedObj.image_url = element.image_url;
//                   reformedObj.url = element.url;
//                   reformedObj.location = element.location.address1;

//                   // Once I've created the new object, search to see if it already exists in Mongo
//                   // Businesses.findById(reformedObj._id, function(err, business) {
//                   //   if (err) throw err;
//                   //   // If it does exist, stick that business in the client response array
//                   //   if (business) {
//                   //     clientResponseArray.push(business);
//                   //   } else {
//                   //     // If it does not already exist in Mongo, create it and then stick the business in the client response array
//                   //     reformedObj.votes = 0;
//                   //     reformedObj.searchTerm = req.body.location;
//                   //     Businesses.create(reformedObj, function(err, business) {
//                   //       clientResponseArray.push(business);
//                   //     });
//                   //   }
//                   // });
//                   Businesses.findById(reformedObj._id, function(err, business) {
//                     if (err) throw err;
//                     // If it does not exist, stick that business in the database
//                     if (!business) {
//                       reformedObj.votes = 0;
//                       reformedObj.searchTerm = req.body.location;
//                       Businesses.create(reformedObj, function(err, business) {
//                       });
//                     }
//                   });
//                 }).then(() => {
//                   console.log("Hello")
//                 });
//                   // Businesses.find({searchTerm: req.body.location}, function(err, resp) {
//                   // res.send(resp);
//                   // })
//               }).catch(e => {
//                 console.log("This is the catch");
//               });
//             });

// module.exports = searchRouter;


// This kind of works if you search twice
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const yelp = require('yelp-fusion');
// var clientResponseArray = [];

// Set up Mongoose schema
var Locations = require('../models/location');

var searchRouter = express.Router();
searchRouter.use(bodyParser.json());

searchRouter.get('/', function(req, res, next) {
  res.render('../public/index');
});

searchRouter.route('/search')
            .post(function(req, res, next) {
              // Call Yelp API and fetch nightlife options near the users' search location
              const client = yelp.client("nwgYO5N2mv0IQz9zdF82PP4oXRrRP2WkLi54tn5P3qe552w2nCcsqH4cq-jdS2xVZvCt_1H0gt02VlUt5HGu2vXr_i-Pa7VOrr57os5lkezXBO7QMiTn1_gGYRivWXYx");
              client.search({
                term: req.body.term,
                location: req.body.location
              }).then(response => {
                let apiResponseArray = response.jsonBody.businesses;
                let searchResultsObject = {};
                searchResultsObject.searchCenter = response.jsonBody.region.center.latitude + ", " + response.jsonBody.region.center.longitude;
                let searchArray = [];
                apiResponseArray.forEach(function(element) {
                  // Remove cruft from Yelp API call so I can store just what I need in Mongo
                  let reformedObject = {};
                  reformedObject.name = element.name;
                  reformedObject.id = element.id;
                  reformedObject.image_url = element.image_url;
                  reformedObject.url = element.url;
                  reformedObject.location = element.location.address1;
                  reformedObject.votes = 0;
                  searchArray.push(reformedObject);
                });
                searchResultsObject.results = searchArray;
                // Pass along cleaned up searchArray to next .then() block
                return searchResultsObject;
              }).then(searchResultsObject => {
                // Search to see if this location has been search before. If yes, return the record in the database
                Locations.findOne({searchCenter: searchResultsObject.searchCenter}, function (err, record) {
                  if (err) throw err;
                  if (record) {
                    res.send(record);
                  } else {
                    Locations.create({searchCenter: searchResultsObject.searchCenter, results: searchResultsObject.results}, function(err, addedObject) {
                      res.send(addedObject);
                    });
                  }
                });
              }).catch(e => {
                console.log("This is the catch");
              });
            });

searchRouter.route('/going')
            .put(function(req, res, next) {
              // This is now returning the entire object for the search result.
              // Next step, is to refine the response down to just the individual business
              // in the results array
              Locations.findById(req.body._id, function(err, result) {
                res.send(result);
              });
            });

module.exports = searchRouter;




// Example business object for Mongo testing

// {"searchCenter": "47.545237879164006, -122.03853607177734", "results":[{"_id": "1234", "name": "Hello World", "image_url": "http://www.#.com", "url": "http://www.google.com", "location": "issaquah", "searchTerm": "issaquah, wa" }]}