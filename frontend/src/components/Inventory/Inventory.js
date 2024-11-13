import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { BellIcon, InboxIcon } from '@heroicons/react/24/outline';
import Navbar from '../Navbar/Navbar';
import backgroundImage from '../../assets/images/background2.jpg';
import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:8081'
});

function Inventory() {
  // State management
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    category_id: '',
    product_name: '',
    price: ''
  });
  const [newCategory, setNewCategory] = useState({
    category_name: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch products when selected categories change
  useEffect(() => {
    if (selectedCategories.length > 0) {
      fetchProducts(selectedCategories[0].value);
    } else {
      setProducts([]);
    }
  }, [selectedCategories]);

  // Fetch categories function
  const fetchCategories = async () => {
    setLoading(true);
    try {
      // Updated to match your route: /categories
      const res = await api.get('http://localhost:8081/api/categories');
      setCategories(res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  // Fetch products function
  const fetchProducts = async (categoryId) => {
    setLoading(true);
    try {
      // Updated to match your route: /products/:category_id
      const res = await api.get(`http://localhost:8081/api/products/${categoryId}`);
      setProducts(res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // Handle adding new product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Updated to match your route: /addProduct
      const res = await api.post('http://localhost:8081/api/addProduct', {
        product_name: newProduct.product_name,
        price: parseFloat(newProduct.price),
        category_id: newProduct.category_id
      });
      
      alert('Product added successfully');
      setShowAddProductForm(false);
      setNewProduct({ category_id: '', product_name: '', price: '' });
      
      // Refresh products list if the current category is selected
      if (selectedCategories.some((cat) => cat.value === newProduct.category_id)) {
        fetchProducts(newProduct.category_id);
      }
    } catch (err) {
      console.error("Error adding product:", err);
      alert('Error adding product: ' + (err.response?.data?.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Handle adding new category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Updated to match your route: /addCategory
      const res = await api.post('http://localhost:8081/api/addCategory', {
        category_name: newCategory.category_name
      });
      
      alert('Category added successfully');
      setShowAddCategoryForm(false);
      setNewCategory({ category_name: '' });
      fetchCategories(); // Refresh categories list
    } catch (err) {
      console.error("Error adding category:", err);
      alert('Error adding category: ' + (err.response?.data?.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="flex"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
      }}
    >
      <Navbar />
      <div className="flex-1 p-4">
        <div className="flex flex-col h-full bg-white/80 rounded-lg shadow-md p-6">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">INVENTORY</h1>
            <div className="flex space-x-4">
              <button 
                className="flex items-center space-x-2 p-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors" 
                title="Notifications"
              >
                <BellIcon className="h-5 w-5" />
                <span className="text-sm">Notifications</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mb-6 flex space-x-4">
            <button 
              className="bg-indigo-500 text-white py-1.5 px-3 rounded hover:bg-indigo-600 transition-colors text-sm"
              onClick={() => setShowAddProductForm(true)}
              disabled={loading}
            >
              Add New Product
            </button>
            <button 
              className="bg-green-500 text-white py-1.5 px-3 rounded hover:bg-green-600 transition-colors text-sm"
              onClick={() => setShowAddCategoryForm(true)}
              disabled={loading}
            >
              Add New Category
            </button>
          </div>

          {/* Category Filter */}
          <div className="mb-6">
            <h2 className="text-base font-medium text-gray-700 mb-2">Filter by Category</h2>
            <div className="w-full md:w-1/2">
              <Select
                isMulti
                isLoading={loading}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Select categories..."
                onChange={(selected) => setSelectedCategories(selected || [])}
                options={categories.map(category => ({
                  value: category.category_id,
                  label: category.category_name
                }))}
              />
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {loading ? (
              <div className="col-span-full text-center py-4">Loading...</div>
            ) : products.length === 0 ? (
              <div className="col-span-full text-center py-4 text-gray-500">
                No products available for the selected categories.
              </div>
            ) : (
              products.map((product) => (
                <div key={product.product_id} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="font-medium text-gray-800">{product.product_name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{`₱${parseFloat(product.price).toFixed(2)}`}</p>
                  <p className="text-xs text-gray-500 mt-1">{product.category_name}</p>
                </div>
              ))
            )}
          </div>

          {/* Add Product Modal */}
          {showAddProductForm && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h3 className="text-lg font-medium mb-4">Add New Product</h3>
                <form onSubmit={handleAddProduct}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                        value={newProduct.category_id}
                        onChange={(e) => setNewProduct({ ...newProduct, category_id: e.target.value })}
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                          <option key={category.category_id} value={category.category_id}>
                            {category.category_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Name
                      </label>
                      <input
                        className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                        type="text"
                        placeholder="Enter product name"
                        value={newProduct.product_name}
                        onChange={(e) => setNewProduct({ ...newProduct, product_name: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price
                      </label>
                      <input
                        className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                        type="number"
                        step="0.01"
                        placeholder="Enter price"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                      onClick={() => setShowAddProductForm(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700"
                      disabled={loading}
                    >
                      {loading ? 'Adding...' : 'Add Product'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Add Category Modal */}
          {showAddCategoryForm && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h3 className="text-lg font-medium mb-4">Add New Category</h3>
                <form onSubmit={handleAddCategory}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category Name
                    </label>
                    <input
                      className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                      type="text"
                      placeholder="Enter category name"
                      value={newCategory.category_name}
                      onChange={(e) => setNewCategory({ category_name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                      onClick={() => setShowAddCategoryForm(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700"
                      disabled={loading}
                    >
                      {loading ? 'Adding...' : 'Add Category'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

         
        </div>
      </div>
    </div>
  );
}

export default Inventory;