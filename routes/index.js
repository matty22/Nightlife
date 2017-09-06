// This kind of works if you search twice
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const yelp = require('yelp-fusion');
var clientResponseArray = [];

// Set up Mongoose schema
var Businesses = require('../models/business');

var searchRouter = express.Router();
searchRouter.use(bodyParser.json());

searchRouter.get('/', function(req, res, next) {
  res.render('../public/index');
});

searchRouter.route('/search')
            // Method to create new poll
            .post(function(req, res, next) {
              // Call Yelp API and fetch nightlife options near the users' search location
              const client = yelp.client("nwgYO5N2mv0IQz9zdF82PP4oXRrRP2WkLi54tn5P3qe552w2nCcsqH4cq-jdS2xVZvCt_1H0gt02VlUt5HGu2vXr_i-Pa7VOrr57os5lkezXBO7QMiTn1_gGYRivWXYx");
              client.search({
                term: req.body.term,
                location: req.body.location
              }).then(response => {
                let apiResponseArray = response.jsonBody.businesses;
                apiResponseArray.forEach(function(element) {
                  // Remove cruft from Yelp API call so I can store just what I need in Mongo
                  let reformedObj = {};
                  reformedObj._id = element.id;
                  reformedObj.name = element.name;
                  reformedObj.image_url = element.image_url;
                  reformedObj.url = element.url;
                  reformedObj.location = element.location.address1;

                  // Once I've created the new object, search to see if it already exists in Mongo
                  Businesses.findById(reformedObj._id, function(err, business) {
                    if (err) throw err;
                    // If it does exist, stick that business in the client response array
                    if (business) {
                      clientResponseArray.push(business);
                    } else {
                      // If it does not already exist in Mongo, create it and then stick the business in the client response array
                      reformedObj.votes = 0;
                      Businesses.create(reformedObj, function(err, business) {
                        clientResponseArray.push(business);
                      });
                    }
                  });
                });
                res.json(clientResponseArray);
              }).catch(e => {
                console.log("This is the catch");
              });
            });

module.exports = searchRouter;