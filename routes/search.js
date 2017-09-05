var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
const yelp = require('yelp-fusion');

// Set up Mongoose schema -- Do I need a schema for this?
// var Polls = require('../models/polls');

var searchRouter = express.Router();
searchRouter.use(bodyParser.json());

searchRouter.route('/search')
            // Method to create new poll
            .post(function(req, res, next) {
              console.log('you got here');
              // const client = yelp.client("nwgYO5N2mv0IQz9zdF82PP4oXRrRP2WkLi54tn5P3qe552w2nCcsqH4cq-jdS2xVZvCt_1H0gt02VlUt5HGu2vXr_i-Pa7VOrr57os5lkezXBO7QMiTn1_gGYRivWXYx");
              
              // client.search({
              //   term:'Four Barrel Coffee',
              //   location: 'san francisco, ca'
              // }).then(response => {
              //   console.log(response.jsonBody.businesses[0].name);
              // }).catch(e => {
              //   console.log(e);
              // });
            });

module.exports = searchRouter;
