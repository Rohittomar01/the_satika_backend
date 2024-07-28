var express = require("express");
var router = express.Router();
var path = require("path");
var pool = require("./pool/pool.js");
var upload = require("./multer/multer.js");

router.post("/add_banner", upload.single("picture"), (req, res) => {
  const {
    title,
    banner_description,
    started_at,
    ended_at,
    status,
    created_by,
  } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const image_name = req.file.filename;
  const image_type = path.extname(req.file.originalname).substring(1);
  const mime_type = req.file.mimetype;
  const image_size = req.file.size;
  const created_at = new Date();
  const updated_at = new Date();

  console.log({
    image_name,
    image_type,
    mime_type,
    image_size,
    created_at,
    updated_at,
  });

  pool.query(
    `INSERT INTO banners (title, banner_description, image_name, image_type, mime_type, image_size, started_at, ended_at, status, created_at, updated_at, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      title,
      banner_description,
      image_name,
      image_type,
      mime_type,
      image_size,
      started_at,
      ended_at,
      status,
      created_at,
      updated_at,
      created_by,
    ],
    function (error, result) {
      if (error) {
        console.error("Error adding banner:", error);
        res.status(500).json({ message: "Error adding banner" });
      } else {
        console.log("Banner successfully added:", result);
        res.status(200).json({
          data: result,
          message: "Banner successfully added",
        });
      }
    }
  );
});

router.get("/get_banners", (req, res) => {
  pool.query(
    `SELECT * FROM banners WHERE status='active'`,
    function (error, results) {
      if (error) {
        console.error("Error fetching banners:", error);
        res.status(500).json({ message: "Error fetching banners" });
      } else {
        res.status(200).json({
          data: results,
          message: "Banners successfully fetched",
        });
      }
    }
  );
});

module.exports = router;
