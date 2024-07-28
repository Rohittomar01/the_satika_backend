var express = require("express");
var router = express.Router();
var pool = require("./pool/pool.js");

// Add or remove item in cart
router.post("/submitCart_Data", function (req, res) {
  const { user_id, product_id, added_at } = req.body;

  if (!user_id || !product_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const checkSql = `
      SELECT * FROM add_to_cart WHERE user_id = ? AND product_id = ?
    `;
  const checkValues = [user_id, product_id];

  pool.query(checkSql, checkValues, function (err, results) {
    if (err) {
      console.error("Error checking data:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.length > 0) {
      // If the item already exists, send a message indicating it's already added
      return res.status(200).json({ message: "Item already added to cart" });
    } else {
      // If the item does not exist, insert it
      const insertSql = `
          INSERT INTO add_to_cart (user_id, product_id, added_at) 
          VALUES (?, ?, ?)
        `;
      const insertValues = [user_id, product_id, added_at];

      pool.query(insertSql, insertValues, function (err, result) {
        if (err) {
          console.error("Error inserting data:", err);
          return res.status(500).json({ error: "Internal server error" });
        }
        console.log("Data inserted successfully");
        res.status(200).json({ message: "Item added to cart successfully" });
      });
    }
  });
});

// Fetch cart data
router.get("/fetchCart_Data", function (req, res) {
  const userId = req.query.user_id; // Assuming user_id is passed as a query parameter
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const sql = `
    SELECT 
      p.product_id, 
      p.product_name, 
      p.product_description, 
      p.price, 
      p.discount, 
      p.stock, 
      p.trending, 
      p.new_arrival, 
      p.top_selling, 
      p.category, 
      p.occasion, 
      p.craft, 
      p.fabric, 
      p.color, 
      p.origin, 
      p.brand, 
      p.created_at AS product_created_at, 
      p.updated_at AS product_updated_at, 
      p.created_by AS product_created_by,
      pi.product_image_id, 
      pi.image_name, 
      pi.mimetype, 
      pi.size, 
      pi.created_at AS image_created_at, 
      pi.updated_at AS image_updated_at, 
      pi.created_by AS image_created_by
    FROM 
      add_to_cart c
    JOIN 
      products p ON c.product_id = p.product_id
    LEFT JOIN 
      product_images pi ON p.product_id = pi.product_id
    WHERE 
      c.user_id = ?
  `;

  pool.query(sql, [userId], function (err, results) {
    if (err) {
      console.error("Error fetching data:", err);
      return res.status(500).json({ error: "Failed to fetch data" });
    }
    res.status(200).json({ data: results });
    console.log("result", results);
  });
});

// Delete a cart item by ID
router.delete("/cartDelete", function (req, res) {
    const { product_id, user_id } = req.query;
  
    if (!product_id || !user_id) {
      return res.status(400).json({ error: "Product ID and User ID are required" });
    }
  
    const sql = "DELETE FROM add_to_cart WHERE product_id = ? AND user_id = ?";
  
    pool.query(sql, [product_id, user_id], function (err, result) {
      if (err) {
        console.error("Error deleting data:", err);
        return res.status(500).json({ error: "Failed to delete data" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Cart item not found" });
      }
      console.log("Data deleted successfully");
      res.status(200).json({ message: "Data deleted successfully" });
    });
  });
  
  

module.exports = router;
