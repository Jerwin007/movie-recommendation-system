// backend/routes/recommendations.js
const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const UserPreference = require('../models/UserPreference');
const { protect } = require('../middleware/auth');

// @route   POST /api/recommendations/track-view
// @desc    Track when user views a movie
// @access  Private
router.post('/track-view', protect, async (req, res) => {
  try {
    const { movieId } = req.body;
    
    // Get the movie to track genre
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Find or create user preferences
    let preferences = await UserPreference.findOne({ user: req.user._id });
    
    if (!preferences) {
      preferences = new UserPreference({
        user: req.user._id,
        favoriteGenres: [{ genre: movie.genre, count: 1 }],
        viewedMovies: [{ movie: movieId }]
      });
    } else {
      // Update viewed movies
      const alreadyViewed = preferences.viewedMovies.find(
        v => v.movie.toString() === movieId
      );
      
      if (!alreadyViewed) {
        preferences.viewedMovies.push({ movie: movieId });
        
        // Update genre preference
        const genreIndex = preferences.favoriteGenres.findIndex(
          g => g.genre === movie.genre
        );
        
        if (genreIndex >= 0) {
          preferences.favoriteGenres[genreIndex].count += 1;
        } else {
          preferences.favoriteGenres.push({ genre: movie.genre, count: 1 });
        }
      }
    }

    await preferences.save();
    res.json({ message: 'View tracked successfully' });
  } catch (error) {
    console.error('Track view error:', error);
    res.status(500).json({ message: 'Error tracking view', error: error.message });
  }
});

// @route   POST /api/recommendations/like
// @desc    Like a movie
// @access  Private
router.post('/like', protect, async (req, res) => {
  try {
    const { movieId } = req.body;
    
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    let preferences = await UserPreference.findOne({ user: req.user._id });
    
    if (!preferences) {
      preferences = new UserPreference({
        user: req.user._id,
        likedMovies: [movieId],
        favoriteGenres: [{ genre: movie.genre, count: 2 }]
      });
    } else {
      // Remove from disliked if present
      preferences.dislikedMovies = preferences.dislikedMovies.filter(
        id => id.toString() !== movieId
      );
      
      // Add to liked if not already there
      if (!preferences.likedMovies.includes(movieId)) {
        preferences.likedMovies.push(movieId);
        
        // Boost genre preference for liked movies
        const genreIndex = preferences.favoriteGenres.findIndex(
          g => g.genre === movie.genre
        );
        
        if (genreIndex >= 0) {
          preferences.favoriteGenres[genreIndex].count += 2;
        } else {
          preferences.favoriteGenres.push({ genre: movie.genre, count: 2 });
        }
      }
    }

    await preferences.save();
    res.json({ message: 'Movie liked successfully', preferences });
  } catch (error) {
    console.error('Like movie error:', error);
    res.status(500).json({ message: 'Error liking movie', error: error.message });
  }
});

// @route   POST /api/recommendations/dislike
// @desc    Dislike a movie
// @access  Private
router.post('/dislike', protect, async (req, res) => {
  try {
    const { movieId } = req.body;
    
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    let preferences = await UserPreference.findOne({ user: req.user._id });
    
    if (!preferences) {
      preferences = new UserPreference({
        user: req.user._id,
        dislikedMovies: [movieId]
      });
    } else {
      // Remove from liked if present
      preferences.likedMovies = preferences.likedMovies.filter(
        id => id.toString() !== movieId
      );
      
      // Add to disliked if not already there
      if (!preferences.dislikedMovies.includes(movieId)) {
        preferences.dislikedMovies.push(movieId);
      }
    }

    await preferences.save();
    res.json({ message: 'Movie disliked successfully', preferences });
  } catch (error) {
    console.error('Dislike movie error:', error);
    res.status(500).json({ message: 'Error disliking movie', error: error.message });
  }
});

