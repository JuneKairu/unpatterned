const db = require('../dbconnect');
const bcrypt = require('bcrypt'); 
// Signup function
exports.Signup = async (req, res) => {
    try {
        const email = req.body.email;

        db.query('SELECT email FROM tb_logins WHERE email = ?', [email], async (err, result) => {
            if (err) {
                console.error("Error checking for existing email:", err);
                return res.status(500).json({ message: "Database error during signup" }); 
            }

            if (result.length > 0) {
                return res.status(409).json({ message: "Email already exists" }); // 409 Conflict
            }

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

            const sql = "INSERT INTO tb_logins (email, password) VALUES (?, ?)";
            const values = [email, hashedPassword];

            db.query(sql, values, (err, data) => {
                if (err) {
                    console.error("Signup error:", err);
                    return res.status(500).json({ message: "Error during signup" });
                }
                return res.status(201).json({ message: "Signup successful", data }); 
            });
        });

    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({ message: "Error during signup" });
    }
};
//////
exports.getAccounts = (req, res) => {
    const sql = "SELECT id, email FROM tb_logins"; // Fetch only id and email
    db.query(sql, (err, data) => {
        if (err) {
            console.error("Error fetching accounts:", err);
            return res.status(500).json({ message: "Error fetching accounts" });
        }
        return res.json(data); 
    });
};

