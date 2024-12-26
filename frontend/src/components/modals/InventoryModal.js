import React, { useState, useEffect } from 'react';

const InventoryModal = ({ isOpen, onClose }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [requestQuantity, setRequestQuantity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchInventory();
      fetchCategories();
    }
  }, [isOpen]);

  const fetchInventory = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/inventory');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleStockRequest = (product) => {
    setSelectedProduct(product);
    setRequestModalOpen(true);
  };

  const submitStockRequest = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/stock-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: selectedProduct.product_id,
          quantity: parseInt(requestQuantity),
          status: 'pending'
        }),
      });

      if (response.ok) {
        alert('Stock request submitted successfully!');
        setRequestModalOpen(false);
        setRequestQuantity('');
        setSelectedProduct(null);
      } else {
        throw new Error('Failed to submit stock request');
      }
    } catch (error) {
      console.error('Error submitting stock request:', error);
      alert('Failed to submit stock request');
    }
  };

  const filteredProducts = products
    .filter(product => 
      (selectedCategory === 'all' || product.category_id === parseInt(selectedCategory)) &&
      product.product_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-3/4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Inventory</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>

        <div className="flex gap-4 mb-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.category_id} value={category.category_id}>
                {category.category_name}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="p-2 border rounded flex-1"
          />
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left border">Product Name</th>
              <th className="p-2 text-left border">Current Stock</th>
              <th className="p-2 text-left border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.product_id} className="border-b">
                <td className="p-2 border">{product.product_name}</td>
                <td className="p-2 border">{product.quantity}</td>
                <td className="p-2 border">
                  <button 
                    onClick={() => handleStockRequest(product)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Request Stock
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stock Request Modal */}
      {requestModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-xl font-bold mb-4">Request Stock</h3>
            <p className="mb-4">Product: {selectedProduct?.product_name}</p>
            <input
              type="number"
              value={requestQuantity}
              onChange={(e) => setRequestQuantity(e.target.value)}
              placeholder="Enter quantity"
              className="w-full p-2 border rounded mb-4"
              min="1"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setRequestModalOpen(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={submitStockRequest}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryModal;