// backend/routes/movies.js
const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const { protect, admin } = require('../middleware/auth');

// @route   GET /api/movies
// @desc    Get all movies
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { search, genre } = req.query;
    let query = {};

    // Search by title or director
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { director: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by genre
    if (genre && genre !== 'All') {
      query.genre = genre;
    }

    const movies = await Movie.find(query)
      .populate('addedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(movies);
  } catch (error) {
    console.error('Get movies error:', error);
    res.status(500).json({ message: 'Error fetching movies', error: error.message });
  }
});

// @route   GET /api/movies/:id
// @desc    Get single movie
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id).populate('addedBy', 'name email');

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.json(movie);
  } catch (error) {
    console.error('Get movie error:', error);
    res.status(500).json({ message: 'Error fetching movie', error: error.message });
  }
});

// @route   POST /api/movies
// @desc    Create new movie
// @access  Private (Admin only)
router.post('/', protect, admin, async (req, res) => {
  try {
    const movieData = {
      ...req.body,
      addedBy: req.user._id
    };

    const movie = await Movie.create(movieData);

    res.status(201).json(movie);
  } catch (error) {
    console.error('Create movie error:', error);
    res.status(500).json({ message: 'Error creating movie', error: error.message });
  }
});

// @route   PUT /api/movies/:id
// @desc    Update movie
// @access  Private (Admin only)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedMovie);
  } catch (error) {
    console.error('Update movie error:', error);
    res.status(500).json({ message: 'Error updating movie', error: error.message });
  }
});

// @route   DELETE /api/movies/:id
// @desc    Delete movie
// @access  Private (Admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    await Movie.findByIdAndDelete(req.params.id);

    res.json({ message: 'Movie removed successfully' });
  } catch (error) {
    console.error('Delete movie error:', error);
    res.status(500).json({ message: 'Error deleting movie', error: error.message });
  }
});

// @route   GET /api/movies/stats/dashboard
// @desc    Get dashboard statistics
// @access  Private (Admin only)
router.get('/stats/dashboard', protect, admin, async (req, res) => {
  try {
    const totalMovies = await Movie.countDocuments();
    const moviesByGenre = await Movie.aggregate([
      { $group: { _id: '$genre', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    const recentMovies = await Movie.find().sort({ createdAt: -1 }).limit(5);
    const averageRating = await Movie.aggregate([
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);

    res.json({
      totalMovies,
      moviesByGenre,
      recentMovies,
      averageRating: averageRating[0]?.avgRating.toFixed(1) || 0
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Error fetching statistics', error: error.message });
  }
});

module.exports = router;