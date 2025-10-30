// backend/models/Movie.js
const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Movie title is required'],
    trim: true
  },
  director: {
    type: String,
    required: [true, 'Director name is required'],
    trim: true
  },
  genre: {
    type: String,
    required: [true, 'Genre is required'],
    enum: ['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Thriller', 'Documentary', 'Animation', 'Fantasy']
  },
  releaseYear: {
    type: Number,
    required: [true, 'Release year is required'],
    min: [1900, 'Release year must be after 1900'],
    max: [new Date().getFullYear() + 2, 'Release year cannot be too far in the future']
  },
  rating: {
    type: Number,
    min: [0, 'Rating must be between 0 and 10'],
    max: [10, 'Rating must be between 0 and 10'],
    default: 0
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  cast: [{
    type: String,
    trim: true
  }],
  duration: {
    type: Number, // in minutes
    required: [true, 'Duration is required']
  },
  language: {
    type: String,
    required: [true, 'Language is required'],
    default: 'English'
  },
  posterUrl: {
    type: String,
    default: 'https://via.placeholder.com/300x450?text=No+Poster'
  },
  available: {
    type: Boolean,
    default: true
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
movieSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Movie', movieSchema);