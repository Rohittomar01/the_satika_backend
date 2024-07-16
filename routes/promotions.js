var express = require("express");
var router = express.Router();
var pool = require("./pool/pool.js"); // Adjust path as per your project structure
var upload = require("./multer/multer.js"); // Adjust path as per your project structure

// Add a new promotion
router.post("/add_promotion", function (req, res) {
  const {
    title,
    promotion_description,
    start_date,
    end_date,
    created_by,
    created_at,
    updated_at,
    status
  } = req.body;

  console.log("backend dat", req.body);

  pool.query(
    `INSERT INTO promotions (title, promotion_description, start_date, end_date,created_at,updated_at, created_by, status) VALUES(?, ?, ?, ?, ?, ?,?,?)`,
    [
      title,
      promotion_description,
      start_date,
      end_date,
      created_at,
      updated_at,
      created_by,
      status
    ],
    function (error, result) {
      if (error) {
        console.log(error);
        res.status(500).json({ message: "Error adding promotion" });
      } else {
        res.status(200).json({ data: result, message: "Promotion successfully added" });
      }
    }
  );
});

// Fetch all promotions
router.get("/fetch_promotions", function (req, res) {
  pool.query(`SELECT * FROM promotions`, function (error, results) {
    if (error) {
      console.log(error);
      res.status(500).json({ message: "Error fetching promotions" });
    } else {
      res.status(200).json({ data: results, message: "Promotions fetched successfully" });
    }
  });
});

// Update a promotion by id
router.put("/update_promotion/:id", function (req, res) {
  const promotionId = req.params.id;
  const {
    title,
    promotion_description,
    start_date,
    end_date,
    created_by,
    status
  } = req.body;

  pool.query(
    `UPDATE promotions SET title=?, promotion_description=?, start_date=?, end_date=?, created_by=?, status=? WHERE promotion_id=?`,
    [
      title,
      promotion_description,
      start_date,
      end_date,
      created_by,
      status,
      promotionId
    ],
    function (error, result) {
      if (error) {
        console.log(error);
        res.status(500).json({ message: `Error updating promotion ${promotionId}` });
      } else {
        res.status(200).json({ data: result, message: `Promotion ${promotionId} updated successfully` });
      }
    }
  );
});

// Delete a promotion by id
router.delete("/delete_promotion/:id", function (req, res) {
  const promotionId = req.params.id;

  pool.query(
    `DELETE FROM promotions WHERE promotion_id=?`,
    [promotionId],
    function (error, result) {
      if (error) {
        console.log(error);
        res.status(500).json({ message: `Error deleting promotion ${promotionId}` });
      } else {
        res.status(200).json({ data: result, message: `Promotion ${promotionId} deleted successfully` });
      }
    }
  );
});

module.exports = router;
