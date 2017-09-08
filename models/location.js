
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define business sub-schema
var businessSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  id: {
    type: String
  },
  image_url: {
    type: String
  },
  url: {
    type: String,
  },
  location: {
    type: String
  },
  votes: {
    type: Number,
    required: true
  }}, 
{
  timestamps: true
});

// Define location schema
var locationSchema = new Schema({
  searchCenter: {
    type: String,
    required: true
  },
  results: [businessSchema]},
  {
    timestamps: true
  });

// Create Poll model using poll schema
var Locations = mongoose.model('Location', locationSchema);

// Make this available outside this module
module.exports = Locations;