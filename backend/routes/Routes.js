const express = require('express');
const router = express.Router();
const controller = require('../controller/controller');

// Routes

//all get
router.post('/signup', controller.Signup); //for new acc
router.get('/accounts', controller.getAccounts); // To fetch all accounts
router.delete('/accounts/:accountId', controller.deleteAccount);
router.put('/accounts/:accountId', controller.updateAccount);



router.post('/login', controller.Login); // route for logins 
router.post('/addProduct', controller.AddProduct);// adding new producs
router.post('/addCategory', controller.AddCategory);// creating new prod category

// Get all categories
router.get('/categories', controller.GetCategories);// fetch products by category ID
router.get('/products/:category_id', controller.ViewProducts); // fetch products by category ID
// added 11/14/24
router.get('/fcategories', controller.getAllCategories);  // fetch to home page product & Fix import name
router.get('/fproducts/:category_id', controller.getProductsByCategoryId); // fetch to home category
//added 11/15/24
router.put('/products/:product_id', controller.UpdateProduct);// Update product by ID in inventory page
router.delete('/products/:product_id', controller.DeleteProduct);// Delete product by ID inventory page

// Transaction routes
router.post('/transactions', controller.CreateTransaction);
router.get('/transactions/:transaction_id', controller.GetTransaction);
//added 11/22/24
router.get('/sales-data', controller.getSalesData);
router.get('/top-selling-products', controller.getTopSellingProducts);


// Delivery routes
router.post('/deliveries', controller.addDelivery);
router.get('/deliveries', controller.getAllDeliveries);


//added 12/26/24
// inventory dashboard
router.get('/inventory', controller.getInventory);
router.post('/stock-request', controller.createStockRequest);
// notif dash 
router.get('/low-stock', controller.getLowStockProducts);
//new fetch product admin invent
router.get('/products', controller.getAllProducts);
router.put('/categories/:category_id', controller.updateCategory); // Update category by ID
router.delete('/categories/:category_id', controller.deleteCategory); // Delete category by ID


router.get('/stock-requests', controller.getStockRequests);
router.put('/stock-requests/:request_id', controller.updateStockRequest);
router.post('/password-requests', controller.createPasswordRequest);

// Route for fetching all password requests
router.get('/passwordRequests', controller.getPasswordRequests);

// Route for updating the status of a password request
router.put('/passwordRequests/:requestId', controller.updatePasswordRequestStatus);
module.exports = router;
//test 12323132131321