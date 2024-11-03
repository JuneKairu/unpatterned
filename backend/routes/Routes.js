const express = require('express');
const router = express.Router();
const controller = require('../controller/controller');

// path

router.post('/Signup', controller.Signup); 
router.post('/login', controller.Login); 
router.post('/addProduct', controller.Addproduct); 

router.get('/products/:category', controller.Viewproducts); 

module.exports = router; 