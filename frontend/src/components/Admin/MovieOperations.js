// frontend/src/components/Admin/MovieOperations.js
import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Alert, Badge } from 'react-bootstrap';
import { moviesAPI } from '../../services/api';

const MovieOperations = () => {
  const [movies, setMovies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentMovie, setCurrentMovie] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    director: '',
    genre: 'Action',
    releaseYear: new Date().getFullYear(),
    rating: 0,
    description: '',
    cast: '',
    duration: '',
    language: 'English',
    posterUrl: '',
    available: true
  });

  const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Thriller', 'Documentary', 'Animation', 'Fantasy'];

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await moviesAPI.getAllMovies();
      setMovies(response.data);
    } catch (err) {
      setError('Failed to fetch movies');
      console.error('Error:', err);
    }
  };

  const handleShowModal = (movie = null) => {
    if (movie) {
      setEditMode(true);
      setCurrentMovie(movie);
      setFormData({
        title: movie.title,
        director: movie.director,
        genre: movie.genre,
        releaseYear: movie.releaseYear,
        rating: movie.rating,
        description: movie.description,
        cast: movie.cast?.join(', ') || '',
        duration: movie.duration,
        language: movie.language,
        posterUrl: movie.posterUrl,
        available: movie.available
      });
    } else {
      setEditMode(false);
      setCurrentMovie(null);
      setFormData({
        title: '',
        director: '',
        genre: 'Action',
        releaseYear: new Date().getFullYear(),
        rating: 0,
        description: '',
        cast: '',
        duration: '',
        language: 'English',
        posterUrl: '',
        available: true
      });
    }
    setShowModal(true);
    setError('');
    setSuccess('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setError('');
    setSuccess('');
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const movieData = {
        ...formData,
        cast: formData.cast.split(',').map(actor => actor.trim()).filter(actor => actor)
      };

      if (editMode) {
        await moviesAPI.updateMovie(currentMovie._id, movieData);
        setSuccess('Movie updated successfully!');
      } else {
        await moviesAPI.createMovie(movieData);
        setSuccess('Movie added successfully!');
      }

      fetchMovies();
      setTimeout(() => {
        handleCloseModal();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await moviesAPI.deleteMovie(id);
        setSuccess('Movie deleted successfully!');
        fetchMovies();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to delete movie');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Movie Operations</h2>
        <Button variant="primary" onClick={() => handleShowModal()}>
          Add New Movie
        </Button>
      </div>

      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Director</th>
            <th>Genre</th>
            <th>Year</th>
            <th>Rating</th>
            <th>Duration</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {movies.length > 0 ? (
            movies.map((movie) => (
              <tr key={movie._id}>
                <td>{movie.title}</td>
                <td>{movie.director}</td>
                <td>{movie.genre}</td>
                <td>{movie.releaseYear}</td>
                <td>{movie.rating}/10</td>
                <td>{movie.duration} min</td>
                <td>
                  <Badge bg={movie.available ? 'success' : 'secondary'}>
                    {movie.available ? 'Available' : 'Unavailable'}
                  </Badge>
                </td>
                <td>
                  <Button 
                    variant="warning" 
                    size="sm" 
                    className="me-2"
                    onClick={() => handleShowModal(movie)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => handleDelete(movie._id, movie.title)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">No movies found</td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Edit Movie' : 'Add New Movie'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title *</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Director *</Form.Label>
              <Form.Control
                type="text"
                name="director"
                value={formData.director}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Genre *</Form.Label>
                  <Form.Select
                    name="genre"
                    value={formData.genre}
                    onChange={handleChange}
                    required
                  >
                    {genres.map(genre => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
              
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Release Year *</Form.Label>
                  <Form.Control
                    type="number"
                    name="releaseYear"
                    value={formData.releaseYear}
                    onChange={handleChange}
                    min="1900"
                    max={new Date().getFullYear() + 2}
                    required
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-4">
                <Form.Group className="mb-3">
                  <Form.Label>Rating (0-10)</Form.Label>
                  <Form.Control
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    min="0"
                    max="10"
                    step="0.1"
                  />
                </Form.Group>
              </div>
              
              <div className="col-md-4">
                <Form.Group className="mb-3">
                  <Form.Label>Duration (min) *</Form.Label>
                  <Form.Control
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </div>
              
              <div className="col-md-4">
                <Form.Group className="mb-3">
                  <Form.Label>Language *</Form.Label>
                  <Form.Control
                    type="text"
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Cast (comma separated)</Form.Label>
              <Form.Control
                type="text"
                name="cast"
                value={formData.cast}
                onChange={handleChange}
                placeholder="Actor 1, Actor 2, Actor 3"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Poster URL</Form.Label>
              <Form.Control
                type="text"
                name="posterUrl"
                value={formData.posterUrl}
                onChange={handleChange}
                placeholder="https://example.com/poster.jpg"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                name="available"
                label="Available"
                checked={formData.available}
                onChange={handleChange}
              />
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={handleCloseModal} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Saving...' : editMode ? 'Update Movie' : 'Add Movie'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default MovieOperations;