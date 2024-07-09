var express = require("express");
var router = express.Router();
var pool = require("./pool/pool.js");
var upload = require("./multer/multer.js");

router.post("/add-product", function (req, res) {
  const {
    product_name,
    product_description,
    price,
    discount,
    stock,
    new_arrival,
    top_selling,
    category,
    occasion,
    craft,
    fabric,
    color,
    origin,
    brand,
    Trending: trend,
    created_by,
  } = req.body;

  console.log("backend data",req.body);
  pool.query(
    `INSERT INTO Products (product_name, product_description, price, discount, stock, trending, new_arrival, top_selling, category, occasion, craft, fabric, color, origin, brand, created_by) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      product_name,
      product_description,
      price,
      discount,
      stock,
      trend,
      new_arrival,
      top_selling,
      category,
      occasion,
      craft,
      fabric,
      color,
      origin,
      brand,
      created_by,
    ],
    function (error, result) {
      if (error) {
        console.log(error);
        res.status(500).json({ message: "Error adding product" });
      } else {
        res
          .status(200)
          .json({ data: result, message: "Product successfully added" });
      }
    }
  );
});

router.post("/upload-file", upload.single("file"), function (req, res) {
  try {
    const { product_id } = req.body;
    const file = req.file;

    console.log("Uploaded file:", file);
    console.log("Product ID:", product_id);
    pool.query(
      `INSERT INTO products (product_id, image_name, mimetype, size, created_by) VALUES (?,?,?,?,?)`,
      [],
      function (error, result) {
        if (error) {
          console.log(error);
        } else {
          res
            .status(200)
            .json({ message: "File uploaded successfully", data: result });
        }
      }
    );
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ message: "Error uploading file" });
  }
});

router.get("/fetch-products", function (req, res) {
  pool.query(`SELECT * FROM Products`, function (error, results) {
    if (error) {
      console.log(error);
      res.status(500).json({ message: "Error fetching products" });
    } else {
      res.status(200).json({ data: results });
    }
  });
});

router.put("/update-product/:id", (req, res) => {
  const productId = req.params.id;
  const {
    product_name,
    product_description,
    price,
    discount,
    stock,
    trending,
    new_arrival,
    top_selling,
    category,
    occasion,
    craft,
    fabric,
    color,
    origin,
    brand,
    created_by,
  } = req.body;
  console.log(req.body);

  pool.query(
    `UPDATE Products SET product_name=?, product_description=?, price=?, discount=?, stock=?, trending=?, new_arrival=?, top_selling=?, category=?, occasion=?, craft=?, fabric=?, color=?, origin=?, brand=?, created_by=? WHERE product_id=?`,
    [
      product_name,
      product_description,
      price,
      discount,
      stock,
      trending,
      new_arrival,
      top_selling,
      category,
      occasion,
      craft,
      fabric,
      color,
      origin,
      brand,
      created_by,
      productId,
    ],
    (error, result) => {
      if (error) {
        console.error("Error updating product:", error);
        res
          .status(500)
          .json({ message: "Error updating product", error: error.message });
      } else {
        res
          .status(200)
          .json({ data: result, message: "Product successfully updated" });
      }
    }
  );
});

router.delete("/delete-product/:id", (req, res) => {
  const productId = req.params.id;

  pool.query(
    `DELETE FROM Products WHERE product_id=?`,
    [productId],
    (error, result) => {
      if (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Error deleting product" });
      } else {
        res
          .status(200)
          .json({ data: result, message: "Product successfully deleted" });
      }
    }
  );
});

module.exports = router;
