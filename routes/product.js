var express = require("express");
var router = express.Router();
var pool = require("./pool/pool.js");
var upload = require("./multer/multer.js");

// router.post("/add-product", function (req, res) {
//   const {
//     product_name,
//     product_description,
//     price,
//     discount,
//     stock,
//     new_arrival,
//     top_selling,
//     category,
//     occasion,
//     craft,
//     fabric,
//     color,
//     origin,
//     brand,
//     Trending: trend,
//     created_by,
//   } = req.body;

//   console.log("backend data", req.body);
//   pool.query(
//     `INSERT INTO Products (product_name, product_description, price, discount, stock, trending, new_arrival, top_selling, category, occasion, craft, fabric, color, origin, brand, created_by) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
//     [
//       product_name,
//       product_description,
//       price,
//       discount,
//       stock,
//       trend,
//       new_arrival,
//       top_selling,
//       category,
//       occasion,
//       craft,
//       fabric,
//       color,
//       origin,
//       brand,
//       created_by,
//     ],
//     function (error, result) {
//       if (error) {
//         console.log(error);
//         res.status(500).json({ message: "Error adding product" });
//       } else {
//         res
//           .status(200)
//           .json({ data: result, message: "Product successfully added" });
//       }
//     }
//   );
// });

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

  console.log("backend data", req.body);
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

