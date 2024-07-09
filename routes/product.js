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

// Endpoint for adding an occasion
router.post("/add-occasion", function (req, res) {
  console.log(req.body);
  const {
    occasion_name,
    occasion_description,
    started_at,
    ended_at,
    created_by,
  } = req.body;

  pool.query(
    `INSERT INTO Occasion (occasion_name, occasion_description, started_at, ended_at, created_by) VALUES (?, ?, ?, ?, ?)`,
    [occasion_name, occasion_description, started_at, ended_at, created_by],
    function (error, result) {
      if (error) {
        console.error("Error adding occasion:", error);
        res.status(500).json({ message: "Error adding occasion" });
      } else {
        res.status(200).json({
          data: result,
          message: "Occasion successfully added",
        });
      }
    }
  );
});

// Fetch all occasions
router.get('/fetch-occasions', (req, res) => {
  pool.query('SELECT * FROM Occasion', (error, results) => {
    if (error) {
      console.error('Error fetching occasions:', error);
      res.status(500).json({ message: 'Error fetching occasions' });
    } else {
      res.status(200).json({ data: results });
    }
  });
});

// Update an occasion
router.put('/update-occasion/:id', (req, res) => {
  const { occasion_name, occasion_description, started_at, ended_at } = req.body;
  const { id } = req.params;

  pool.query(
    `UPDATE Occasion SET occasion_name=?, occasion_description=?, started_at=?, ended_at=? WHERE occasion_id=?`,
    [occasion_name, occasion_description, started_at, ended_at, id],
    (error, results) => {
      if (error) {
        console.error(`Error updating occasion ${id}:`, error);
        res.status(500).json({ message: `Error updating occasion ${id}` });
      } else {
        res.status(200).json({ message: `Occasion ${id} updated successfully` });
      }
    }
  );
});

// Delete an occasion
router.delete('/delete-occasion/:id', (req, res) => {
  const { id } = req.params;

  pool.query('DELETE FROM Occasion WHERE occasion_id=?', [id], (error, results) => {
    if (error) {
      console.error(`Error deleting occasion ${id}:`, error);
      res.status(500).json({ message: `Error deleting occasion ${id}` });
    } else {
      res.status(200).json({ message: `Occasion ${id} deleted successfully` });
    }
  });
});


// Endpoint for adding a craft
router.post("/add-craft", function (req, res) {
  const {
    craft_name,
    craft_description,
    created_by,
  } = req.body;

  pool.query(
    `INSERT INTO Craft (craft_name, craft_description, created_by) VALUES (?, ?, ?)`,
    [craft_name, craft_description, created_by],
    function (error, result) {
      if (error) {
        console.error("Error adding craft:", error);
        res.status(500).json({ message: "Error adding craft" });
      } else {
        res.status(200).json({
          data: result,
          message: "Craft successfully added",
        });
      }
    }
  );
});

// Fetch all crafts
router.get('/fetch-crafts', (req, res) => {
  pool.query('SELECT * FROM Craft', (error, results) => {
    if (error) {
      console.error('Error fetching crafts:', error);
      res.status(500).json({ message: 'Error fetching crafts' });
    } else {
      res.status(200).json({ data: results });
    }
  });
});

// Update a craft
router.put('/update-craft/:id', (req, res) => {
  const { craft_name, craft_description } = req.body;
  const { id } = req.params;

  pool.query(
    `UPDATE Craft SET craft_name=?, craft_description=? WHERE craft_id=?`,
    [craft_name, craft_description, id],
    (error, results) => {
      if (error) {
        console.error(`Error updating craft ${id}:`, error);
        res.status(500).json({ message: `Error updating craft ${id}` });
      } else {
        res.status(200).json({ message: `Craft ${id} updated successfully` });
      }
    }
  );
});

// Delete a craft
router.delete('/delete-craft/:id', (req, res) => {
  const { id } = req.params;

  pool.query('DELETE FROM Craft WHERE craft_id=?', [id], (error, results) => {
    if (error) {
      console.error(`Error deleting craft ${id}:`, error);
      res.status(500).json({ message: `Error deleting craft ${id}` });
    } else {
      res.status(200).json({ message: `Craft ${id} deleted successfully` });
    }
  });
});

