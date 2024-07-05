var express = require("express");
var router = express.Router();
var pool = require("./pool/pool.js");
var upload = require("./multer/multer.js");

router.post("/submitCategory_Data",function (req, res) {
  const { name, description, created_at, created_by, updated_at } = req.body;
//   const picture = req.file.originalname;
  console.log("body", req.body);

  const sql =
    "INSERT INTO category ( category_name, category_description, created_at, created_by, updated_at) VALUES (?, ?, ?,?,?)";
  const values = [name, description, created_at, created_by, updated_at];

  pool.query(sql, values, function (err, result) {
    if (err) {
      console.error("Error inserting data:", err);
      return res.status(500).json({ error: "Failed to submit data" });
    }
    console.log("Data inserted successfully");
    res.status(200).json({ message: "Data submitted successfully" });
  });
});

module.exports = router;