// Route to handle file upload
router.post("/upload-file", upload.single("file"), function (req, res) {
  try {
    const { file } = req;
    const { product_id, created_by } = req.body;
    console.log("body file ", req.body);

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (!product_id) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    pool.query(
      `INSERT INTO product_images (product_id, image_name, mimetype, size, created_by) VALUES (?, ?, ?, ?, ?)`,
      [product_id, file.filename, file.mimetype, file.size, created_by],
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
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/fetch_All_Products", function (req, res) {
  const sql = "SELECT * FROM products";

  pool.query(sql, function (err, result) {
    if (err) {
      console.error("Error fetching data:", err);
      return res.status(500).json({ message: "Failed to fetch data" });
    }
    res
      .status(200)
      .json({ data: result, message: "product Fetch Succesfully" });
  });
});

router.get("/fetch-AllProductsWithImage", function (req, res) {
  const query = `
    SELECT p.*, pi.image_name, pi.mimetype, pi.size
    FROM Products p
    LEFT JOIN product_images pi ON p.product_id = pi.product_id
  `;

  pool.query(query, function (error, results) {
    if (error) {
      console.log(error);
      res.status(500).json({ message: "Error fetching products" });
    } else {
      // Process the results to group images with their corresponding products
      const products = results.reduce((acc, row) => {
        // If product is not already in the accumulator, add it
        if (!acc[row.product_id]) {
          acc[row.product_id] = {
            product_id: row.product_id,
            product_name: row.product_name,
            product_description: row.product_description,
            price: row.price,
            discount: row.discount,
            stock: row.stock,
            trending: row.trending,
            new_arrival: row.new_arrival,
            top_selling: row.top_selling,
            category: row.category,
            occasion: row.occasion,
            craft: row.craft,
            fabric: row.fabric,
            color: row.color,
            origin: row.origin,
            brand: row.brand,
            created_at: row.created_at,
            updated_at: row.updated_at,
            created_by: row.created_by,
            images: [], // Initialize images array
          };
        }

        if (row.image_name) {
          acc[row.product_id].images.push({
            image_name: row.image_name,
            mimetype: row.mimetype,
            size: row.size,
            created_at: row.image_created_at,
            updated_at: row.image_updated_at,
            created_by: row.image_created_by,
          });
        }

        return acc;
      }, {});

      const productsArray = Object.values(products);

      res.status(200).json({
        data: productsArray,
        message: "Products fetched successfully with images",
      });
    }
  });
});

router.get("/fetch_all_Images", function (req, res) {
  let query = `
    SELECT p.*, pi.image_name, pi.mimetype, pi.size, pi.created_at AS image_created_at, pi.updated_at AS image_updated_at, pi.created_by AS image_created_by
    FROM Products p
    LEFT JOIN product_images pi ON p.product_id = pi.product_id
  `;

  pool.query(query, [], function (error, results) {
    if (error) {
      console.log(error);
      res.status(500).json({ message: "Error fetching products" });
    } else {
      // Process the results to group images with their corresponding products
      const products = results.reduce((acc, row) => {
        // If product is not already in the accumulator, add it
        if (!acc[row.product_id]) {
          acc[row.product_id] = {
            product_id: row.product_id,
            product_name: row.product_name,
            product_description: row.product_description,
            price: row.price,
            discount: row.discount,
            stock: row.stock,
            trending: row.trending,
            new_arrival: row.new_arrival,
            top_selling: row.top_selling,
            category: row.category,
            occasion: row.occasion,
            craft: row.craft,
            fabric: row.fabric,
            color: row.color,
            origin: row.origin,
            brand: row.brand,
            created_at: row.created_at,
            updated_at: row.updated_at,
            created_by: row.created_by,
            images: [], // Initialize images array
          };
        }

        if (row.image_name) {
          acc[row.product_id].images.push({
            image_name: row.image_name,
            mimetype: row.mimetype,
            size: row.size,
            created_at: row.image_created_at,
            updated_at: row.image_updated_at,
            created_by: row.image_created_by,
          });
        }

        return acc;
      }, {});

      const productsArray = Object.values(products);

      res.status(200).json({
        data: productsArray,
        message: "Products fetched successfully with images",
      });
    }
  });
});

router.post("/fetch-products", function (req, res) {
  const {
    colors,
    brands,
    crafts,
    fabrics,
    origins,
    minPrice,
    maxPrice,
    categoryName,
  } = req.body;
  console.log(req.body);
  let query = `
    SELECT p.*, pi.image_name, pi.mimetype, pi.size, pi.created_at AS image_created_at, pi.updated_at AS image_updated_at, pi.created_by AS image_created_by
    FROM Products p
    LEFT JOIN product_images pi ON p.product_id = pi.product_id
    WHERE p.category = ?
  `;
  let queryParams = [categoryName];

  if (colors) {
    const colorFilter = colors
      .split(",")
      .map((color) => `'${color}'`)
      .join(",");
    query += ` AND p.color IN (${colorFilter})`;
  }

  if (brands) {
    const brandFilter = brands
      .split(",")
      .map((brand) => `'${brand}'`)
      .join(",");
    query += ` AND p.brand IN (${brandFilter})`;
  }

  if (crafts) {
    const craftFilter = crafts
      .split(",")
      .map((craft) => `'${craft}'`)
      .join(",");
    query += ` AND p.craft IN (${craftFilter})`;
  }

  if (fabrics) {
    const fabricFilter = fabrics
      .split(",")
      .map((fabric) => `'${fabric}'`)
      .join(",");
    query += ` AND p.fabric IN (${fabricFilter})`;
  }

  if (origins) {
    const originFilter = origins
      .split(",")
      .map((origin) => `'${origin}'`)
      .join(",");
    query += ` AND p.origin IN (${originFilter})`;
  }

  // if (minPrice) {
  //   query += ` AND p.price >= ?`;
  //   queryParams.push(minPrice);
  // }

  // if (maxPrice) {
  //   query += ` AND p.price <= ?`;
  //   queryParams.push(maxPrice);
  // }

  pool.query(query, queryParams, function (error, results) {
    if (error) {
      console.log(error);
      res.status(500).json({ message: "Error fetching products" });
    } else {
      // Process the results to group images with their corresponding products
      const products = results.reduce((acc, row) => {
        // If product is not already in the accumulator, add it
        if (!acc[row.product_id]) {
          acc[row.product_id] = {
            product_id: row.product_id,
            product_name: row.product_name,
            product_description: row.product_description,
            price: row.price,
            discount: row.discount,
            stock: row.stock,
            trending: row.trending,
            new_arrival: row.new_arrival,
            top_selling: row.top_selling,
            category: row.category,
            occasion: row.occasion,
            craft: row.craft,
            fabric: row.fabric,
            color: row.color,
            origin: row.origin,
            brand: row.brand,
            created_at: row.created_at,
            updated_at: row.updated_at,
            created_by: row.created_by,
            images: [], // Initialize images array
          };
        }

        if (row.image_name) {
          acc[row.product_id].images.push({
            image_name: row.image_name,
            mimetype: row.mimetype,
            size: row.size,
            created_at: row.image_created_at,
            updated_at: row.image_updated_at,
            created_by: row.image_created_by,
          });
        }

        return acc;
      }, {});

      const productsArray = Object.values(products);
      console.log("productarray", productsArray);

      res.status(200).json({
        data: productsArray,
        message: "Products fetched successfully with images",
      });
    }
  });
});

// fetch trending products
router.get("/fetch-Trendingproducts", function (req, res) {
  const query = `
    SELECT p.*, pi.image_name, pi.mimetype, pi.size
    FROM Products p
    LEFT JOIN product_images pi ON p.product_id = pi.product_id
    WHERE p.trending = 1
  `;

  pool.query(query, function (error, results) {
    if (error) {
      console.log(error);
      res.status(500).json({ message: "Error fetching products" });
    } else {
      // Process the results to group images with their corresponding products
      const products = results.reduce((acc, row) => {
        // If product is not already in the accumulator, add it
        if (!acc[row.product_id]) {
          acc[row.product_id] = {
            product_id: row.product_id,
            product_name: row.product_name,
            product_description: row.product_description,
            price: row.price,
            discount: row.discount,
            stock: row.stock,
            trending: row.trending,
            new_arrival: row.new_arrival,
            top_selling: row.top_selling,
            category: row.category,
            occasion: row.occasion,
            craft: row.craft,
            fabric: row.fabric,
            color: row.color,
            origin: row.origin,
            brand: row.brand,
            created_at: row.created_at,
            updated_at: row.updated_at,
            created_by: row.created_by,
            images: [], // Initialize images array
          };
        }

        if (row.image_name) {
          acc[row.product_id].images.push({
            image_name: row.image_name,
            mimetype: row.mimetype,
            size: row.size,
            created_at: row.image_created_at,
            updated_at: row.image_updated_at,
            created_by: row.image_created_by,
          });
        }

        return acc;
      }, {});

      const productsArray = Object.values(products);

      res.status(200).json({
        data: productsArray,
        message: "Products fetched successfully with images",
      });
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
router.get("/fetch-occasions", (req, res) => {
  pool.query("SELECT * FROM Occasion", (error, results) => {
    if (error) {
      console.error("Error fetching occasions:", error);
      res.status(500).json({ message: "Error fetching occasions" });
    } else {
      res.status(200).json({ data: results });
    }
  });
});

// Update an occasion
router.put("/update-occasion/:id", (req, res) => {
  const { occasion_name, occasion_description, started_at, ended_at } =
    req.body;
  const { id } = req.params;

  pool.query(
    `UPDATE Occasion SET occasion_name=?, occasion_description=?, started_at=?, ended_at=? WHERE occasion_id=?`,
    [occasion_name, occasion_description, started_at, ended_at, id],
    (error, results) => {
      if (error) {
        console.error(`Error updating occasion ${id}:`, error);
        res.status(500).json({ message: `Error updating occasion ${id}` });
      } else {
        res
          .status(200)
          .json({ message: `Occasion ${id} updated successfully` });
      }
    }
  );
});

// Delete an occasion
router.delete("/delete-occasion/:id", (req, res) => {
  const { id } = req.params;

  pool.query(
    "DELETE FROM Occasion WHERE occasion_id=?",
    [id],
    (error, results) => {
      if (error) {
        console.error(`Error deleting occasion ${id}:`, error);
        res.status(500).json({ message: `Error deleting occasion ${id}` });
      } else {
        res
          .status(200)
          .json({ message: `Occasion ${id} deleted successfully` });
      }
    }
  );
});

// Endpoint for adding a craft
router.post("/add-craft", function (req, res) {
  const { craft_name, craft_description, created_by } = req.body;

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
router.get("/fetch-crafts", (req, res) => {
  pool.query("SELECT * FROM Craft", (error, results) => {
    if (error) {
      console.error("Error fetching crafts:", error);
      res.status(500).json({ message: "Error fetching crafts" });
    } else {
      res.status(200).json({ data: results });
    }
  });
});

// Update a craft
router.put("/update-craft/:id", (req, res) => {
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
router.delete("/delete-craft/:id", (req, res) => {
  const { id } = req.params;

  pool.query("DELETE FROM Craft WHERE craft_id=?", [id], (error, results) => {
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
  const { fabric_name, fabric_description, created_by } = req.body;

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
router.get("/fetch-fabrics", (req, res) => {
  pool.query("SELECT * FROM Fabric", (error, results) => {
    if (error) {
      console.error("Error fetching fabrics:", error);
      res.status(500).json({ message: "Error fetching fabrics" });
    } else {
      res.status(200).json({ data: results });
    }
  });
});

// Update a fabric
router.put("/update-fabric/:id", (req, res) => {
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
router.delete("/delete-fabric/:id", (req, res) => {
  const { id } = req.params;

  pool.query("DELETE FROM Fabric WHERE fabric_id=?", [id], (error, results) => {
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
  const { color_name, color_code, created_by } = req.body;

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
router.get("/fetch-colors", (req, res) => {
  pool.query("SELECT * FROM Color", (error, results) => {
    if (error) {
      console.error("Error fetching colors:", error);
      res.status(500).json({ message: "Error fetching colors" });
    } else {
      res.status(200).json({ data: results });
    }
  });
});

// Update a color
router.put("/update-color/:id", (req, res) => {
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
router.delete("/delete-color/:id", (req, res) => {
  const { id } = req.params;

  pool.query("DELETE FROM Color WHERE color_id=?", [id], (error, results) => {
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
  const { country_name, region_name, origin_description, created_by } =
    req.body;

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
router.get("/fetch-origins", (req, res) => {
  pool.query("SELECT * FROM Origin", (error, results) => {
    if (error) {
      console.error("Error fetching origins:", error);
      res.status(500).json({ message: "Error fetching origins" });
    } else {
      res.status(200).json({ data: results });
    }
  });
});

// Update an origin
router.put("/update-origin/:id", (req, res) => {
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
router.delete("/delete-origin/:id", (req, res) => {
  const { id } = req.params;

  pool.query("DELETE FROM Origin WHERE origin_id=?", [id], (error, results) => {
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
  const { brand_name, brand_description, created_by } = req.body;

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
router.get("/fetch-brands", (req, res) => {
  pool.query("SELECT * FROM Brand", (error, results) => {
    if (error) {
      console.error("Error fetching brands:", error);
      res.status(500).json({ message: "Error fetching brands" });
    } else {
      res.status(200).json({ data: results });
    }
  });
});

// Update a brand
router.put("/update-brand/:id", (req, res) => {
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
router.delete("/delete-brand/:id", (req, res) => {
  const { id } = req.params;

  pool.query("DELETE FROM Brand WHERE brand_id=?", [id], (error, results) => {
    if (error) {
      console.error(`Error deleting brand ${id}:`, error);
      res.status(500).json({ message: `Error deleting brand ${id}` });
    } else {
      res.status(200).json({ message: `Brand ${id} deleted successfully` });
    }
  });
});

module.exports = router;