// @route   GET /api/recommendations
// @desc    Get personalized movie recommendations
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const preferences = await UserPreference.findOne({ user: req.user._id })
      .populate('viewedMovies.movie')
      .populate('likedMovies')
      .populate('dislikedMovies');

    let recommendations = [];
    let recommendationDetails = [];

    if (!preferences || preferences.favoriteGenres.length === 0) {
      // New user - recommend top-rated movies
      recommendations = await Movie.find({ available: true })
        .sort({ rating: -1 })
        .limit(12);
      
      return res.json({
        recommendations,
        recommendationDetails: recommendations.map(m => ({
          movieId: m._id,
          reason: 'Highly rated',
          score: m.rating
        })),
        reason: 'Top rated movies - Start watching to get personalized recommendations!',
        isPersonalized: false,
        topGenres: [],
        stats: {
          totalViewed: 0,
          totalLiked: 0,
          totalDisliked: 0
        }
      });
    }

    // Sort genres by preference count (weighted)
    const sortedGenres = preferences.favoriteGenres
      .sort((a, b) => b.count - a.count);

    // Calculate weights for each genre
    const totalCount = sortedGenres.reduce((sum, g) => sum + g.count, 0);
    const genreWeights = sortedGenres.map(g => ({
      genre: g.genre,
      weight: g.count / totalCount,
      count: g.count
    }));

    // Get movies from favorite genres
    const viewedMovieIds = preferences.viewedMovies.map(v => v.movie._id || v.movie);
    const likedMovieIds = preferences.likedMovies;
    const dislikedMovieIds = preferences.dislikedMovies;

    // Priority 1: Highly rated movies from most favorite genres
    for (let i = 0; i < Math.min(3, sortedGenres.length); i++) {
      const genrePref = sortedGenres[i];
      const genreMovies = await Movie.find({
        genre: genrePref.genre,
        available: true,
        rating: { $gte: 7.5 }, // Focus on highly rated
        _id: { 
          $nin: [...viewedMovieIds, ...dislikedMovieIds] 
        }
      })
      .sort({ rating: -1 })
      .limit(4);

      genreMovies.forEach(movie => {
        recommendationDetails.push({
          movieId: movie._id,
          reason: `You love ${genrePref.genre} movies`,
          score: movie.rating * (1 + genrePref.count * 0.1),
          genreMatch: true
        });
      });

      recommendations.push(...genreMovies);
    }

    // Priority 2: Similar to liked movies (same genre)
    if (likedMovieIds.length > 0) {
      const likedMovies = await Movie.find({ _id: { $in: likedMovieIds } });
      const likedGenres = [...new Set(likedMovies.map(m => m.genre))];
      
      for (const genre of likedGenres) {
        const similarMovies = await Movie.find({
          genre: genre,
          available: true,
          _id: { 
            $nin: [
              ...viewedMovieIds, 
              ...dislikedMovieIds,
              ...likedMovieIds,
              ...recommendations.map(m => m._id)
            ] 
          }
        })
        .sort({ rating: -1 })
        .limit(2);

        similarMovies.forEach(movie => {
          recommendationDetails.push({
            movieId: movie._id,
            reason: `Similar to movies you liked`,
            score: movie.rating * 1.2,
            similarToLiked: true
          });
        });

        recommendations.push(...similarMovies);
      }
    }

    // Priority 3: Explore new genres (if user has strong preferences)
    if (sortedGenres.length >= 2 && recommendations.length < 10) {
      const exploredGenres = sortedGenres.map(g => g.genre);
      const allGenres = ['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Thriller', 'Documentary', 'Animation', 'Fantasy'];
      const newGenres = allGenres.filter(g => !exploredGenres.includes(g));
      
      if (newGenres.length > 0) {
        const exploreMovies = await Movie.find({
          genre: { $in: newGenres },
          available: true,
          rating: { $gte: 8.0 }, // Only highly rated for exploration
          _id: { 
            $nin: [
              ...viewedMovieIds, 
              ...dislikedMovieIds,
              ...recommendations.map(m => m._id)
            ] 
          }
        })
        .sort({ rating: -1 })
        .limit(2);

        exploreMovies.forEach(movie => {
          recommendationDetails.push({
            movieId: movie._id,
            reason: `Explore ${movie.genre}`,
            score: movie.rating,
            exploration: true
          });
        });

        recommendations.push(...exploreMovies);
      }
    }

    // Priority 4: Fill remaining slots with high-rated unwatched movies
    if (recommendations.length < 12) {
      const fillerMovies = await Movie.find({
        available: true,
        rating: { $gte: 7.0 },
        _id: { 
          $nin: [
            ...viewedMovieIds, 
            ...dislikedMovieIds,
            ...recommendations.map(m => m._id)
          ] 
        }
      })
      .sort({ rating: -1 })
      .limit(12 - recommendations.length);

      fillerMovies.forEach(movie => {
        recommendationDetails.push({
          movieId: movie._id,
          reason: 'Popular pick',
          score: movie.rating,
          popular: true
        });
      });

      recommendations.push(...fillerMovies);
    }

    // Remove duplicates and sort by recommendation score
    const uniqueRecommendations = recommendations.filter((movie, index, self) =>
      index === self.findIndex(m => m._id.toString() === movie._id.toString())
    );

    // Sort by score from recommendationDetails
    const scoredRecommendations = uniqueRecommendations.map(movie => {
      const detail = recommendationDetails.find(d => d.movieId.toString() === movie._id.toString());
      return {
        movie,
        score: detail ? detail.score : movie.rating,
        reason: detail ? detail.reason : 'Recommended'
      };
    });

    scoredRecommendations.sort((a, b) => b.score - a.score);

    const finalRecommendations = scoredRecommendations.slice(0, 12).map(r => ({
      ...r.movie.toObject(),
      recommendationReason: r.reason
    }));

    // Build detailed reason
    const topGenres = sortedGenres.slice(0, 3);
    let detailedReason = '';
    
    if (likedMovieIds.length > 0) {
      detailedReason = `Based on ${likedMovieIds.length} movies you liked and your love for ${topGenres.map(g => g.genre).join(', ')}`;
    } else if (topGenres.length > 0) {
      detailedReason = `Based on your viewing history in ${topGenres.map(g => g.genre).join(', ')}`;
    } else {
      detailedReason = 'Personalized picks just for you';
    }

    res.json({
      recommendations: finalRecommendations,
      recommendationDetails: scoredRecommendations.slice(0, 12).map(r => ({
        movieId: r.movie._id,
        reason: r.reason,
        score: r.score.toFixed(2)
      })),
      reason: detailedReason,
      isPersonalized: true,
      topGenres: topGenres.slice(0, 5),
      stats: {
        totalViewed: preferences.viewedMovies.length,
        totalLiked: preferences.likedMovies.length,
        totalDisliked: preferences.dislikedMovies.length,
        genreDistribution: genreWeights.slice(0, 5)
      }
    });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({ message: 'Error getting recommendations', error: error.message });
  }
});

