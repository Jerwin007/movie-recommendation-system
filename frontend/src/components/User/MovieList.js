// frontend/src/components/User/MovieList.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, InputGroup, Badge, Button, Modal } from 'react-bootstrap';
import { moviesAPI } from '../../services/api';

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('All');
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const genres = ['All', 'Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Thriller', 'Documentary', 'Animation', 'Fantasy'];

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    filterMovies();
  }, [search, genre, movies]);

  const fetchMovies = async () => {
    try {
      const response = await moviesAPI.getAllMovies();
      setMovies(response.data);
      setFilteredMovies(response.data);
    } catch (err) {
      console.error('Error fetching movies:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterMovies = () => {
    let filtered = [...movies];

    if (search) {
      filtered = filtered.filter(movie => 
        movie.title.toLowerCase().includes(search.toLowerCase()) ||
        movie.director.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (genre !== 'All') {
      filtered = filtered.filter(movie => movie.genre === genre);
    }

    setFilteredMovies(filtered);
  };

  const handleShowDetails = (movie) => {
    setSelectedMovie(movie);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMovie(null);
  };

  if (loading) {
    return (
      <Container className="mt-4">
        <div className="text-center">Loading movies...</div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Browse Movies</h2>

      <Row className="mb-4">
        <Col md={8}>
          <InputGroup>
            <InputGroup.Text>🔍</InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search by title or director..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={4}>
          <Form.Select value={genre} onChange={(e) => setGenre(e.target.value)}>
            {genres.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {filteredMovies.length === 0 ? (
        <div className="text-center mt-5">
          <h4>No movies found</h4>
          <p>Try adjusting your search or filters</p>
        </div>
      ) : (
        <Row>
          {filteredMovies.map((movie) => (
            <Col key={movie._id} md={4} lg={3} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Img 
                  variant="top" 
                  src={movie.posterUrl} 
                  alt={movie.title}
                  style={{ height: '350px', objectFit: 'cover' }}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{movie.title}</Card.Title>
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
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    className="mt-auto"
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

                <Badge bg={selectedMovie.available ? 'success' : 'secondary'}>
                  {selectedMovie.available ? 'Available' : 'Unavailable'}
                </Badge>
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

export default MovieList;