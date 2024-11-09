const express = require('express');
const router = express.Router();
const controller = require('../controller/controller');

// Routes
router.post('/signup', controller.Signup); 
router.post('/login', controller.Login); 
router.post('/addProduct', controller.AddProduct); 
router.post('/addCategory', controller.AddCategory); // New route for adding category

// Get all categories
router.get('/categories', controller.GetCategories);

// Get products by category ID
router.get('/products/:category_id', controller.ViewProducts);

module.exports = router;
