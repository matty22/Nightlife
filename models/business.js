
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define business sub-schema
var businessSchema = new Schema({
  _id: {
    type: String
  },
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


// Create Business model using poll schema
var Businesses = mongoose.model('Business', businessSchema);

// Make this available outside this module
module.exports = Businesses;