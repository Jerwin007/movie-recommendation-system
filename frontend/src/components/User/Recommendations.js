// frontend/src/components/User/Recommendations.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Modal, Alert, Spinner } from 'react-bootstrap';
import { recommendationsAPI } from '../../services/api';

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState('');
  const [isPersonalized, setIsPersonalized] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [topGenres, setTopGenres] = useState([]);

  useEffect(() => {
    fetchRecommendations();
    fetchPreferences();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const response = await recommendationsAPI.getRecommendations();
      setRecommendations(response.data.recommendations);
      setReason(response.data.reason);
      setIsPersonalized(response.data.isPersonalized);
      setStats(response.data.stats);
      setTopGenres(response.data.topGenres || []);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPreferences = async () => {
    try {
      const response = await recommendationsAPI.getPreferences();
      setPreferences(response.data);
    } catch (err) {
      console.error('Error fetching preferences:', err);
    }
  };

  const handleShowDetails = async (movie) => {
    setSelectedMovie(movie);
    setShowModal(true);
    
    // Track view
    try {
      await recommendationsAPI.trackView(movie._id);
      fetchPreferences(); // Refresh preferences
    } catch (err) {
      console.error('Error tracking view:', err);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMovie(null);
  };

  const handleLike = async (movieId) => {
    setActionLoading(true);
    try {
      await recommendationsAPI.likeMovie(movieId);
      await fetchPreferences();
      await fetchRecommendations();
      alert('Movie added to your favorites! Your recommendations will be updated.');
    } catch (err) {
      console.error('Error liking movie:', err);
      alert('Failed to like movie');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDislike = async (movieId) => {
    setActionLoading(true);
    try {
      await recommendationsAPI.dislikeMovie(movieId);
      await fetchPreferences();
      await fetchRecommendations();
      alert('We\'ll show you fewer movies like this.');
    } catch (err) {
      console.error('Error disliking movie:', err);
      alert('Failed to dislike movie');
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetPreferences = async () => {
    if (window.confirm('Are you sure you want to reset all your preferences? This cannot be undone.')) {
      try {
        await recommendationsAPI.resetPreferences();
        await fetchPreferences();
        await fetchRecommendations();
        alert('Preferences reset successfully!');
      } catch (err) {
        console.error('Error resetting preferences:', err);
        alert('Failed to reset preferences');
      }
    }
  };

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Finding perfect movies for you...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>🎬 Recommended For You</h2>
          <p className="text-muted">{reason}</p>
        </div>
        {preferences && preferences.viewedCount > 0 && (
          <Button variant="outline-secondary" size="sm" onClick={handleResetPreferences}>
            Reset Preferences
          </Button>
        )}
      </div>

      {/* User Statistics */}
      {preferences && (
        <Row className="mb-4">
          <Col md={12}>
            <Card className="bg-light">
              <Card.Body>
                <h5>📊 Your Viewing Profile</h5>
                <Row className="mt-3">
                  <Col md={3}>
                    <div className="text-center">
                      <h3 className="text-primary mb-1">{preferences.viewedCount}</h3>
                      <small className="text-muted">Movies Viewed</small>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="text-center">
                      <h3 className="text-success mb-1">{preferences.likedCount}</h3>
                      <small className="text-muted">Movies Liked</small>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="text-center">
                      <h3 className="text-danger mb-1">{preferences.dislikedCount}</h3>
                      <small className="text-muted">Movies Disliked</small>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="text-center">
                      <h3 className="text-info mb-1">{topGenres.length}</h3>
                      <small className="text-muted">Favorite Genres</small>
                    </div>
                  </Col>
                </Row>
                
                {topGenres.length > 0 && (
                  <div className="mt-4">
                    <strong>🎭 Your Top Genres:</strong>
                    <div className="mt-2">
                      {topGenres.map((genre, index) => (
                        <Badge 
                          key={index} 
                          bg={index === 0 ? 'primary' : index === 1 ? 'success' : 'secondary'} 
                          className="me-2 mb-2"
                          style={{ fontSize: '0.9rem', padding: '0.5rem 0.8rem' }}
                        >
                          #{index + 1} {genre.genre} ({genre.count} {genre.count === 1 ? 'movie' : 'movies'})
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {stats && stats.genreDistribution && (
                  <div className="mt-3">
                    <small className="text-muted">
                      <strong>Recommendation Weight:</strong> Your preferences are weighted based on viewing frequency
                    </small>
                    <div className="mt-2">
                      {stats.genreDistribution.map((dist, index) => (
                        <div key={index} className="mb-1">
                          <small className="text-muted">
                            {dist.genre}: {(dist.weight * 100).toFixed(0)}%
                          </small>
                          <div className="progress" style={{ height: '5px' }}>
                            <div 
                              className="progress-bar bg-primary" 
                              style={{ width: `${dist.weight * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {!isPersonalized && (
        <Alert variant="info">
          <strong>👋 New here?</strong> Start watching movies to get personalized recommendations!
          Like movies you enjoy to help us learn your taste. The more you interact, the smarter your recommendations become.
        </Alert>
      )}

      {isPersonalized && stats && (
        <Alert variant="success">
          <strong>✨ Personalized Just For You!</strong> These recommendations are based on {stats.totalViewed} movies you've watched 
          and {stats.totalLiked} movies you liked. Keep interacting to improve your recommendations!
        </Alert>
      )}

      {/* Recommendations */}
      {recommendations.length === 0 ? (
        <Alert variant="warning">
          No recommendations available. Try viewing and liking some movies!
        </Alert>
      ) : (
        <Row>
          {recommendations.map((movie) => (
            <Col key={movie._id} md={4} lg={3} className="mb-4">
              <Card className="h-100 shadow-sm" style={{ position: 'relative' }}>
                {movie.recommendationReason && (
                  <Badge 
                    bg="warning" 
                    text="dark" 
                    style={{ 
                      position: 'absolute', 
                      top: '10px', 
                      right: '10px', 
                      zIndex: 1,
                      fontSize: '0.7rem'
                    }}
                  >
                    {movie.recommendationReason}
                  </Badge>
                )}
                <Card.Img 
                  variant="top" 
                  src={movie.posterUrl} 
                  alt={movie.title}
                  style={{ height: '350px', objectFit: 'cover', cursor: 'pointer' }}
                  onClick={() => handleShowDetails(movie)}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title style={{ fontSize: '1rem', minHeight: '2.5rem' }}>
                    {movie.title}
                  </Card.Title>
                  <Card.Text className="text-muted small">
                    <div><strong>Director:</strong> {movie.director}</div>
                    <div><strong>Year:</strong> {movie.releaseYear}</div>
                  </Card.Text>
                  <div className="mb-2">
                    <Badge bg="primary">{movie.genre}</Badge>
                    <Badge bg="warning" text="dark" className="ms-2">
                      ⭐ {movie.rating}/10
                    </Badge>
                  </div>
                  <div className="mt-auto d-flex gap-2">
                    <Button 
                      variant="success" 
                      size="sm" 
                      className="flex-fill"
                      onClick={() => handleLike(movie._id)}
                      disabled={actionLoading}
                    >
                      👍 Like
                    </Button>
                    <Button 
                      variant="danger" 
                      size="sm" 
                      className="flex-fill"
                      onClick={() => handleDislike(movie._id)}
                      disabled={actionLoading}
                    >
                      👎 Pass
                    </Button>
                  </div>
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => handleShowDetails(movie)}
                  >
                    View Details
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Movie Details Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedMovie?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMovie && (
            <Row>
              <Col md={4}>
                <img 
                  src={selectedMovie.posterUrl} 
                  alt={selectedMovie.title}
                  className="img-fluid rounded"
                />
              </Col>
              <Col md={8}>
                <h5>Movie Details</h5>
                <hr />
                <p><strong>Director:</strong> {selectedMovie.director}</p>
                <p><strong>Genre:</strong> {selectedMovie.genre}</p>
                <p><strong>Release Year:</strong> {selectedMovie.releaseYear}</p>
                <p><strong>Duration:</strong> {selectedMovie.duration} minutes</p>
                <p><strong>Language:</strong> {selectedMovie.language}</p>
                <p><strong>Rating:</strong> ⭐ {selectedMovie.rating}/10</p>
                
                {selectedMovie.cast && selectedMovie.cast.length > 0 && (
                  <>
                    <p><strong>Cast:</strong></p>
                    <div className="mb-3">
                      {selectedMovie.cast.map((actor, index) => (
                        <Badge key={index} bg="secondary" className="me-2 mb-2">
                          {actor}
                        </Badge>
                      ))}
                    </div>
                  </>
                )}

                <p><strong>Description:</strong></p>
                <p>{selectedMovie.description}</p>

                <div className="d-flex gap-2 mt-3">
                  <Button 
                    variant="success" 
                    onClick={() => {
                      handleLike(selectedMovie._id);
                      handleCloseModal();
                    }}
                    disabled={actionLoading}
                  >
                    👍 Like This Movie
                  </Button>
                  <Button 
                    variant="danger" 
                    onClick={() => {
                      handleDislike(selectedMovie._id);
                      handleCloseModal();
                    }}
                    disabled={actionLoading}
                  >
                    👎 Not Interested
                  </Button>
                </div>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Recommendations;