exports.deleteAccount = (req, res) => {
    const accountId = req.params.accountId;
    const sql = "DELETE FROM tb_logins WHERE id = ?";
    db.query(sql, [accountId], (err, result) => {
        if (err) {
            console.error("Error deleting account:", err);
            return res.status(500).json({ message: "Error deleting account" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Account not found" });
        }
        return res.json({ message: "Account deleted successfully" });
    });
};
exports.updateAccount = (req, res) => {
    const accountId = req.params.accountId; // Unique identifier for the account
    const { email, password } = req.body;  // Updated data from the request body

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    const updateAccountSql = "UPDATE tb_logins SET email = ?, password = ? WHERE id = ?";

    db.query(updateAccountSql, [email, password, accountId], (err, result) => {
        if (err) {
            console.error("Error updating account:", err);
            return res.status(500).json({ message: "Error updating account." });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Account not found." });
        }

        return res.status(200).json({ message: "Account updated successfully!" });
    });
};

////



exports.Login = (req, res) => {
    const sql = "SELECT * FROM tb_logins WHERE email = ?";
    const values = [req.body.email];

    db.query(sql, values, (err, data) => {
        if (err) {
            console.error("Login error:", err); // Log error for debugging
            return res.json({ message: "Error during login attempt", error: err });
        }
        if (data.length > 0) {
            const user = data[0];
            // Compare the plaintext password with the hashed password
            bcrypt.compare(req.body.password, user.password, (bcryptErr, isMatch) => {
                if (bcryptErr) {
                    console.error("Bcrypt error:", bcryptErr);
                    return res.status(500).json({ message: "Internal server error" });
                }
                if (isMatch) {
                    // Successful login
                    return res.json(user);
                } else {
                    // Invalid password
                    return res.status(401).json({ message: "Invalid email or password" });
                }
            });
        } else {
            // Email not found
            return res.status(401).json({ message: "Invalid email or password" });
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

exports.getAllProducts = (req, res) => {
    const sql = `
      SELECT p.*, c.category_name 
      FROM tbl_products p 
      JOIN tbl_productcategory c ON p.category_id = c.category_id
    `;
    db.query(sql, (err, data) => {
      if (err) {
        console.error("Error fetching all products:", err);
        return res.status(500).json({ message: "Error fetching all products", error: err });
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
//added 12/7/24
// Add a new delivery
exports.addDelivery = async (req, res) => {
    try {
        const {
            delivery_date,
            delivery_time,
            supplier,
            product_id,
            quantity,
            price,
            total_amount,
            contact_number
        } = req.body;

        const query = `
            INSERT INTO tbl_deliveries (
                delivery_date,
                delivery_time,
                supplier,
                product_id,
                quantity,
                price,
                total_amount,
                contact_number
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        await db.query(query, [
            delivery_date,
            delivery_time,
            supplier,
            product_id,
            quantity,
            price,
            total_amount,
            contact_number
        ]);

        res.status(201).json({ message: 'Delivery added successfully!' });
    } catch (error) {
        console.error('Error adding delivery:', error);
        res.status(500).json({ message: 'Failed to add delivery', error });
    }
};

// Get all deliveries
exports.getAllDeliveries = async (req, res) => {
    try {
        const query = `
            SELECT d.*, p.product_name 
            FROM tbl_deliveries d 
            LEFT JOIN tbl_products p ON d.product_id = p.product_id
        `;
        
        db.query(query, (error, results) => {
            if (error) {
                console.error('Query error:', error);
                return res.status(500).json({ message: 'Database error', error: error.message });
            }
            res.status(200).json(results || []);
        });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Failed to fetch deliveries' });
    }
};

// 12/26/24 added 

// And add these controller functions:
exports.getInventory = async (req, res) => {
    try {
      const query = 'SELECT * FROM tbl_products';
      db.query(query, (err, results) => {
        if (err) {
          console.error('Error fetching inventory:', err);
          return res.status(500).json({ message: 'Failed to fetch inventory', error: err });
        }
        res.json(results);
      });
    } catch (error) {
      console.error('Error in getInventory:', error);
      res.status(500).json({ message: 'Internal server error', error });
    }
  };
  
  exports.createStockRequest = async (req, res) => {
    const { product_id, quantity, status } = req.body;
    
    try {
      const query = `
        INSERT INTO tbl_stock_requests (product_id, quantity, status, request_date)
        VALUES (?, ?, ?, NOW())
      `;
      
      db.query(query, [product_id, quantity, status], (err, result) => {
        if (err) {
          console.error('Error creating stock request:', err);
          return res.status(500).json({ message: 'Failed to create stock request', error: err });
        }
        res.status(201).json({ message: 'Stock request created successfully', id: result.insertId });
      });
    } catch (error) {
      console.error('Error in createStockRequest:', error);
      res.status(500).json({ message: 'Internal server error', error });
    }
  };

  exports.getLowStockProducts = (req, res) => {
    const query = 'SELECT * FROM tbl_products WHERE quantity < 20';
    
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching low stock products:', err);
        return res.status(500).json({ message: 'Failed to fetch low stock products' });
      }
      res.json(results);
    });
  };

  exports.updateCategory = (req, res) => {
    const { category_id } = req.params;
    const { category_name } = req.body;
    const sql = "UPDATE tbl_productcategory SET category_name = ? WHERE category_id = ?";
    
    db.query(sql, [category_name, category_id], (err, result) => {
      if (err) {
        console.error("Error updating category:", err);
        return res.status(500).json({ message: "Error updating category", error: err });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Category not found" });
      }
      return res.status(200).json({ message: "Category updated successfully" });
    });
  };
  
  exports.deleteCategory = (req, res) => {
    const { category_id } = req.params;
  
    // Delete related products first
    const deleteProductsSql = "DELETE FROM tbl_products WHERE category_id = ?";
    db.query(deleteProductsSql, [category_id], (deleteProductsErr) => {
      if (deleteProductsErr) {
        console.error("Error deleting related products:", deleteProductsErr);
        return res.status(500).json({ message: "Error deleting related products" });
      }
  
      // Delete the categorye
      const deleteCategorySql = "DELETE FROM tbl_productcategory WHERE category_id = ?";
      db.query(deleteCategorySql, [category_id], (deleteCategoryErr) => {
        if (deleteCategoryErr) {
          console.error("Error deleting category:", deleteCategoryErr);
          return res.status(500).json({ message: "Error deleting category" });
        }
        return res.status(200).json({ message: "Category deleted successfully" });
      });
    });
  };
  //added 12/27/24
  exports.getStockRequests = (req, res) => {
  const sql = `
    SELECT sr.request_id, 
           p.product_name, 
           sr.quantity, 
           sr.status, 
           sr.request_date,
           p.product_id
    FROM tbl_stock_requests sr
    JOIN tbl_products p ON sr.product_id = p.product_id
    ORDER BY sr.request_date DESC`;

  db.query(sql, (err, data) => {
    if (err) {
      console.error('Error fetching stock requests:', err);
      res.status(500).json({ message: 'Error fetching stock requests' });
    } else {
      res.json(data);
    }
  });
};

exports.updateStockRequest = (req, res) => {
  const { request_id } = req.params;
  const { status } = req.body;
  
  const sql = 'UPDATE tbl_stock_requests SET status = ? WHERE request_id = ?';
  
  db.query(sql, [status, request_id], (err, result) => {
    if (err) {
      console.error('Error updating stock request:', err);
      res.status(500).json({ message: 'Error updating stock request' });
    } else {
      res.json({ message: 'Stock request updated successfully' });
    }
  });
};

// Example route to create a new stock request
exports.createStockRequest = (req, res) => {
  const { product_id, quantity } = req.body;
  
  const sql = 'INSERT INTO tbl_stock_requests (product_id, quantity, status) VALUES (?, ?, "pending")';
  
  db.query(sql, [product_id, quantity], (err, result) => {
    if (err) {
      console.error('Error creating stock request:', err);
      res.status(500).json({ message: 'Error creating stock request' });
    } else {
      res.json({ message: 'Stock request created successfully', id: result.insertId });
    }
  });
};
  