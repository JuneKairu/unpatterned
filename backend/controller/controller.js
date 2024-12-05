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

    const deleteTransactionsSql = `
        DELETE FROM tbl_transaction_details 
        WHERE product_id = ?;
    `;
    const deleteProductSql = `
        DELETE FROM tbl_products 
        WHERE product_id = ?;
    `;

    // Delete related rows in tbl_transaction_details first
    db.query(deleteTransactionsSql, [product_id], (err, transactionResult) => {
        if (err) {
            console.error("Error deleting related transaction details:", err);
            return res.status(500).json({ message: "Error deleting related transaction details", error: err });
        }

        // Then delete the product
        db.query(deleteProductSql, [product_id], (err, productResult) => {
            if (err) {
                console.error("Error deleting product:", err);
                return res.status(500).json({ message: "Error deleting product", error: err });
            }

            if (productResult.affectedRows === 0) {
                return res.status(404).json({ message: "Product not found" });
            }

            res.status(200).json({ message: "Product and related transaction details deleted successfully" });
        });
    });
}
//try new
exports.CreateTransaction = (req, res) => {
    const { transaction_id, created_at, products, total_amount } = req.body;

    // First, insert the transaction record
    const transactionSql = "INSERT INTO tbl_transactions (transaction_id, created_at, total_amount) VALUES (?, ?, ?)";
    
    db.query(transactionSql, [transaction_id, created_at, total_amount], (err, transactionResult) => {
        if (err) {
            console.error("Error creating transaction:", err);
            return res.status(500).json({ 
                success: false, 
                message: "Error creating transaction", 
                error: err.message 
            });
        }

        // Array to store all update promises
        let completedUpdates = 0;
        let hasError = false;

        // Process each product
        products.forEach(product => {
            // Update product quantity
            const updateProductSql = "UPDATE tbl_products SET quantity = quantity - ? WHERE product_id = ?";
            
            db.query(updateProductSql, [product.quantity, product.product_id], (updateErr, updateResult) => {
                if (updateErr) {
                    hasError = true;
                    console.error("Error updating product quantity:", updateErr);
                    return res.status(500).json({
                        success: false,
                        message: "Error updating product quantity",
                        error: updateErr.message
                    });
                }

                // Insert transaction detail
                const detailSql = "INSERT INTO tbl_transaction_details (transaction_id, product_id, quantity) VALUES (?, ?, ?)";
                
                db.query(detailSql, [transaction_id, product.product_id, product.quantity], (detailErr, detailResult) => {
                    if (detailErr) {
                        hasError = true;
                        console.error("Error inserting transaction detail:", detailErr);
                        return res.status(500).json({
                            success: false,
                            message: "Error inserting transaction detail",
                            error: detailErr.message
                        });
                    }

                    completedUpdates++;

                    // If all updates are completed and no errors occurred, send success response
                    if (completedUpdates === products.length && !hasError) {
                        res.status(200).json({
                            success: true,
                            message: "Transaction completed successfully",
                            transaction_id
                        });
                    }
                });
            });
        });
    });
};

exports.GetTransaction = (req, res) => {
    const { transaction_id } = req.params;
    
    const sql = `
        SELECT 
            t.transaction_id,
            t.created_at,
            t.total_amount,
            td.product_id,
            td.quantity,
            p.product_name,
            p.price
        FROM tbl_transactions t
        JOIN tbl_transaction_details td ON t.transaction_id = td.transaction_id
        JOIN tbl_products p ON td.product_id = p.product_id
        WHERE t.transaction_id = ?
    `;
    
    db.query(sql, [transaction_id], (err, data) => {
        if (err) {
            console.error("Error fetching transaction:", err);
            return res.status(500).json({ 
                success: false, 
                message: "Error fetching transaction", 
                error: err.message 
            });
        }
        return res.json({
            success: true,
            data: data
        });
    });
};
//added 11/25/24
// Add this function to your existing controller.js

// Add this function to your existing controller.js
exports.getSalesData = (req, res) => {
    const { startDate, endDate } = req.query;

    let sql = `
        SELECT 
            t.transaction_id,
            t.created_at AS created_date,
            t.total_amount
        FROM tbl_transactions t
    `;

    const queryParams = [];

    // Apply date filter if both startDate and endDate are provided
    if (startDate && endDate) {
        sql += ' WHERE DATE(t.created_at) BETWEEN ? AND ?';
        queryParams.push(startDate, endDate);
    }

    sql += ' ORDER BY t.created_at DESC';

    db.query(sql, queryParams, (err, data) => {
        if (err) {
            console.error("Error fetching sales data:", err);
            return res.status(500).json({ 
                success: false, 
                message: "Error fetching sales data", 
                error: err.message 
            });
        }
        return res.json({
            success: true,
            data: data
        });
    });
};
// added 12/4/24
exports.getTopSellingProducts = (req, res) => {
    const { startDate, endDate } = req.query;

    let sql = `
        SELECT 
            p.product_name AS product_name,
            SUM(td.quantity) AS total_quantity,
            ROUND(SUM(td.quantity * td.price), 2) AS total_revenue
        FROM tbl_transaction_details td
        JOIN tbl_transactions t ON td.transaction_id = t.transaction_id
        JOIN tbl_products p ON td.product_id = p.product_id
    `;

    const queryParams = [];

    // Apply date filter if both startDate and endDate are provided
    if (startDate && endDate) {
        sql += ' WHERE DATE(t.created_at) BETWEEN ? AND ?';
        queryParams.push(startDate, endDate);
    }

    sql += `
        GROUP BY p.product_name
        ORDER BY total_quantity DESC
        LIMIT 10
    `;

    db.query(sql, queryParams, (err, data) => {
        if (err) {
            console.error("Error fetching top-selling products:", err);
            return res.status(500).json({
                success: false,
                message: "Error fetching top-selling products",
                error: err.message,
            });
        }

        // Format revenue to ensure no NaN or duplicate values
        const formattedData = data.map(product => ({
            product_name: product.product_name,
            total_quantity: product.total_quantity,
            total_revenue: product.total_revenue ? parseFloat(product.total_revenue).toFixed(2) : "0.00",
        }));

        return res.json({
            success: true,
            topProducts: formattedData,
        });
    });
};