// Endpoint for adding fabric
router.post("/add-fabric", function (req, res) {
  const {
    fabric_name,
    fabric_description,
    created_by,
  } = req.body;

  pool.query(
    `INSERT INTO Fabric (fabric_name, fabric_description, created_by) VALUES (?, ?, ?)`,
    [fabric_name, fabric_description, created_by],
    function (error, result) {
      if (error) {
        console.error("Error adding fabric:", error);
        res.status(500).json({ message: "Error adding fabric" });
      } else {
        res.status(200).json({
          data: result,
          message: "Fabric successfully added",
        });
      }
    }
  );
});

// Fetch all fabrics
router.get('/fetch-fabrics', (req, res) => {
  pool.query('SELECT * FROM Fabric', (error, results) => {
    if (error) {
      console.error('Error fetching fabrics:', error);
      res.status(500).json({ message: 'Error fetching fabrics' });
    } else {
      res.status(200).json({ data: results });
    }
  });
});

// Update a fabric
router.put('/update-fabric/:id', (req, res) => {
  const { fabric_name, fabric_description } = req.body;
  const { id } = req.params;

  pool.query(
    `UPDATE Fabric SET fabric_name=?, fabric_description=? WHERE fabric_id=?`,
    [fabric_name, fabric_description, id],
    (error, results) => {
      if (error) {
        console.error(`Error updating fabric ${id}:`, error);
        res.status(500).json({ message: `Error updating fabric ${id}` });
      } else {
        res.status(200).json({ message: `Fabric ${id} updated successfully` });
      }
    }
  );
});

// Delete a fabric
router.delete('/delete-fabric/:id', (req, res) => {
  const { id } = req.params;

  pool.query('DELETE FROM Fabric WHERE fabric_id=?', [id], (error, results) => {
    if (error) {
      console.error(`Error deleting fabric ${id}:`, error);
      res.status(500).json({ message: `Error deleting fabric ${id}` });
    } else {
      res.status(200).json({ message: `Fabric ${id} deleted successfully` });
    }
  });
});

// Endpoint for adding color
router.post("/add-color", function (req, res) {
  const {
    color_name,
    color_code,
    created_by,
  } = req.body;

  pool.query(
    `INSERT INTO Color (color_name, color_code, created_by) VALUES (?, ?, ?)`,
    [color_name, color_code, created_by],
    function (error, result) {
      if (error) {
        console.error("Error adding color:", error);
        res.status(500).json({ message: "Error adding color" });
      } else {
        res.status(200).json({
          data: result,
          message: "Color successfully added",
        });
      }
    }
  );
});

// Fetch all colors
router.get('/fetch-colors', (req, res) => {
  pool.query('SELECT * FROM Color', (error, results) => {
    if (error) {
      console.error('Error fetching colors:', error);
      res.status(500).json({ message: 'Error fetching colors' });
    } else {
      res.status(200).json({ data: results });
    }
  });
});

// Update a color
router.put('/update-color/:id', (req, res) => {
  const { color_name, color_code } = req.body;
  const { id } = req.params;

  pool.query(
    `UPDATE Color SET color_name=?, color_code=? WHERE color_id=?`,
    [color_name, color_code, id],
    (error, results) => {
      if (error) {
        console.error(`Error updating color ${id}:`, error);
        res.status(500).json({ message: `Error updating color ${id}` });
      } else {
        res.status(200).json({ message: `Color ${id} updated successfully` });
      }
    }
  );
});

// Delete a color
router.delete('/delete-color/:id', (req, res) => {
  const { id } = req.params;

  pool.query('DELETE FROM Color WHERE color_id=?', [id], (error, results) => {
    if (error) {
      console.error(`Error deleting color ${id}:`, error);
      res.status(500).json({ message: `Error deleting color ${id}` });
    } else {
      res.status(200).json({ message: `Color ${id} deleted successfully` });
    }
  });
});


