var express = require("express");
var router = express.Router();
var pool = require("./pool/pool.js");
var upload = require("./multer/multer.js");

// Add a new discount
router.post("/add_discounts", function (req, res) {
  const {
    discount_name,
    discount_description,
    discount_type,
    discount_value,
    minimum_order_value,
    maximum_discount_amount,
    applicable_to,
    usage_limit,
    per_user_limit,
    status,
    created_by,
  } = req.body;

  console.log("backend data", req.body);

  pool.query(
    `INSERT INTO discounts (discount_name, discount_description, discount_type, discount_value, minimum_order_value, maximum_discount_amount, applicable_to, usage_limit, per_user_limit, status, created_by) VALUES(?,?,?,?,?,?,?,?,?,?,?)`,
    [
      discount_name,
      discount_description,
      discount_type,
      discount_value,
      minimum_order_value,
      maximum_discount_amount,
      applicable_to,
      usage_limit,
      per_user_limit,
      status,
      created_by,
    ],
    function (error, result) {
      if (error) {
        console.log(error);
        res.status(500).json({ message: "Error adding discount" });
      } else {
        res.status(200).json({ data: result, message: "Discount successfully added" });
      }
    }
  );
});

// Fetch all discounts
router.get("/fetch_discounts", function (req, res) {
  pool.query(`SELECT * FROM discounts`, function (error, results) {
    if (error) {
      console.log(error);
      res.status(500).json({ message: "Error fetching discounts" });
    } else {
      res.status(200).json({ data: results, message: "Fetch successfully" });
    }
  });
});

// Update a discount by id
router.put("/update_discount/:id", function (req, res) {
  const discountId = req.params.id;
  const {
    discount_name,
    discount_description,
    discount_type,
    discount_value,
    minimum_order_value,
    maximum_discount_amount,
    applicable_to,
    usage_limit,
    per_user_limit,
    status,
    created_by,
  } = req.body;

  pool.query(
    `UPDATE discounts SET discount_name=?, discount_description=?, discount_type=?, discount_value=?, minimum_order_value=?, maximum_discount_amount=?, applicable_to=?, usage_limit=?, per_user_limit=?, status=?, created_by=? WHERE discount_id=?`,
    [
      discount_name,
      discount_description,
      discount_type,
      discount_value,
      minimum_order_value,
      maximum_discount_amount,
      applicable_to,
      usage_limit,
      per_user_limit,
      status,
      created_by,
      discountId,
    ],
    function (error, result) {
      if (error) {
        console.log(error);
        res.status(500).json({ message: `Error updating discount ${discountId}` });
      } else {
        res.status(200).json({ data: result, message: `Discount ${discountId} updated successfully` });
      }
    }
  );
});

// Delete a discount by id
router.delete("/delete_discount/:id", function (req, res) {
  const discountId = req.params.id;

  pool.query(
    `DELETE FROM discounts WHERE discount_id=?`,
    [discountId],
    function (error, result) {
      if (error) {
        console.log(error);
        res.status(500).json({ message: `Error deleting discount ${discountId}` });
      } else {
        res.status(200).json({ data: result, message: `Discount ${discountId} deleted successfully` });
      }
    }
  );
});

module.exports = router;
