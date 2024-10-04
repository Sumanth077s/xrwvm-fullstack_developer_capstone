import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header'; // Import your Header component
import Home from './components/Home'; // Import other components as needed
import DealerDetails from './components/Dealers/DealerDetails'; // Dealer details component
import PostReview from './components/Dealers/PostReview'; // PostReview component
// Import other components as needed

const App = () => {
  return (
    <Router>
      <Header /> {/* Optional: You can place Header here if you want it on every page */}
      <Routes>
        <Route path="/" element={<Home />} /> {/* Home route */}
        <Route path="/dealer/:id" element={<DealerDetails />} /> {/* Dealer details route */}
        <Route path="/postreview/:id" element={<PostReview />} /> {/* Post Review route */}
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
};

export default App;