// Endpoint for adding origin
router.post("/add-origin", function (req, res) {
  const {
    country_name,
    region_name,
    origin_description,
    created_by,
  } = req.body;

  pool.query(
    `INSERT INTO Origin (country_name, region_name, origin_description, created_by) VALUES (?, ?, ?, ?)`,
    [country_name, region_name, origin_description, created_by],
    function (error, result) {
      if (error) {
        console.error("Error adding origin:", error);
        res.status(500).json({ message: "Error adding origin" });
      } else {
        res.status(200).json({
          data: result,
          message: "Origin successfully added",
        });
      }
    }
  );
});

// Fetch all origins
router.get('/fetch-origins', (req, res) => {
  pool.query('SELECT * FROM Origin', (error, results) => {
    if (error) {
      console.error('Error fetching origins:', error);
      res.status(500).json({ message: 'Error fetching origins' });
    } else {
      res.status(200).json({ data: results });
    }
  });
});

// Update an origin
router.put('/update-origin/:id', (req, res) => {
  const { country_name, region_name, origin_description } = req.body;
  const { id } = req.params;

  pool.query(
    `UPDATE Origin SET country_name=?, region_name=?, origin_description=? WHERE origin_id=?`,
    [country_name, region_name, origin_description, id],
    (error, results) => {
      if (error) {
        console.error(`Error updating origin ${id}:`, error);
        res.status(500).json({ message: `Error updating origin ${id}` });
      } else {
        res.status(200).json({ message: `Origin ${id} updated successfully` });
      }
    }
  );
});

// Delete an origin
router.delete('/delete-origin/:id', (req, res) => {
  const { id } = req.params;

  pool.query('DELETE FROM Origin WHERE origin_id=?', [id], (error, results) => {
    if (error) {
      console.error(`Error deleting origin ${id}:`, error);
      res.status(500).json({ message: `Error deleting origin ${id}` });
    } else {
      res.status(200).json({ message: `Origin ${id} deleted successfully` });
    }
  });
});


// Endpoint for adding brand
router.post("/add-brand", function (req, res) {
  const {
    brand_name,
    brand_description,
    created_by,
  } = req.body;

  pool.query(
    `INSERT INTO Brand (brand_name, brand_description,  created_by) VALUES (?, ?, ?)`,
    [brand_name, brand_description, created_by],
    function (error, result) {
      if (error) {
        console.error("Error adding brand:", error);
        res.status(500).json({ message: "Error adding brand" });
      } else {
        res.status(200).json({
          data: result,
          message: "Brand successfully added",
        });
      }
    }
  );
});

// Fetch all brands
router.get('/fetch-brands', (req, res) => {
  pool.query('SELECT * FROM Brand', (error, results) => {
    if (error) {
      console.error('Error fetching brands:', error);
      res.status(500).json({ message: 'Error fetching brands' });
    } else {
      res.status(200).json({ data: results });
    }
  });
});

// Update a brand
router.put('/update-brand/:id', (req, res) => {
  const { brand_name, brand_description } = req.body;
  const { id } = req.params;

  pool.query(
    `UPDATE Brand SET brand_name=?, brand_description=? WHERE brand_id=?`,
    [brand_name, brand_description, id],
    (error, results) => {
      if (error) {
        console.error(`Error updating brand ${id}:`, error);
        res.status(500).json({ message: `Error updating brand ${id}` });
      } else {
        res.status(200).json({ message: `Brand ${id} updated successfully` });
      }
    }
  );
});

// Delete a brand
router.delete('/delete-brand/:id', (req, res) => {
  const { id } = req.params;

  pool.query('DELETE FROM Brand WHERE brand_id=?', [id], (error, results) => {
    if (error) {
      console.error(`Error deleting brand ${id}:`, error);
      res.status(500).json({ message: `Error deleting brand ${id}` });
    } else {
      res.status(200).json({ message: `Brand ${id} deleted successfully` });
    }
  });
});

module.exports = router;