// @route   GET /api/recommendations/preferences
// @desc    Get user preferences
// @access  Private
router.get('/preferences', protect, async (req, res) => {
  try {
    const preferences = await UserPreference.findOne({ user: req.user._id })
      .populate('viewedMovies.movie')
      .populate('likedMovies')
      .populate('dislikedMovies');

    if (!preferences) {
      return res.json({
        favoriteGenres: [],
        viewedCount: 0,
        likedCount: 0,
        dislikedCount: 0
      });
    }

    res.json({
      favoriteGenres: preferences.favoriteGenres.sort((a, b) => b.count - a.count),
      viewedCount: preferences.viewedMovies.length,
      likedCount: preferences.likedMovies.length,
      dislikedCount: preferences.dislikedMovies.length,
      viewedMovies: preferences.viewedMovies,
      likedMovies: preferences.likedMovies,
      dislikedMovies: preferences.dislikedMovies
    });
  } catch (error) {
    console.error('Get preferences error:', error);
    res.status(500).json({ message: 'Error getting preferences', error: error.message });
  }
});

// @route   DELETE /api/recommendations/reset
// @desc    Reset user preferences
// @access  Private
router.delete('/reset', protect, async (req, res) => {
  try {
    await UserPreference.findOneAndDelete({ user: req.user._id });
    res.json({ message: 'Preferences reset successfully' });
  } catch (error) {
    console.error('Reset preferences error:', error);
    res.status(500).json({ message: 'Error resetting preferences', error: error.message });
  }
});

module.exports = router;