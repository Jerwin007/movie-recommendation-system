// backend/seed.js
// This script populates your database with sample data
// Run this ONCE after setting up your project

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config();

// Import models
const User = require('./models/User');
const Movie = require('./models/Movie');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected for seeding...'))
.catch((err) => console.error('MongoDB connection error:', err));

// Sample Users
const users = [
  {
    name: 'Jerwin',
    email: 'jerwinnikkish@karunya.edu.in',
    password: 'Jerwin@123',
    role: 'admin'
  },
  {
    name: 'Faheem',
    email: 'faheem@movie.com',
    password: 'Faheem@123',
    role: 'user'
  },
  {
    name: 'Grace',
    email: 'grace@movie.com',
    password: 'Grace@123',
    role: 'user'
  }
];

// Sample Movies
const movies = [
  {
    title: 'The Shawshank Redemption',
    director: 'Frank Darabont',
    genre: 'Drama',
    releaseYear: 1994,
    rating: 9.3,
    description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    cast: ['Tim Robbins', 'Morgan Freeman', 'Bob Gunton'],
    duration: 142,
    language: 'English',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg',
    available: true
  },
  {
    title: 'The Godfather',
    director: 'Francis Ford Coppola',
    genre: 'Drama',
    releaseYear: 1972,
    rating: 9.2,
    description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
    cast: ['Marlon Brando', 'Al Pacino', 'James Caan'],
    duration: 175,
    language: 'English',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg',
    available: true
  },
  {
    title: 'The Dark Knight',
    director: 'Christopher Nolan',
    genre: 'Action',
    releaseYear: 2008,
    rating: 9.0,
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.',
    cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
    duration: 152,
    language: 'English',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg',
    available: true
  },
  {
    title: 'Inception',
    director: 'Christopher Nolan',
    genre: 'Sci-Fi',
    releaseYear: 2010,
    rating: 8.8,
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea.',
    cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Ellen Page'],
    duration: 148,
    language: 'English',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg',
    available: true
  },
  {
    title: 'Pulp Fiction',
    director: 'Quentin Tarantino',
    genre: 'Thriller',
    releaseYear: 1994,
    rating: 8.9,
    description: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.',
    cast: ['John Travolta', 'Uma Thurman', 'Samuel L. Jackson'],
    duration: 154,
    language: 'English',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg',
    available: true
  },
  {
    title: 'Forrest Gump',
    director: 'Robert Zemeckis',
    genre: 'Drama',
    releaseYear: 1994,
    rating: 8.8,
    description: 'The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold from the perspective of an Alabama man.',
    cast: ['Tom Hanks', 'Robin Wright', 'Gary Sinise'],
    duration: 142,
    language: 'English',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg',
    available: true
  },
  {
    title: 'The Matrix',
    director: 'Lana Wachowski, Lilly Wachowski',
    genre: 'Sci-Fi',
    releaseYear: 1999,
    rating: 8.7,
    description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
    cast: ['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss'],
    duration: 136,
    language: 'English',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg',
    available: true
  },
  {
    title: 'Goodfellas',
    director: 'Martin Scorsese',
    genre: 'Drama',
    releaseYear: 1990,
    rating: 8.7,
    description: 'The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners.',
    cast: ['Robert De Niro', 'Ray Liotta', 'Joe Pesci'],
    duration: 146,
    language: 'English',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BY2NkZjEzMDgtN2RjYy00YzM1LWI4ZmQtMjIwYjFjNmI3ZGEwXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg',
    available: true
  },
  {
    title: 'Interstellar',
    director: 'Christopher Nolan',
    genre: 'Sci-Fi',
    releaseYear: 2014,
    rating: 8.6,
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
    duration: 169,
    language: 'English',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg',
    available: true
  },
  {
    title: 'The Lion King',
    director: 'Roger Allers, Rob Minkoff',
    genre: 'Animation',
    releaseYear: 1994,
    rating: 8.5,
    description: 'Lion prince Simba and his father are targeted by his bitter uncle, who wants to ascend the throne himself.',
    cast: ['Matthew Broderick', 'Jeremy Irons', 'James Earl Jones'],
    duration: 88,
    language: 'English',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BYTYxNGMyZTYtMjE3MS00YzNjLWFjNmYtMDk3N2FmM2JiM2M1XkEyXkFqcGdeQXVyNjY5NDU4NzI@._V1_.jpg',
    available: true
  },
  {
    title: 'Fight Club',
    director: 'David Fincher',
    genre: 'Drama',
    releaseYear: 1999,
    rating: 8.8,
    description: 'An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.',
    cast: ['Brad Pitt', 'Edward Norton', 'Helena Bonham Carter'],
    duration: 139,
    language: 'English',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BNDIzNDU0YzEtYzE5Ni00ZjlkLTk5ZjgtNjM3NWE4YzA3Nzk3XkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_.jpg',
    available: true
  },
  {
    title: 'The Silence of the Lambs',
    director: 'Jonathan Demme',
    genre: 'Thriller',
    releaseYear: 1991,
    rating: 8.6,
    description: 'A young FBI cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer.',
    cast: ['Jodie Foster', 'Anthony Hopkins', 'Lawrence A. Bonney'],
    duration: 118,
    language: 'English',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BNjNhZTk0ZmEtNjJhMi00YzFlLWE1MmEtYzM1M2ZmMGMwMTU4XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg',
    available: true
  },
  {
    title: 'Parasite',
    director: 'Bong Joon Ho',
    genre: 'Thriller',
    releaseYear: 2019,
    rating: 8.5,
    description: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
    cast: ['Song Kang-ho', 'Lee Sun-kyun', 'Cho Yeo-jeong'],
    duration: 132,
    language: 'Korean',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_.jpg',
    available: true
  },
  {
    title: 'Gladiator',
    director: 'Ridley Scott',
    genre: 'Action',
    releaseYear: 2000,
    rating: 8.5,
    description: 'A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.',
    cast: ['Russell Crowe', 'Joaquin Phoenix', 'Connie Nielsen'],
    duration: 155,
    language: 'English',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BMDliMmNhNDEtODUyOS00MjNlLTgxODEtN2U3NzIxMGVkZTA1L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg',
    available: true
  },
  {
    title: 'The Departed',
    director: 'Martin Scorsese',
    genre: 'Thriller',
    releaseYear: 2006,
    rating: 8.5,
    description: 'An undercover cop and a mole in the police attempt to identify each other while infiltrating an Irish gang in South Boston.',
    cast: ['Leonardo DiCaprio', 'Matt Damon', 'Jack Nicholson'],
    duration: 151,
    language: 'English',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BMTI1MTY2OTIxNV5BMl5BanBnXkFtZTYwNjQ4NjY3._V1_.jpg',
    available: true
  },
  {
    title: 'The Avengers',
    director: 'Joss Whedon',
    genre: 'Action',
    releaseYear: 2012,
    rating: 8.0,
    description: 'Earth\'s mightiest heroes must come together and learn to fight as a team if they are going to stop the mischievous Loki and his alien army.',
    cast: ['Robert Downey Jr.', 'Chris Evans', 'Scarlett Johansson'],
    duration: 143,
    language: 'English',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BNDYxNjQyMjAtNTdiOS00NGYwLWFmNTAtNThmYjU5ZGI2YTI1XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg',
    available: true
  },
  {
    title: 'Toy Story',
    director: 'John Lasseter',
    genre: 'Animation',
    releaseYear: 1995,
    rating: 8.3,
    description: 'A cowboy doll is profoundly threatened and jealous when a new spaceman action figure supplants him as top toy in a boy\'s bedroom.',
    cast: ['Tom Hanks', 'Tim Allen', 'Don Rickles'],
    duration: 81,
    language: 'English',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BMDU2ZWJlMjktMTRhMy00ZTA5LWEzNDgtYmNmZTEwZTViZWJkXkEyXkFqcGdeQXVyNDQ2OTk4MzI@._V1_.jpg',
    available: true
  },
  {
    title: 'Coco',
    director: 'Lee Unkrich',
    genre: 'Animation',
    releaseYear: 2017,
    rating: 8.4,
    description: 'Aspiring musician Miguel, confronted with his family\'s ancestral ban on music, enters the Land of the Dead to find his great-great-grandfather, a legendary singer.',
    cast: ['Anthony Gonzalez', 'Gael García Bernal', 'Benjamin Bratt'],
    duration: 105,
    language: 'English',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BYjQ5NjM0Y2YtNjZkNC00ZDhkLWJjMWItN2QyNzFkMDE3ZjAxXkEyXkFqcGdeQXVyODIxMzk5NjA@._V1_.jpg',
    available: true
  },
  {
    title: 'Spider-Man: Into the Spider-Verse',
    director: 'Bob Persichetti, Peter Ramsey',
    genre: 'Animation',
    releaseYear: 2018,
    rating: 8.4,
    description: 'Teen Miles Morales becomes the Spider-Man of his universe and must join with five spider-powered individuals from other dimensions.',
    cast: ['Shameik Moore', 'Jake Johnson', 'Hailee Steinfeld'],
    duration: 117,
    language: 'English',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BMjMwNDkxMTgzOF5BMl5BanBnXkFtZTgwNTkwNTQ3NjM@._V1_.jpg',
    available: true
  },
  {
    title: 'The Conjuring',
    director: 'James Wan',
    genre: 'Horror',
    releaseYear: 2013,
    rating: 7.5,
    description: 'Paranormal investigators Ed and Lorraine Warren work to help a family terrorized by a dark presence in their farmhouse.',
    cast: ['Patrick Wilson', 'Vera Farmiga', 'Ron Livingston'],
    duration: 112,
    language: 'English',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BMTM3NjA1NDMyMV5BMl5BanBnXkFtZTcwMDQzNDMzOQ@@._V1_.jpg',
    available: true
  },
  {
    title: 'A Quiet Place',
    director: 'John Krasinski',
    genre: 'Horror',
    releaseYear: 2018,
    rating: 7.5,
    description: 'In a post-apocalyptic world, a family is forced to live in silence while hiding from monsters with ultra-sensitive hearing.',
    cast: ['Emily Blunt', 'John Krasinski', 'Millicent Simmonds'],
    duration: 90,
    language: 'English',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BMjI0MDMzNTQ0M15BMl5BanBnXkFtZTgwMTM5NzM3NDM@._V1_.jpg',
    available: true
  },
  {
    title: 'La La Land',
    director: 'Damien Chazelle',
    genre: 'Romance',
    releaseYear: 2016,
    rating: 8.0,
    description: 'While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations for the future.',
    cast: ['Ryan Gosling', 'Emma Stone', 'John Legend'],
    duration: 128,
    language: 'English',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BMzUzNDM2NzM2MV5BMl5BanBnXkFtZTgwNTM3NTg4OTE@._V1_.jpg',
    available: true
  },
  {
    title: 'The Notebook',
    director: 'Nick Cassavetes',
    genre: 'Romance',
    releaseYear: 2004,
    rating: 7.8,
    description: 'A poor yet passionate young man falls in love with a rich young woman, giving her a sense of freedom, but they are soon separated.',
    cast: ['Ryan Gosling', 'Rachel McAdams', 'James Garner'],
    duration: 123,
    language: 'English',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BMTk3OTM5Njg5M15BMl5BanBnXkFtZTYwMzA0ODI3._V1_.jpg',
    available: true
  },
  {
    title: 'Titanic',
    director: 'James Cameron',
    genre: 'Romance',
    releaseYear: 1997,
    rating: 7.9,
    description: 'A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.',
    cast: ['Leonardo DiCaprio', 'Kate Winslet', 'Billy Zane'],
    duration: 194,
    language: 'English',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BMDdmZGU3NDQtY2E5My00ZTliLWIzOTUtMTY4ZGI1YjdiNjk3XkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_.jpg',
    available: true
  },
  {
    title: 'Superbad',
    director: 'Greg Mottola',
    genre: 'Comedy',
    releaseYear: 2007,
    rating: 7.6,
    description: 'Two co-dependent high school seniors are forced to deal with separation anxiety after their plan to stage a booze-soaked party goes awry.',
    cast: ['Jonah Hill', 'Michael Cera', 'Christopher Mintz-Plasse'],
    duration: 113,
    language: 'English',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BY2VkMDg4ZTYtN2M3Yy00NWZiLWE2ODEtZjU5MjZkYWNkNGIzXkEyXkFqcGdeQXVyODY5Njk4Njc@._V1_.jpg',
    available: true
  },
  {
    title: 'The Hangover',
    director: 'Todd Phillips',
    genre: 'Comedy',
    releaseYear: 2009,
    rating: 7.7,
    description: 'Three buddies wake up from a bachelor party in Las Vegas, with no memory of the previous night and the bachelor missing.',
    cast: ['Bradley Cooper', 'Zach Galifianakis', 'Ed Helms'],
    duration: 100,
    language: 'English',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BNGQwZjg5YmYtY2VkNC00NzliLTljYTctNzI5NmU3MjE2ODQzXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg',
    available: true
  },
  {
    title: 'Groundhog Day',
    director: ' Harold Ramis',
    genre: 'Comedy',
    releaseYear: 1993,
    rating: 8.0,
    description: 'A cynical TV weatherman finds himself reliving the same day over and over again when he goes on location to the small town of Punxsutawney.',
    cast: ['Bill Murray', 'Andie MacDowell', 'Chris Elliott'],
    duration: 101,
    language: 'English',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BZWIxNzM5YzQtY2FmMS00Yjc3LWI1ZjUtNGVjMjMzZTIxZTIxXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg',
    available: true
  },
  {
    title: 'Shrek',
    director: 'Andrew Adamson, Vicky Jenson',
    genre: 'Animation',
    releaseYear: 2001,
    rating: 7.9,
    description: 'A mean lord exiles fairytale creatures to the swamp of a grumpy ogre, who must go on a quest to rescue a princess for the lord.',
    cast: ['Mike Myers', 'Eddie Murphy', 'Cameron Diaz'],
    duration: 90,
    language: 'English',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BOGZhM2FhNTItODAzNi00YjA0LWEyN2ItNjJlYWQzYzU1MDg5L2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg',
    available: true
  },
  {
    title: 'Avatar',
    director: 'James Cameron',
    genre: 'Sci-Fi',
    releaseYear: 2009,
    rating: 7.9,
    description: 'A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.',
    cast: ['Sam Worthington', 'Zoe Saldana', 'Sigourney Weaver'],
    duration: 162,
    language: 'English',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BZDA0OGQxNTItMDZkMC00N2UyLTg3MzMtYTJmNjg3Nzk5MzRiXkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_.jpg',
    available: true
  },
  {
    title: 'Blade Runner 2049',
    director: 'Denis Villeneuve',
    genre: 'Sci-Fi',
    releaseYear: 2017,
    rating: 8.0,
    description: 'Young Blade Runner K\'s discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard.',
    cast: ['Ryan Gosling', 'Harrison Ford', 'Ana de Armas'],
    duration: 164,
    language: 'English',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BNzA1Njg4NzYxOV5BMl5BanBnXkFtZTgwODk5NjU3MzI@._V1_.jpg',
    available: true
  },
  {
    title: 'The Lord of the Rings: The Fellowship of the Ring',
    director: 'Peter Jackson',
    genre: 'Fantasy',
    releaseYear: 2001,
    rating: 8.8,
    description: 'A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth.',
    cast: ['Elijah Wood', 'Ian McKellen', 'Orlando Bloom'],
    duration: 178,
    language: 'English',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_.jpg',
    available: true
  },
  {
    title: 'Harry Potter and the Sorcerer\'s Stone',
    director: 'Chris Columbus',
    genre: 'Fantasy',
    releaseYear: 2001,
    rating: 7.6,
    description: 'An orphaned boy enrolls in a school of wizardry, where he learns the truth about himself, his family and the terrible evil that haunts the magical world.',
    cast: ['Daniel Radcliffe', 'Rupert Grint', 'Emma Watson'],
    duration: 152,
    language: 'English',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BNmQ0ODBhMjUtNDRhOC00MGQzLTk5MTAtZDliODg5NmU5MjZhXkEyXkFqcGdeQXVyNDUyOTg3Njg@._V1_.jpg',
    available: true
  },
  {
    title: 'Pan\'s Labyrinth',
    director: 'Guillermo del Toro',
    genre: 'Fantasy',
    releaseYear: 2006,
    rating: 8.2,
    description: 'In the Falangist Spain of 1944, the bookish young stepdaughter of a sadistic army officer escapes into an eerie but captivating fantasy world.',
    cast: ['Ivana Baquero', 'Ariadna Gil', 'Sergi López'],
    duration: 118,
    language: 'Spanish',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BYzFjMThiMGItOWRlMC00MDI4LThmOGUtYTNlZGZiYWI1YjMyXkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_.jpg',
    available: true
  },
  {
    title: 'Saving Private Ryan',
    director: 'Steven Spielberg',
    genre: 'Drama',
    releaseYear: 1998,
    rating: 8.6,
    description: 'Following the Normandy Landings, a group of U.S. soldiers go behind enemy lines to retrieve a paratrooper whose brothers have been killed in action.',
    cast: ['Tom Hanks', 'Matt Damon', 'Tom Sizemore'],
    duration: 169,
    language: 'English',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BZjhkMDM4MWItZTVjOC00ZDRhLThmYTAtM2I5NzBmNmNlMzI1XkEyXkFqcGdeQXVyNDYyMDk5MTU@._V1_.jpg',
    available: true
  },
  {
    title: '12 Angry Men',
    director: 'Sidney Lumet',
    genre: 'Drama',
    releaseYear: 1957,
    rating: 9.0,
    description: 'A jury holdout attempts to prevent a miscarriage of justice by forcing his colleagues to reconsider the evidence.',
    cast: ['Henry Fonda', 'Lee J. Cobb', 'Martin Balsam'],
    duration: 96,
    language: 'English',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BMWU4N2FjNzYtNTVkNC00NzQ0LTg0MjAtYTJlMjFhNGUxZDFmXkEyXkFqcGdeQXVyNjc1NTYyMjg@._V1_.jpg',
    available: true
  },
  {
    title: 'Mad Max: Fury Road',
    director: 'George Miller',
    genre: 'Action',
    releaseYear: 2015,
    rating: 8.1,
    description: 'In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search for her homeland with the aid of a group of female prisoners.',
    cast: ['Tom Hardy', 'Charlize Theron', 'Nicholas Hoult'],
    duration: 120,
    language: 'English',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BN2EwM2I5OWMtMGQyMi00Zjg1LWJkNTctZTdjYTA4OGUwZjMyXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg',
    available: true
  },
  {
    title: 'John Wick',
    director: 'Chad Stahelski',
    genre: 'Action',
    releaseYear: 2014,
    rating: 7.4,
    description: 'An ex-hit-man comes out of retirement to track down the gangsters that killed his dog and took everything from him.',
    cast: ['Keanu Reeves', 'Michael Nyqvist', 'Alfie Allen'],
    duration: 101,
    language: 'English',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BMTU2NjA1ODgzMF5BMl5BanBnXkFtZTgwMTM2MTI4MjE@._V1_.jpg',
    available: true
  },
  {
    title: 'Get Out',
    director: 'Jordan Peele',
    genre: 'Horror',
    releaseYear: 2017,
    rating: 7.7,
    description: 'A young African-American visits his white girlfriend\'s parents for the weekend, where his simmering uneasiness about their reception of him eventually reaches a boiling point.',
    cast: ['Daniel Kaluuya', 'Allison Williams', 'Bradley Whitford'],
    duration: 104,
    language: 'English',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BMjUxMDQwNjcyNl5BMl5BanBnXkFtZTgwNzcwMzc0MTI@._V1_.jpg',
    available: true
  },
  {
    title: 'Planet of the Apes',
    director: 'Franklin J. Schaffner',
    genre: 'Sci-Fi',
    releaseYear: 1968,
    rating: 8.0,
    description: 'An astronaut crew crash-lands on a planet in the distant future where intelligent talking apes are the dominant species, and humans are the oppressed.',
    cast: ['Charlton Heston', 'Roddy McDowall', 'Kim Hunter'],
    duration: 112,
    language: 'English',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BMTg0NjUwMzg5NF5BMl5BanBnXkFtZTgwNDY2OTIwMDE@._V1_.jpg',
    available: true
  },
  // Added 3 more Action movies
  {
    title: 'Die Hard',
    director: 'John McTiernan',
    genre: 'Action',
    releaseYear: 1988,
    rating: 8.2,
    description: 'An NYPD officer tries to save his wife and several others taken hostage by German terrorists during a Christmas party at the Nakatomi Plaza in Los Angeles.',
    cast: ['Bruce Willis', 'Alan Rickman', 'Bonnie Bedelia'],
    duration: 132,
    language: 'English',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BZjRlNDUxZjAtOGQ4OC00OTNlLTgxNmQtYTBmMDgwZmNmNjkxXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg',
    available: true
  },
  {
    title: 'The Bourne Identity',
    director: 'Doug Liman',
    genre: 'Action',
    releaseYear: 2002,
    rating: 7.9,
    description: 'A man is picked up by a fishing boat, bullet-riddled and suffering from amnesia, before racing to elude assassins and attempting to regain his memory.',
    cast: ['Matt Damon', 'Franka Potente', 'Chris Cooper'],
    duration: 119,
    language: 'English',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BM2JkNGU0ZGMtZjVjNS00NjgyLWEyOWYtZmRmZGQyN2IxZjA2XkEyXkFqcGdeQXVyNTIzOTk5ODM@._V1_.jpg',
    available: true
  },
  {
    title: 'Mission: Impossible - Fallout',
    director: 'Christopher McQuarrie',
    genre: 'Action',
    releaseYear: 2018,
    rating: 7.7,
    description: 'Ethan Hunt and his IMF team, along with some familiar allies, race against time after a mission gone wrong.',
    cast: ['Tom Cruise', 'Henry Cavill', 'Ving Rhames'],
    duration: 147,
    language: 'English',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BMTk3NDY5MTU0NV5BMl5BanBnXkFtZTgwNDI3MDE1NTM@._V1_.jpg',
    available: true
  },
  // Added 3 more Comedy movies
  {
    title: 'Dumb and Dumber',
    director: 'Peter Farrelly',
    genre: 'Comedy',
    releaseYear: 1994,
    rating: 7.3,
    description: 'After a woman leaves a briefcase at the airport terminal, a dumb limo driver and his dumber friend set out on a hilarious cross-country road trip to return it.',
    cast: ['Jim Carrey', 'Jeff Daniels', 'Lauren Holly'],
    duration: 107,
    language: 'English',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BZDQwMjNiMTQtY2UwYy00NjhiLTk0ZWEtZWM5ZWMzNGFjNTVkXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg',
    available: true
  },
  {
    title: 'The Grand Budapest Hotel',
    director: 'Wes Anderson',
    genre: 'Comedy',
    releaseYear: 2014,
    rating: 8.1,
    description: 'A writer encounters the owner of an aging high-class hotel, who tells him of his early years serving as a lobby boy.',
    cast: ['Ralph Fiennes', 'F. Murray Abraham', 'Mathieu Amalric'],
    duration: 99,
    language: 'English',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BMzM5NjUxOTEyMl5BMl5BanBnXkFtZTgwNjEyMDM0MDE@._V1_.jpg',
    available: true
  },
  {
    title: 'Bridesmaids',
    director: 'Paul Feig',
    genre: 'Comedy',
    releaseYear: 2011,
    rating: 6.8,
    description: 'Competition between the maid of honor and a bridesmaid, over who is the bride\'s best friend, threatens to upend the life of an out-of-work pastry chef.',
    cast: ['Kristen Wiig', 'Maya Rudolph', 'Rose Byrne'],
    duration: 125,
    language: 'English',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BMjAyOTMyMzUxNl5BMl5BanBnXkFtZTcwODI4MzE0NA@@._V1_.jpg',
    available: true
  },
  // Added 3 more Drama movies
  {
    title: 'Schindler\'s List',
    director: 'Steven Spielberg',
    genre: 'Drama',
    releaseYear: 1993,
    rating: 9.0,
    description: 'In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution.',
    cast: ['Liam Neeson', 'Ben Kingsley', 'Ralph Fiennes'],
    duration: 195,
    language: 'English',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BNDE4OTMxMTctNmRhYy00NWE2LTg3YzItYTk3M2UwOTU5Njg4XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg',
    available: true
  },
  {
    title: 'The Green Mile',
    director: 'Frank Darabont',
    genre: 'Drama',
    releaseYear: 1999,
    rating: 8.6,
    description: 'The lives of guards on Death Row are affected by one of their charges: a black man accused of child murder and rape, yet who has a mysterious gift.',
    cast: ['Tom Hanks', 'Michael Clarke Duncan', 'David Morse'],
    duration: 189,
    language: 'English',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BMTUxMzQyNjA5MF5BMl5BanBnXkFtZTYwOTU2NTY3._V1_.jpg',
    available: true
  },
  {
    title: 'A Beautiful Mind',
    director: 'Ron Howard',
    genre: 'Drama',
    releaseYear: 2001,
    rating: 8.2,
    description: 'After John Nash, a brilliant but asocial mathematician, accepts secret work in cryptography, his life takes a turn for the nightmarish.',
    cast: ['Russell Crowe', 'Ed Harris', 'Jennifer Connelly'],
    duration: 135,
    language: 'English',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BMzcwYWFkYzktZjAzNC00OGY1LWI4YTgtNzc5MzVjMDVmNjY0XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg',
    available: true
  },
  // Added 3 more Horror movies
  {
    title: 'The Shining',
    director: 'Stanley Kubrick',
    genre: 'Horror',
    releaseYear: 1980,
    rating: 8.4,
    description: 'A family heads to an isolated hotel for the winter where a sinister presence influences the father into violence.',
    cast: ['Jack Nicholson', 'Shelley Duvall', 'Danny Lloyd'],
    duration: 146,
    language: 'English',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BZWFlYmY2MGEtZjVkYS00YzU4LTg0YjQtYzY1ZGE3NTA5NGQxXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg',
    available: true
  },
  {
    title: 'Hereditary',
    director: 'Ari Aster',
    genre: 'Horror',
    releaseYear: 2018,
    rating: 7.3,
    description: 'A grieving family is haunted by tragic and disturbing occurrences after the death of their secretive grandmother.',
    cast: ['Toni Collette', 'Milly Shapiro', 'Gabriel Byrne'],
    duration: 127,
    language: 'English',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BOTU5MDg3OGItZWQ1Ny00ZGVmLTg2YTUtMzBkYzQ1YWIwZDlmXkEyXkFqcGdeQXVyNTAzMTY4MDA@._V1_.jpg',
    available: true
  },
  {
    title: 'It',
    director: 'Andy Muschietti',
    genre: 'Horror',
    releaseYear: 2017,
    rating: 7.3,
    description: 'In the summer of 1989, a group of bullied kids band together to destroy a shape-shifting monster, which disguises itself as a clown.',
    cast: ['Bill Skarsgård', 'Jaeden Martell', 'Finn Wolfhard'],
    duration: 135,
    language: 'English',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BZDVkZmI0YzAtNzdjYi00ZjhhLWE1ODEtMWMzMWMzNDA0NmQ4XkEyXkFqcGdeQXVyNzYzODM3Mzg@._V1_.jpg',
    available: true
  },
  // Added 3 more Romance movies
  {
    title: 'Pride and Prejudice',
    director: 'Joe Wright',
    genre: 'Romance',
    releaseYear: 2005,
    rating: 7.8,
    description: 'Sparks fly when spirited Elizabeth Bennet meets single, rich, and proud Mr. Darcy. But Mr. Darcy reluctantly finds himself falling in love.',
    cast: ['Keira Knightley', 'Matthew Macfadyen', 'Brenda Blethyn'],
    duration: 129,
    language: 'English',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BMTA1NDQ3NTcyOTNeQTJeQWpwZ15BbWU3MDA0MzA4MzE@._V1_.jpg',
    available: true
  },
  {
    title: 'Before Sunrise',
    director: 'Richard Linklater',
    genre: 'Romance',
    releaseYear: 1995,
    rating: 8.1,
    description: 'A young man and woman meet on a train in Europe, and wind up spending one evening together in Vienna.',
    cast: ['Ethan Hawke', 'Julie Delpy', 'Andrea Eckert'],
    duration: 101,
    language: 'English',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BZDdiZTAwYzAtMDI3Ni00OTRjLTkzN2UtMGE3MDMyZmU4NTU4XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg',
    available: true
  },
  {
    title: 'Eternal Sunshine of the Spotless Mind',
    director: 'Michel Gondry',
    genre: 'Romance',
    releaseYear: 2004,
    rating: 8.3,
    description: 'When their relationship turns sour, a couple undergoes a medical procedure to have each other erased from their memories.',
    cast: ['Jim Carrey', 'Kate Winslet', 'Tom Wilkinson'],
    duration: 108,
    language: 'English',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BMTY4NzcwODg3Nl5BMl5BanBnXkFtZTcwNTEwOTMyMw@@._V1_.jpg',
    available: true
  },
  // Added 3 more Sci-Fi movies
  {
    title: 'Arrival',
    director: 'Denis Villeneuve',
    genre: 'Sci-Fi',
    releaseYear: 2016,
    rating: 7.9,
    description: 'A linguist works with the military to communicate with alien lifeforms after twelve mysterious spacecraft appear around the world.',
    cast: ['Amy Adams', 'Jeremy Renner', 'Forest Whitaker'],
    duration: 116,
    language: 'English',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BMTExMzU0ODcxNDheQTJeQWpwZ15BbWU4MDE1OTI4MzAy._V1_.jpg',
    available: true
  },
  {
    title: 'Ex Machina',
    director: 'Alex Garland',
    genre: 'Sci-Fi',
    releaseYear: 2014,
    rating: 7.7,
    description: 'A young programmer is selected to participate in a ground-breaking experiment in synthetic intelligence by evaluating the human qualities of a humanoid A.I.',
    cast: ['Alicia Vikander', 'Domhnall Gleeson', 'Oscar Isaac'],
    duration: 108,
    language: 'English',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BMTUxNzc0OTIxMV5BMl5BanBnXkFtZTgwNDI3NzU2NDE@._V1_.jpg',
    available: true
  },
  {
    title: 'The Terminator',
    director: 'James Cameron',
    genre: 'Sci-Fi',
    releaseYear: 1984,
    rating: 8.1,
    description: 'A human soldier is sent from 2029 to 1984 to stop an almost indestructible cyborg killing machine.',
    cast: ['Arnold Schwarzenegger', 'Linda Hamilton', 'Michael Biehn'],
    duration: 107,
    language: 'English',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BYTViNzMxZjEtZGEwNy00MDNiLWIzNGQtZDY2MjQ1OWViZjFmXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg',
    available: true
  }
];

// Seed function
const seedDatabase = async () => {
  try {
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Movie.deleteMany({});
    console.log('✅ Cleared existing data');

    console.log('👥 Creating users...');
    const createdUsers = await User.create(users);
    console.log(`✅ Created ${createdUsers.length} users`);

    console.log('🎬 Creating movies...');
    // Assign the first admin user as the one who added all movies
    const adminUser = createdUsers.find(user => user.role === 'admin');
    const moviesWithUser = movies.map(movie => ({
      ...movie,
      addedBy: adminUser._id
    }));
    
    const createdMovies = await Movie.create(moviesWithUser);
    console.log(`✅ Created ${createdMovies.length} movies`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Use these credentials to login:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin Account:');
    console.log('  Email: jerwinnikkish@karunya.edu.in');
    console.log('  Password: Jerwin@123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('User Account 1:');
    console.log('  Email: faheem@movie.com');
    console.log('  Password: Faheem@123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('User Account 2:');
    console.log('  Email: grace@movie.com');
    console.log('  Password: Grace@123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();