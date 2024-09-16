var express = require("express");
var router = express.Router();
var pool = require("./pool/pool.js");


router.post('/submit_reviews', (req, res) => {
    const { review_id, product_id, user_id, rating, comment, created_by } = req.body;
    const query = 'INSERT INTO Reviews (review_id, product_id, user_id, rating, comment, created_by) VALUES (?, ?, ?, ?, ?, ?)';
    pool.query(query, [review_id, product_id, user_id, rating, comment, created_by], (err, results) => {
      if (err) {
        console.error('Error submitting review:', err);
        res.status(500).send('Error submitting review');
      } else {
        res.status(200).send('Review submitted successfully');
      }
    });
  });
  
  // Endpoint to fetch all reviews
  router.get('/fetch_all_reviews', (req, res) => {
    const query = 'SELECT * FROM reviews';
    pool.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching reviews:', err);
        res.status(500).send('Error fetching reviews');
      } else {
        res.status(200).json({data:results});
      }
    });
  });
  
  // Endpoint to edit a review
  router.post('/update_reviews/:id', (req, res) => {
    const review_id = req.params.id;
    const { rating, comment } = req.body;
    const query = 'UPDATE Reviews SET rating = ?, comment = ? WHERE review_id = ?';
    pool.query(query, [rating, comment, review_id], (err, results) => {
      if (err) {
        console.error('Error updating review:', err);
        res.status(500).send('Error updating review');
      } else {
        res.status(200).send('Review updated successfully');
      }
    });
  });
  
  // Endpoint to delete a review
  router.delete('/delete_reviews/:id', (req, res) => {
    const review_id = req.params.id;
    const query = 'DELETE FROM Reviews WHERE review_id = ?';
    pool.query(query, [review_id], (err, results) => {
      if (err) {
        console.error('Error deleting review:', err);
        res.status(500).send('Error deleting review');
      } else {
        res.status(200).send('Review deleted successfully');
      }
    });
  });
  module.exports = router;
