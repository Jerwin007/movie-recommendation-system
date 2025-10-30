// frontend/src/components/User/UserDashboard.js
import React from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const UserDashboard = () => {
  const { user } = useAuth();

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Welcome, {user?.name}!</h1>
      
      <Row>
        <Col md={12}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>About Movie Recommendation System</Card.Title>
              <Card.Text>
                Welcome to the Movie Recommendation System! This platform allows you to explore 
                a vast collection of movies, search by title or director, filter by genre, 
                and discover new films to watch.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card className="mb-4 h-100">
            <Card.Body>
              <Card.Title>🎯 Personalized Recommendations</Card.Title>
              <Card.Text>
                Get movie recommendations tailored to your taste! Our system learns from 
                the movies you watch and like to suggest films you'll love. The more you 
                interact, the better your recommendations become.
              </Card.Text>
              <Link to="/user/recommendations" className="btn btn-primary">
                View Recommendations
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="mb-4 h-100">
            <Card.Body>
              <Card.Title>🎬 Browse Movies</Card.Title>
              <Card.Text>
                Explore our complete movie collection. Search for movies by title or director, 
                filter by genre, and view detailed information about each movie including cast, 
                rating, and description.
              </Card.Text>
              <Link to="/user/movies" className="btn btn-primary">
                View All Movies
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card className="mb-4 h-100">
            <Card.Body>
              <Card.Title>📊 Track Your Preferences</Card.Title>
              <Card.Text>
                Like movies you enjoy and pass on ones you don't. Our recommendation engine 
                tracks your favorite genres and viewing history to continuously improve your 
                personalized suggestions.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="mb-4 h-100">
            <Card.Body>
              <Card.Title>🔒 Account Settings</Card.Title>
              <Card.Text>
                Keep your account secure by updating your password regularly. Navigate to the 
                Change Password section to update your credentials.
              </Card.Text>
              <Link to="/change-password" className="btn btn-secondary">
                Change Password
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Features Available to You</Card.Title>
              <ul>
                <li><strong>🎯 Personalized Recommendations:</strong> Get movie suggestions based on your viewing history and preferences</li>
                <li><strong>Browse Movies:</strong> View the complete movie catalog</li>
                <li><strong>Search Functionality:</strong> Search movies by title or director</li>
                <li><strong>Filter by Genre:</strong> Find movies in your favorite genres</li>
                <li><strong>Like/Dislike System:</strong> Build your taste profile by rating movies</li>
                <li><strong>View Tracking:</strong> Your watching history helps improve recommendations</li>
                <li><strong>Detailed Information:</strong> View comprehensive details including cast, rating, duration, and plot</li>
                <li><strong>Responsive Design:</strong> Access the platform on any device</li>
                <li><strong>Password Management:</strong> Change your password anytime</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Card className="bg-light">
            <Card.Body>
              <Card.Title>Quick Tips</Card.Title>
              <ul className="mb-0">
                <li>Start with <strong>Recommendations</strong> to discover movies matched to your taste</li>
                <li><strong>Like movies</strong> you enjoy to get better personalized suggestions</li>
                <li>Use the search bar to quickly find specific movies</li>
                <li>Filter by genre to discover movies in categories you love</li>
                <li>Check the rating to see highly-rated movies</li>
                <li>Review the cast list to find movies featuring your favorite actors</li>
                <li>The more you watch and rate, the smarter your recommendations become!</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserDashboard;