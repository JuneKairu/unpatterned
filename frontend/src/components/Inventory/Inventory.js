import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { BellIcon, InboxIcon } from '@heroicons/react/24/outline';
import Navbar from '../Navbar/Navbar';
import backgroundImage from '../../assets/images/background2.jpg';

function Inventory() {
  const [products, setProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [newProduct, setNewProduct] = useState({ category: '', name: '', price: '' });

  useEffect(() => {
    if (selectedCategories.length > 0) {
      const category = selectedCategories[0].value; 
      fetch(`http://localhost:8081/products/${category}`)
        .then((res) => res.json())
        .then((data) => setProducts(data))
        .catch((err) => console.error(err));
    }
  }, [selectedCategories]);

  const handleAddProduct = () => {
    fetch('http://localhost:8081/api/addProduct', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProduct),
    })
      .then((res) => res.json())
      .then((data) => {
        alert('Product added successfully');
        setShowAddProductForm(false);
        setNewProduct({ category: '', name: '', price: '' });
      })
      .catch((err) => console.error(err));
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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">INVENTORY</h1>
            <div className="flex space-x-4">
              <button
                className="flex items-center space-x-2 p-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                title="Notifications"
              >
                <BellIcon className="h-5 w-5" />
                <span className="text-sm">Notifications</span>
              </button>
              <button
                className="flex items-center space-x-2 p-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                title="Inventory"
              >
                <InboxIcon className="h-5 w-5" />
                <span className="text-sm">Inventory</span>
              </button>
            </div>
          </div>

          {/* Add New Product button */}
          <button
            className="mb-6 bg-indigo-500 text-white py-1.5 px-3 rounded hover:bg-indigo-600 text-sm"
            onClick={() => setShowAddProductForm(true)}
          >
            Add New Product
          </button>

          {/* Filter */}
          <div className="mb-6">
            <h2 className="text-base font-medium text-gray-700">Filter</h2>
            <div className="w-1/2">
              <Select
                isMulti
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Select categories..."
                onChange={(selected) => setSelectedCategories(selected)}
                options={[
                  { value: 'uniforms', label: 'Uniforms' },
                  { value: 'schoolsupplies', label: 'School Supplies' },
                  { value: 'lccbmerchandise', label: 'LCCB Merchandise' },
                ]}
              />
            </div>
          </div>

          {/* Products Display */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            {products.length === 0 ? (
              <p className="text-sm">No items available for the selected categories.</p>
            ) : (
              products.map((product) => (
                <div key={product.id} className="p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
                  <h3 className="font-medium text-sm text-gray-800">{product.name}</h3>
                  <p className="text-sm text-gray-600">{`₱${product.price}`}</p>
                </div>
              ))
            )}
          </div>

          {/* Add Product Form Modal */}
          {showAddProductForm && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded shadow-lg">
                <h3 className="text-base font-medium mb-4">Add New Product</h3>
                <select
                  className="mb-4 p-2 border border-gray-300 rounded text-sm"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                >
                  <option value="">Select Category</option>
                  <option value="uniforms">Uniforms</option>
                  <option value="schoolsupplies">School Supplies</option>
                  <option value="lccbmerchandise">LCCB Merchandise</option>
                </select>
                <input
                  className="mb-4 p-2 border border-gray-300 rounded text-sm"
                  type="text"
                  placeholder="Product Name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                />
                <input
                  className="mb-4 p-2 border border-gray-300 rounded text-sm"
                  type="number"
                  placeholder="Product Price"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                />
                <button className="bg-indigo-500 text-white py-1.5 px-3 rounded hover:bg-indigo-600 text-sm" onClick={handleAddProduct}>
                  Add Product
                </button>
                <button
                  className="ml-2 bg-gray-500 text-white py-1.5 px-3 rounded hover:bg-gray-600 text-sm"
                  onClick={() => setShowAddProductForm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Inventory;
