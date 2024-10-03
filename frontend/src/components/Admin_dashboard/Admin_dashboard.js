import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { BellIcon, InboxIcon } from '@heroicons/react/24/outline';

function Admin_dashboard() {
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
    fetch('http://localhost:8081/addProduct', {
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
        setNewProduct({ category: '', name: '', price: '' }); // reset form
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="p-4">
      <div className="min-h-screen mx-auto flex space-x-8">
        <div className="flex-1 p-6 bg-white/30 backdrop-blur-md border border-gray-200 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">LCCB BOOKSTORE ADMIN DASHBOARD</h1>
            <div className="flex space-x-4">
              <button
                className="flex items-center space-x-2 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
                title="Notifications"
              >
                <BellIcon className="h-6 w-6" />
                <span>Notifications</span>
              </button>
              <button
                className="flex items-center space-x-2 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
                title="Inventory"
              >
                <InboxIcon className="h-6 w-6" />
                <span>Inventory</span>
              </button>
            </div>
          </div>

          {/* select which product to display */}
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-700">Filter</h2>
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

          {/* show products / missing all display if unselect */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            {products.length === 0 ? (
              <p>No items available for the selected categories.</p>
            ) : (
              products.map((product) => (
                <div key={product.id} className="p-4 bg-white border border-gray-200 rounded-lg shadow-md">
                  <h3 className="font-medium">{product.name}</h3>
                  <p>{`₱${product.price}`}</p>
                </div>
              ))
            )}
          </div>

          
          <button
            className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded"
            onClick={() => setShowAddProductForm(true)}
          >
            Add New Product
          </button>

         
          {showAddProductForm && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded shadow-lg">
                <h3 className="text-lg font-medium mb-4">Add New Product</h3>
                <select
                  className="mb-4 p-2 border border-gray-300 rounded"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                >
                  <option value="">Select Category</option>
                  <option value="uniforms">Uniforms</option>
                  <option value="schoolsupplies">School Supplies</option>
                  <option value="lccbmerchandise">LCCB Merchandise</option>
                </select>
                <input
                  className="mb-4 p-2 border border-gray-300 rounded"
                  type="text"
                  placeholder="Product Name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                />
                <input
                  className="mb-4 p-2 border border-gray-300 rounded"
                  type="number"
                  placeholder="Product Price"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                />
                <button className="bg-indigo-600 text-white py-2 px-4 rounded" onClick={handleAddProduct}>
                  Add Product
                </button>
                <button
                  className="ml-2 bg-indigo-600 text-white py-2 px-4 rounded"
                  onClick={() => setShowAddProductForm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="w-80 bg-white/30 backdrop-blur-md p-4 border border-gray-200 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Sales As of Date</h2>
          <p>No Record found.</p>
        </div>
      </div>
    </div>
  );
}

export default Admin_dashboard;