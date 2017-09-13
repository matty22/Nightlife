
// This whole block saves dupes in the database if you search two towns close to 
// one another who share a particular bar.
// Meaning, that bar has two objects and votes would not be shared between the two instances of the same bar
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const yelp = require('yelp-fusion');

// Set up Mongoose schema
var Locations = require('../models/location');

var searchRouter = express.Router();
searchRouter.use(bodyParser.json());

searchRouter.get('/', function(req, res, next) {
  res.render('../public/index');
});

const incrementVote = (id) => {
  Locations.updateMany(
    { 'results.id': id },
    { $inc: { 'results.$.votes': 1 } },
    function (err, raw) {
      if (err) console.log(err);
      console.log('The raw response from Mongo was ', raw);
    });
}

const decrementVote = (id) => {
  Locations.updateMany(
    { 'results.id': id },
    { $inc: { 'results.$.votes': -1 } },
    function (err, raw) {
      if (err) console.log(err);
      console.log('The raw response from Mongo was ', raw);
    });
}



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

// Route for when someone clicks the I'm going button
searchRouter.route('/going')
            .put(function(req, res, next) {
              incrementVote(req.body.resultsId);
            });

module.exports = searchRouter;


