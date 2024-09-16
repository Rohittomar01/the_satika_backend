var express = require("express");
var router = express.Router();
var pool = require("./pool/pool.js");

router.post("/submitWishlist_Data", function (req, res) {
  const { user_id, product_id, added_at } = req.body;

  // Check if the item already exists in the wishlist
  const checkSql = `
    SELECT * FROM wishlist WHERE user_id = ? AND product_id = ?
  `;
  const checkValues = [user_id, product_id];

  pool.query(checkSql, checkValues, function (err, results) {
    if (err) {
      console.error("Error checking data:", err);
      return res.status(500).json({ error: "Failed to submit data" });
    }

    if (results.length > 0) {
      // If the item already exists, delete it
      const deleteSql = `
        DELETE FROM wishlist WHERE user_id = ? AND product_id = ?
      `;
      pool.query(deleteSql, checkValues, function (err, result) {
        if (err) {
          console.error("Error deleting data:", err);
          return res.status(500).json({ error: "Failed to delete data" });
        }
        console.log("Data deleted successfully");
        res.status(200).json({ message: "Data deleted successfully" });
      });
    } else {
      // If the item does not exist, insert it
      const insertSql = `
        INSERT INTO wishlist (user_id, product_id, added_at) 
        VALUES (?, ?, ?)
      `;
      const insertValues = [user_id, product_id, added_at];

      pool.query(insertSql, insertValues, function (err, result) {
        if (err) {
          console.error("Error inserting data:", err);
          return res.status(500).json({ error: "Failed to submit data" });
        }
        console.log("Data inserted successfully");
        res
          .status(200)
          .json({ status: "success", message: "Data submitted successfully" });
      });
    }
  });
});

router.get("/fetchWishlist_Data", function (req, res) {
  const userId = req.query.user_id;
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const sql = `
      SELECT
        w.wishlist_id, 
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
        wishlist w
      JOIN 
        products p ON w.product_id = p.product_id
      LEFT JOIN 
        product_images pi ON p.product_id = pi.product_id
      WHERE 
        w.user_id = ?
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

// Delete a wishlist item by ID
router.delete("/deleteWishlistItem", function (req, res) {
  const { user_id, wishlist_id } = req.query;

  // Check if user_id and wishlist_id are provided
  if (!user_id || !wishlist_id) {
    return res
      .status(400)
      .json({ error: "user_id and wishlist_id are required" });
  }

  const sql = "DELETE FROM wishlist WHERE wishlist_id = ? AND user_id=?";

  pool.query(sql, [wishlist_id, user_id], function (err, result) {
    if (err) {
      console.error("Error deleting wishlist item:", err);
      return res
        .status(500)
        .json({ error: "Failed to delete wishlist item due to server error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Wishlist item not found" });
    }
    console.log("Wishlist item deleted successfully");
    res.status(200).json({ message: "Wishlist item deleted successfully" });
  });
});

router.post("/submitWishlist_Data_In_WishlistTable", function (req, res) {
  const { user_id, product_id, added_at } = req.body;

  if (!user_id || !product_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Check if the item already exists in the wishlist
  const checkSql = `
    SELECT * FROM wishlist WHERE user_id = ? AND product_id = ?
  `;
  const checkValues = [user_id, product_id];

  pool.query(checkSql, checkValues, function (err, results) {
    if (err) {
      console.error("Error checking data:", err);
      return res.status(500).json({ error: "Failed to check data in wishlist" });
    }

    if (results.length > 0) {
      // If the item already exists in the wishlist, delete it
      const deleteSql = `
        DELETE FROM wishlist WHERE user_id = ? AND product_id = ?
      `;
      pool.query(deleteSql, checkValues, function (err, result) {
        if (err) {
          console.error("Error deleting data from wishlist:", err);
          return res.status(500).json({ error: "Failed to delete data from wishlist" });
        }
        console.log("Data deleted from wishlist successfully");
        res.status(200).json({ message: "Item removed from wishlist" });
      });
    } else {
      // If the item does not exist in the wishlist, insert it
      const insertSql = `
        INSERT INTO wishlist (user_id, product_id, added_at) 
        VALUES (?, ?, ?)
      `;
      const insertValues = [user_id, product_id, added_at];

      pool.query(insertSql, insertValues, function (err, result) {
        if (err) {
          console.error("Error inserting data into wishlist:", err);
          return res.status(500).json({ error: "Failed to add item to wishlist" });
        }

        // After inserting into wishlist, delete it from the cart
        const deleteCartSql = `
          DELETE FROM add_to_cart WHERE user_id = ? AND product_id = ?
        `;
        const deleteCartValues = [user_id, product_id];

        pool.query(deleteCartSql, deleteCartValues, function (err, deleteResult) {
          if (err) {
            console.error("Error deleting item from cart:", err);
            return res.status(500).json({ error: "Failed to delete item from cart" });
          }

          // Check if any rows were deleted
          if (deleteResult.affectedRows > 0) {
            console.log("Data inserted to wishlist and deleted from cart successfully");
            res.status(200).json({
              status: "success",
              message: "Item added to wishlist and removed from cart",
            });
          } else {
            // If no rows were deleted from the cart
            console.log("Item added to wishlist, but no matching item found in the cart");
            res.status(200).json({
              status: "success",
              message: "Item added to wishlist, but no item found in the cart",
            });
          }
        });
      });
    }
  });
});


module.exports = router;
