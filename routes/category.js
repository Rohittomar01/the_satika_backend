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
router.get("/fetch_Categories", function (req, res) {
    const sql = "SELECT * FROM category"; // Adjust the SQL query as needed
  
    pool.query(sql, function (err, result) {
      if (err) {
        console.error("Error fetching data:", err);
        return res.status(500).json({ message: "Failed to fetch data" });
      }
      res.status(200).json({data:result,message:"categories Fetch Succesfully"});
    });
  });

  router.delete("/delete_Category", function (req, res) {
  const categoryId = req.body.id;
  const sql = "DELETE FROM category WHERE category_id = ?"; // Adjust the SQL query as needed

  pool.query(sql, [categoryId], function (err, result) {
    if (err) {
      console.error("Error deleting data:", err);
      return res.status(500).json({ message: "Failed to delete data" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted successfully" });
  });
});


module.exports = router;
