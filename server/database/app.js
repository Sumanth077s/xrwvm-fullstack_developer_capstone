const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 3030;

app.use(cors());
app.use(require('body-parser').urlencoded({ extended: false }));

// Load JSON data for reviews and dealerships
const reviews_data = JSON.parse(fs.readFileSync("reviews.json", 'utf8'));
const dealerships_data = JSON.parse(fs.readFileSync("dealerships.json", 'utf8'));

// Connect to MongoDB
mongoose.connect("mongodb://mongo_db:27017/", { 'dbName': 'dealershipsDB' });

// Import Mongoose models
const Reviews = require('./review');
const Dealerships = require('./dealership');

// Populate the database with reviews and dealerships from JSON
try {
  Reviews.deleteMany({}).then(() => {
    Reviews.insertMany(reviews_data['reviews']);
  });
  Dealerships.deleteMany({}).then(() => {
    Dealerships.insertMany(dealerships_data['dealerships']);
  });
} catch (error) {
  console.log('Error inserting data:', error);
}

// Express route to home
app.get('/', (req, res) => {
  res.send("Welcome to the Mongoose API");
});

// Express route to fetch all reviews
app.get('/fetchReviews', async (req, res) => {
  try {
    const documents = await Reviews.find();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching reviews' });
  }
});

// Express route to fetch reviews by a particular dealer
app.get('/fetchReviews/dealer/:id', async (req, res) => {
  try {
    const documents = await Reviews.find({ dealership: req.params.id });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching reviews for this dealer' });
  }
});

// Express route to fetch all dealerships
app.get('/fetchDealers', async (req, res) => {
  try {
    const dealerships = await Dealerships.find();
    res.json(dealerships);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching dealerships' });
  }
});

// Express route to fetch dealerships by a particular state
app.get('/fetchDealers/:state', async (req, res) => {
  try {
    const dealerships = await Dealerships.find({ state: req.params.state });
    if (dealerships.length === 0) {
      return res.status(404).json({ message: 'No dealerships found in this state' });
    }
    res.json(dealerships);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching dealerships for this state' });
  }
});

// Express route to fetch a dealership by its ID
app.get('/fetchDealer/:id', async (req, res) => {
  try {
    const dealership = await Dealerships.findOne({ id: req.params.id });
    if (!dealership) {
      return res.status(404).json({ message: 'Dealership not found' });
    }
    res.json(dealership);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching dealership by ID' });
  }
});

// Express route to insert a new review
app.post('/insert_review', express.raw({ type: '*/*' }), async (req, res) => {
  try {
    const data = JSON.parse(req.body);
    const lastReview = await Reviews.find().sort({ id: -1 }).limit(1);
    const new_id = lastReview.length > 0 ? lastReview[0].id + 1 : 1;

    const review = new Reviews({
      id: new_id,
      name: data.name,
      dealership: data.dealership,
      review: data.review,
      purchase: data.purchase,
      purchase_date: data.purchase_date,
      car_make: data.car_make,
      car_model: data.car_model,
      car_year: data.car_year,
    });

    const savedReview = await review.save();
    res.json(savedReview);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error inserting review' });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
