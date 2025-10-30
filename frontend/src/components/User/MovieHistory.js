// frontend/src/components/User/MovieHistory.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Tabs, Tab, Button, Modal, ProgressBar, Alert } from 'react-bootstrap';
import { recommendationsAPI } from '../../services/api';

const MovieHistory = () => {
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('liked');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [genreAnalysis, setGenreAnalysis] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await recommendationsAPI.getPreferences();
      setPreferences(response.data);
      calculateGenreAnalysis(response.data);
    } catch (err) {
      console.error('Error fetching history:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateGenreAnalysis = (data) => {
    if (!data.favoriteGenres || data.favoriteGenres.length === 0) {
      setGenreAnalysis([]);
      return;
    }

    const totalInteractions = data.favoriteGenres.reduce((sum, g) => sum + g.count, 0);
    
    const analysis = data.favoriteGenres.map(genre => {
      const percentage = (genre.count / totalInteractions) * 100;
      const likedInGenre = data.likedMovies.filter(m => m.genre === genre.genre).length;
      const viewedInGenre = data.viewedMovies.filter(v => v.movie.genre === genre.genre).length;
      
      let sentiment = 'Neutral';
      let sentimentColor = 'secondary';
      
      if (likedInGenre > viewedInGenre * 0.7) {
        sentiment = 'Love';
        sentimentColor = 'success';
      } else if (likedInGenre > viewedInGenre * 0.4) {
        sentiment = 'Like';
        sentimentColor = 'primary';
      } else if (likedInGenre > 0) {
        sentiment = 'Mixed';
        sentimentColor = 'warning';
      }

      return {
        genre: genre.genre,
        count: genre.count,
        percentage: percentage.toFixed(1),
        liked: likedInGenre,
        viewed: viewedInGenre,
        sentiment,
        sentimentColor,
        engagement: viewedInGenre
      };
    });

    analysis.sort((a, b) => b.count - a.count);
    setGenreAnalysis(analysis);
  };

  const handleShowDetails = (movie) => {
    setSelectedMovie(movie);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMovie(null);
  };

  const handleRemoveFromLiked = async (movieId) => {
    if (window.confirm('Remove this movie from your liked list?')) {
      try {
        await recommendationsAPI.dislikeMovie(movieId);
        fetchHistory();
        alert('Movie removed from liked list');
      } catch (err) {
        console.error('Error removing movie:', err);
      }
    }
  };

  const handleRemoveFromDisliked = async (movieId) => {
    if (window.confirm('Remove this movie from your disliked list?')) {
      try {
        await recommendationsAPI.likeMovie(movieId);
        await recommendationsAPI.dislikeMovie(movieId); // This removes it from both
        fetchHistory();
        alert('Movie removed from disliked list');
      } catch (err) {
        console.error('Error removing movie:', err);
      }
    }
  };

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  if (!preferences || preferences.viewedCount === 0) {
    return (
      <Container className="mt-4">
        <h2>📊 My Movie History & Analysis</h2>
        <Alert variant="info" className="mt-4">
          <h5>No viewing history yet!</h5>
          <p>Start watching movies to build your profile and see detailed analytics here.</p>
          <ul>
            <li>View movie details to track viewing history</li>
            <li>Like movies to see them in your favorites</li>
            <li>Dislike movies to filter them from recommendations</li>
          </ul>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">📊 My Movie History & Analysis</h2>

      {/* Summary Statistics */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <h1 className="text-primary mb-2">{preferences.viewedCount}</h1>
              <Card.Text className="text-muted">Movies Watched</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <h1 className="text-success mb-2">{preferences.likedCount}</h1>
              <Card.Text className="text-muted">Movies Liked</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <h1 className="text-danger mb-2">{preferences.dislikedCount}</h1>
              <Card.Text className="text-muted">Movies Disliked</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <h1 className="text-info mb-2">{genreAnalysis.length}</h1>
              <Card.Text className="text-muted">Genres Explored</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Genre Analysis */}
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">🎭 Genre Analysis & Preferences</h5>
        </Card.Header>
        <Card.Body>
          {genreAnalysis.length > 0 ? (
            <>
              <Table hover responsive>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Genre</th>
                    <th>Interactions</th>
                    <th>Distribution</th>
                    <th>Liked</th>
                    <th>Viewed</th>
                    <th>Sentiment</th>
                  </tr>
                </thead>
                <tbody>
                  {genreAnalysis.map((genre, index) => (
                    <tr key={index}>
                      <td>
                        <Badge bg={index === 0 ? 'warning' : index === 1 ? 'secondary' : 'light'} text={index < 2 ? 'dark' : 'dark'}>
                          #{index + 1}
                        </Badge>
                      </td>
                      <td><strong>{genre.genre}</strong></td>
                      <td>{genre.count} times</td>
                      <td style={{ width: '200px' }}>
                        <ProgressBar 
                          now={genre.percentage} 
                          label={`${genre.percentage}%`}
                          variant="primary"
                        />
                      </td>
                      <td>
                        <Badge bg="success">{genre.liked}</Badge>
                      </td>
                      <td>
                        <Badge bg="info">{genre.viewed}</Badge>
                      </td>
                      <td>
                        <Badge bg={genre.sentimentColor}>{genre.sentiment}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <div className="mt-4">
                <h6>📈 Insights:</h6>
                <ul className="mb-0">
                  <li><strong>Most Loved Genre:</strong> {genreAnalysis[0].genre} ({genreAnalysis[0].liked} liked out of {genreAnalysis[0].viewed} viewed)</li>
                  {genreAnalysis.length > 1 && (
                    <li><strong>Second Favorite:</strong> {genreAnalysis[1].genre} ({genreAnalysis[1].percentage}% of your viewing)</li>
                  )}
                  <li><strong>Total Engagement:</strong> {preferences.viewedCount} movies across {genreAnalysis.length} genres</li>
                  <li><strong>Like Rate:</strong> {preferences.viewedCount > 0 ? ((preferences.likedCount / preferences.viewedCount) * 100).toFixed(1) : 0}% of movies watched</li>
                </ul>
              </div>
            </>
          ) : (
            <p className="text-muted">No genre data available yet. Start watching movies!</p>
          )}
        </Card.Body>
      </Card>

      {/* Movie Lists Tabs */}
      <Card>
        <Card.Header>
          <h5 className="mb-0">🎬 My Movie Collections</h5>
        </Card.Header>
        <Card.Body>
          <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
            {/* Liked Movies Tab */}
            <Tab eventKey="liked" title={`❤️ Liked (${preferences.likedCount})`}>
              {preferences.likedMovies && preferences.likedMovies.length > 0 ? (
                <Row>
                  {preferences.likedMovies.map((movie) => (
                    <Col key={movie._id} md={3} className="mb-3">
                      <Card className="h-100">
                        <Card.Img 
                          variant="top" 
                          src={movie.posterUrl} 
                          style={{ height: '250px', objectFit: 'cover', cursor: 'pointer' }}
                          onClick={() => handleShowDetails(movie)}
                        />
                        <Card.Body>
                          <Card.Title style={{ fontSize: '0.95rem' }}>{movie.title}</Card.Title>
                          <Badge bg="primary" className="me-2">{movie.genre}</Badge>
                          <Badge bg="warning" text="dark">⭐ {movie.rating}</Badge>
                          <div className="mt-2">
                            <Button 
                              variant="outline-danger" 
                              size="sm" 
                              className="w-100"
                              onClick={() => handleRemoveFromLiked(movie._id)}
                            >
                              Remove
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <Alert variant="info">No liked movies yet. Like movies to see them here!</Alert>
              )}
            </Tab>

            {/* Disliked Movies Tab */}
            <Tab eventKey="disliked" title={`👎 Disliked (${preferences.dislikedCount})`}>
              {preferences.dislikedMovies && preferences.dislikedMovies.length > 0 ? (
                <Row>
                  {preferences.dislikedMovies.map((movie) => (
                    <Col key={movie._id} md={3} className="mb-3">
                      <Card className="h-100">
                        <Card.Img 
                          variant="top" 
                          src={movie.posterUrl} 
                          style={{ height: '250px', objectFit: 'cover', cursor: 'pointer' }}
                          onClick={() => handleShowDetails(movie)}
                        />
                        <Card.Body>
                          <Card.Title style={{ fontSize: '0.95rem' }}>{movie.title}</Card.Title>
                          <Badge bg="primary" className="me-2">{movie.genre}</Badge>
                          <Badge bg="warning" text="dark">⭐ {movie.rating}</Badge>
                          <div className="mt-2">
                            <Button 
                              variant="outline-success" 
                              size="sm" 
                              className="w-100"
                              onClick={() => handleRemoveFromDisliked(movie._id)}
                            >
                              Remove
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <Alert variant="info">No disliked movies. Movies you dislike will appear here.</Alert>
              )}
            </Tab>

            {/* Viewing History Tab */}
            <Tab eventKey="viewed" title={`👁️ Recently Viewed (${preferences.viewedCount})`}>
              {preferences.viewedMovies && preferences.viewedMovies.length > 0 ? (
                <Table striped hover responsive>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Movie</th>
                      <th>Genre</th>
                      <th>Rating</th>
                      <th>Viewed On</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preferences.viewedMovies.slice().reverse().map((view, index) => (
                      <tr key={index}>
                        <td>{preferences.viewedMovies.length - index}</td>
                        <td>
                          <strong 
                            style={{ cursor: 'pointer', color: '#0d6efd' }}
                            onClick={() => handleShowDetails(view.movie)}
                          >
                            {view.movie.title}
                          </strong>
                        </td>
                        <td><Badge bg="primary">{view.movie.genre}</Badge></td>
                        <td>⭐ {view.movie.rating}/10</td>
                        <td>{new Date(view.viewedAt).toLocaleDateString()}</td>
                        <td>
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => handleShowDetails(view.movie)}
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <Alert variant="info">No viewing history yet. Watch movies to see your history here!</Alert>
              )}
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>

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

export default MovieHistory;