const express = require('express');
const router = express.Router();
const controller = require('../controller/controller');

// Routes
router.post('/signup', controller.Signup);
router.post('/login', controller.Login);
router.post('/addProduct', controller.AddProduct);
router.post('/addCategory', controller.AddCategory);

// Get all categories
router.get('/categories', controller.GetCategories);

// Get products by category ID
router.get('/products/:category_id', controller.ViewProducts);

// New routes
router.get('/fcategories', controller.getAllCategories);  // Fix import name
router.get('/fproducts/:category_id', controller.getProductsByCategoryId); // Consistent naming



router.put('/fproducts/:product_id', controller.updateProduct);

// Delete a product by ID
router.delete('/products/:product_id', controller.deleteProduct);

module.exports = router;
