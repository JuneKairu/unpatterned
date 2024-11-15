const db = require('../dbconnect');

// Signup function
exports.Signup = (req, res) => {
    const sql = "INSERT INTO tb_logins (email, password) VALUES (?)";
    const values = [req.body.email, req.body.password];
    
    db.query(sql, [values], (err, data) => {
        if (err) {
            console.error("Signup error:", err); // Log error for debugging
            return res.json({ message: "Error during signup", error: err });
        }
        return res.json({ message: "Signup successful", data });
    });
};

// Login function
exports.Login = (req, res) => {
    const sql = "SELECT * FROM tb_logins WHERE email = ? AND password = ?";
    const values = [req.body.email, req.body.password];
    
    db.query(sql, values, (err, data) => {
        if (err) {
            console.error("Login error:", err); // Log error for debugging
            return res.json({ message: "Error during login attempt", error: err });
        }
        if (data.length > 0) {
            return res.json(data);
        } else {
            return res.status(401).json({ message: "Invalid credentials" });
        }
    });
};

// Add product
exports.AddProduct = (req, res) => {
    const { product_name, price, quantity, category_id} = req.body;
    const sql = "INSERT INTO tbl_products (product_name, price, quantity, category_id) VALUES (?, ?, ?, ?)";
    
    db.query(sql, [product_name, price, quantity, category_id ], (err, result) => {
        if (err) {
            console.error("Error adding product:", err);
            return res.status(500).json({ message: "Error adding product", error: err });
        }
        
        // Fetch the newly created product to return
        const fetchSql = "SELECT p.*, c.category_name FROM tbl_products p JOIN tbl_productcategory c ON p.category_id = c.category_id WHERE p.product_id = ?";
        db.query(fetchSql, [result.insertId], (fetchErr, product) => {
            if (fetchErr) {
                return res.status(500).json({ message: "Product added but failed to fetch details" });
            }
            return res.status(200).json({
                message: "Product added successfully",
                data: product[0]
            });
        });
    });
};

exports.AddCategory = (req, res) => {
    const { category_name } = req.body;
    const sql = "INSERT INTO tbl_productcategory (category_name) VALUES (?)";
    
    db.query(sql, [category_name], (err, result) => {
        if (err) {
            console.error("Error adding category:", err);
            return res.status(500).json({ message: "Error adding category", error: err });
        }
        
        // Fetch the newly created category to return
        const fetchSql = "SELECT * FROM tbl_productcategory WHERE category_id = ?";
        db.query(fetchSql, [result.insertId], (fetchErr, category) => {
            if (fetchErr) {
                return res.status(500).json({ message: "Category added but failed to fetch details" });
            }
            return res.status(200).json({
                message: "Category added successfully",
                data: category[0]
            });
        });
    });
};

exports.GetCategories = (req, res) => {
    const sql = "SELECT * FROM tbl_productcategory";
    db.query(sql, (err, data) => {
        if (err) {
            console.error("Error fetching categories:", err);
            return res.status(500).json({ message: "Error fetching categories", error: err });
        }
        return res.json(data);
    });
};

exports.ViewProducts = (req, res) => {
    const { category_id } = req.params;
    const sql = `
        SELECT p.*, c.category_name 
        FROM tbl_products p 
        JOIN tbl_productcategory c ON p.category_id = c.category_id 
        WHERE p.category_id = ?
    `;
    
    db.query(sql, [category_id], (err, data) => {
        if (err) {
            console.error("Error fetching products:", err);
            return res.status(500).json({ message: "Error fetching products", error: err });
        }
        return res.json(data);
    });
};

//newly added 
// Controller to get all categories from `tbl_productcategory`
exports.getAllCategories = (req, res) => {
    const sql = 'SELECT category_id AS id, category_name AS displayName FROM tbl_productcategory';
    db.query(sql, (err, data) => {
      if (err) {
        console.error('Error fetching categories:', err);
        res.status(500).json({ message: 'Error fetching categories' });
      } else {
        res.json(data);
      }
    });
  };
  
  exports.getProductsByCategoryId = (req, res) => {
    const { category_id } = req.params;
    const sql = 'SELECT product_id AS id, product_name AS name, price FROM tbl_products WHERE category_id = ?';
    db.query(sql, [category_id], (err, data) => {
      if (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ message: 'Error fetching products' });
      } else {
        res.json(data);
      }
    });
  };
  


 // new add 
 // Update product by product_id
exports.UpdateProduct = (req, res) => {
  const { product_id } = req.params;
  const { product_name, price, quantity, category_id } = req.body;

  const sql = `
      UPDATE tbl_products 
      SET product_name = ?, price = ?, quantity = ?, category_id = ? 
      WHERE product_id = ?
  `;

  db.query(sql, [product_name, price, quantity, category_id, product_id], (err, result) => {
      if (err) {
          console.error("Error updating product:", err);
          return res.status(500).json({ message: "Error updating product", error: err });
      }
      
      if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Product not found" });
      }
      
      res.status(200).json({ message: "Product updated successfully" });
  });
};

// Delete product by product_id
exports.DeleteProduct = (req, res) => {
  const { product_id } = req.params;

  const sql = "DELETE FROM tbl_products WHERE product_id = ?";
  
  db.query(sql, [product_id], (err, result) => {
      if (err) {
          console.error("Error deleting product:", err);
          return res.status(500).json({ message: "Error deleting product", error: err });
      }

      if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Product not found" });
      }

      res.status(200).json({ message: "Product deleted successfully" });
  });
};
