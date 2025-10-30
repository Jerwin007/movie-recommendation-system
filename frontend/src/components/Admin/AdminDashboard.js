// frontend/src/components/Admin/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Alert } from 'react-bootstrap';
import { moviesAPI, usersAPI } from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [movieStats, userCount] = await Promise.all([
        moviesAPI.getStats(),
        usersAPI.getUserStats()
      ]);

      setStats(movieStats.data);
      setUserStats(userCount.data);
    } catch (err) {
      setError('Failed to load dashboard statistics');
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="mt-4">
        <div className="text-center">Loading dashboard...</div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Admin Dashboard</h1>
      
      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Total Movies</Card.Title>
              <h2 className="text-primary">{stats?.totalMovies || 0}</h2>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Total Users</Card.Title>
              <h2 className="text-success">{userStats?.totalUsers || 0}</h2>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Admin Users</Card.Title>
              <h2 className="text-warning">{userStats?.adminCount || 0}</h2>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Avg Rating</Card.Title>
              <h2 className="text-info">{stats?.averageRating || 0}/10</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>
              <h5>Movies by Genre</h5>
            </Card.Header>
            <Card.Body>
              {stats?.moviesByGenre && stats.moviesByGenre.length > 0 ? (
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Genre</th>
                      <th>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.moviesByGenre.map((genre, index) => (
                      <tr key={index}>
                        <td>{genre._id}</td>
                        <td>{genre.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p>No movies available</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>
              <h5>Recent Movies</h5>
            </Card.Header>
            <Card.Body>
              {stats?.recentMovies && stats.recentMovies.length > 0 ? (
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Genre</th>
                      <th>Year</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentMovies.map((movie) => (
                      <tr key={movie._id}>
                        <td>{movie.title}</td>
                        <td>{movie.genre}</td>
                        <td>{movie.releaseYear}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p>No recent movies</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card>
        <Card.Body>
          <h5>System Capabilities</h5>
          <ul>
            <li><strong>Movie Management:</strong> Add, view, update, and delete movies</li>
            <li><strong>User Management:</strong> Create, view, update, and remove users</li>
            <li><strong>Role-based Access:</strong> Admin and user roles with different permissions</li>
            <li><strong>Search & Filter:</strong> Search movies by title, director, and filter by genre</li>
            <li><strong>Statistics:</strong> View detailed statistics and analytics</li>
            <li><strong>Password Management:</strong> Users can change their passwords</li>
          </ul>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminDashboard;