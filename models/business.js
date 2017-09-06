
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define poll schema
var businessSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  _id: {
    type: String,
    required: true,
    unique: true
  },
  image_url: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  votes: {
    type: Number,
    required: true
  }}, 
{
  timestamps: true
});

// Create Poll model using poll schema
var Businesses = mongoose.model('Business', businessSchema);

// Make this available outside this module
module.exports = Businesses;