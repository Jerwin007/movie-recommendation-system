// backend/models/UserPreference.js
const mongoose = require('mongoose');

const userPreferenceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  favoriteGenres: [{
    genre: {
      type: String,
      required: true
    },
    count: {
      type: Number,
      default: 1
    }
  }],
  viewedMovies: [{
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie'
    },
    viewedAt: {
      type: Date,
      default: Date.now
    }
  }],
  likedMovies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie'
  }],
  dislikedMovies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie'
  }],
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
userPreferenceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('UserPreference', userPreferenceSchema);