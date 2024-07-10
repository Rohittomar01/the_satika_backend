var express = require("express");
var router = express.Router();
var pool = require("./pool/pool.js");
var upload = require("./multer/multer.js");

router.post("/add_offers", function (req, res) {
  const {
    title,
    offer_description,
    start_date,
    end_date,
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
    `INSERT INTO offers (title, offer_description, start_date, end_date, discount_type, discount_value, minimum_order_value, maximum_discount_amount, applicable_to, usage_limit, per_user_limit, status, created_by) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      title,
      offer_description,
      start_date,
      end_date,
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
        res.status(500).json({ message: "Error adding offer" });
      } else {
        res
          .status(200)
          .json({ data: result, message: "Offer successfully added" });
      }
    }
  );
});

router.get("/fetch_offers", function (req, res) {
  pool.query(`SELECT * FROM offers`, function (error, results) {
    if (error) {
      console.log(error);
      res.status(500).json({ message: "Error fetching offers" });
    } else {
      res.status(200).json({ data: results, message: "Fetch succesfully" });
    }
  });
});
router.put("/update_offer/:id", function (req, res) {
  const offerId = req.params.id;
  const {
    title,
    offer_description,
    start_date,
    end_date,
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
    `UPDATE offers SET title=?, offer_description=?, start_date=?, end_date=?, discount_type=?, discount_value=?, minimum_order_value=?, maximum_discount_amount=?, applicable_to=?, usage_limit=?, per_user_limit=?, status=?, created_by=? WHERE offer_id=?`,
    [
      title,
      offer_description,
      start_date,
      end_date,
      discount_type,
      discount_value,
      minimum_order_value,
      maximum_discount_amount,
      applicable_to,
      usage_limit,
      per_user_limit,
      status,
      created_by,
      offerId,
    ],
    function (error, result) {
      if (error) {
        console.log(error);
        res.status(500).json({ message: `Error updating offer ${offerId}` });
      } else {
        res
          .status(200)
          .json({
            data: result,
            message: `Offer ${offerId} updated successfully`,
          });
      }
    }
  );
});
router.delete("/delete_offer/:id", function (req, res) {
  const offerId = req.params.id;

  pool.query(
    `DELETE FROM offers WHERE offer_id=?`,
    [offerId],
    function (error, result) {
      if (error) {
        console.log(error);
        res.status(500).json({ message: `Error deleting offer ${offerId}` });
      } else {
        res
          .status(200)
          .json({
            data: result,
            message: `Offer ${offerId} deleted successfully`,
          });
      }
    }
  );
});

module.exports = router;
