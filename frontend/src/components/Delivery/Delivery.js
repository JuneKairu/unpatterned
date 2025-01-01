  import React, { useState, useEffect } from 'react';
  import Navbar from '../Navbar/Navbar';
  import axios from 'axios';

  const api = axios.create({
    baseURL: 'http://localhost:8081'
  });

  function Delivery() {
    const [deliveries, setDeliveries] = useState([]);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [showAddDeliveryForm, setShowAddDeliveryForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [productSearch, setProductSearch] = useState('');
    const [newDelivery, setNewDelivery] = useState({
      delivery_date: '',
      delivery_time: '',
      supplier: '',
      product_id: '',
      quantity: 0,
      cost_price: 0,
      selling_price: 0,
      total_amount: 0,
      contact_number: ''
    });

    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        setError(null);
        
        try {
          const [deliveriesRes, productsRes] = await Promise.all([
            api.get('/api/deliveries'),
            api.get('/api/products')
          ]);
          
          console.log('Deliveries response:', deliveriesRes.data); // Debug log
          console.log('Products response:', productsRes.data); // Debug log
          
          setDeliveries(deliveriesRes.data || []);
          setProducts(productsRes.data || []);
          setFilteredProducts(productsRes.data || []);
        } catch (err) {
          console.error('Fetch error:', err);
          console.error('Error details:', err.response?.data); // Debug log
          setError(err.response?.data?.message || 'Failed to load data');
          setDeliveries([]);
          setProducts([]);
          setFilteredProducts([]);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, []);

    const handleProductSearch = (searchTerm) => {
      setProductSearch(searchTerm);
      const filtered = products.filter(product =>
        product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    };

    const handleProductSelect = (productId) => {
      const selectedProduct = products.find(p => p.product_id === productId);
      if (selectedProduct) {
        setNewDelivery(prev => ({
          ...prev,
          product_id: productId,
          cost_price: selectedProduct.cost_price || 0,
          selling_price: selectedProduct.selling_price || 0
        }));
      }
    };

    const calculateTotalAmount = (quantity, cost_price) => {
      return quantity * cost_price;
    };

    const handleAddDelivery = async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
        const deliveryData = {
          ...newDelivery,
          total_amount: calculateTotalAmount(newDelivery.quantity, newDelivery.cost_price)
        };

        console.log('Sending delivery data:', deliveryData); // Debug log

        const response = await api.post('/api/deliveries', deliveryData);
        console.log('Add delivery response:', response.data); // Debug log
        
        const { data } = await api.get('/api/deliveries');
        setDeliveries(data || []);
        
        setShowAddDeliveryForm(false);
        setNewDelivery({
          delivery_date: '',
          delivery_time: '',
          supplier: '',
          product_id: '',
          quantity: 0,
          cost_price: 0,
          selling_price: 0,
          total_amount: 0,
          contact_number: ''
        });
        
        alert('Delivery scheduled successfully');
      } catch (err) {
        console.error('Add delivery error:', err);
        console.error('Error details:', err.response?.data); // Debug log
        alert(err.response?.data?.message || 'Failed to schedule delivery');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="flex" style={{ backgroundColor: 'white', minHeight: '100vh' }}>
        <Navbar />
        <div className="flex-1 p-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">DELIVERY</h1>
            <button
              className="bg-blue-700 text-white py-2 px-4 rounded hover:bg-blue-800 transition-colors"
              onClick={() => setShowAddDeliveryForm(true)}
            >
              Add Delivery
            </button>
          </div>

          <div className="w-full bg-white p-4 border border-gray-200 rounded-lg shadow-sm mt-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Scheduled Deliveries</h2>
            
            {loading && <p className="text-gray-500">Loading deliveries...</p>}
            {error && <p className="text-red-500">{error}</p>}
            
            {!loading && !error && (
              deliveries.length > 0 ? (
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border px-4 py-2">Date</th>
                      <th className="border px-4 py-2">Time</th>
                      <th className="border px-4 py-2">Supplier</th>
                      <th className="border px-4 py-2">Product</th>
                      <th className="border px-4 py-2">Quantity</th>
                      <th className="border px-4 py-2">Cost Price</th>
                      <th className="border px-4 py-2">Selling Price</th>
                      <th className="border px-4 py-2">Total</th>
                      <th className="border px-4 py-2">Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deliveries.map((delivery) => (
                      <tr key={delivery.id}>
                        <td className="border px-4 py-2">
                          {new Date(delivery.delivery_date).toLocaleDateString()}
                        </td>
                        <td className="border px-4 py-2">{delivery.delivery_time}</td>
                        <td className="border px-4 py-2">{delivery.supplier}</td>
                        <td className="border px-4 py-2">{delivery.product_name}</td>
                        <td className="border px-4 py-2">{delivery.quantity}</td>
                        <td className="border px-4 py-2">{delivery.cost_price?.toFixed(2)}</td>
                        <td className="border px-4 py-2">{delivery.selling_price?.toFixed(2)}</td>
                        <td className="border px-4 py-2">{delivery.total_amount?.toFixed(2)}</td>
                        <td className="border px-4 py-2">{delivery.contact_number}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-sm text-gray-500">No deliveries found.</p>
              )
            )}
          </div>
        </div>

        {showAddDeliveryForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full max-h-full overflow-y-auto">
              <h3 className="text-lg font-medium mb-4">Add New Delivery</h3>
              <form onSubmit={handleAddDelivery}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Date</label>
                    <input
                      type="date"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={newDelivery.delivery_date}
                      onChange={(e) => setNewDelivery({ ...newDelivery, delivery_date: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Time</label>
                    <input
                      type="time"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={newDelivery.delivery_time}
                      onChange={(e) => setNewDelivery({ ...newDelivery, delivery_time: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={newDelivery.supplier}
                      onChange={(e) => setNewDelivery({ ...newDelivery, supplier: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full p-2 pl-8 border border-gray-300 rounded"
                        placeholder="Search products..."
                        value={productSearch}
                        onChange={(e) => handleProductSearch(e.target.value)}
                      />
                      <span className="absolute left-2.5 top-2.5 text-gray-400">🔍</span>
                    </div>
                    {productSearch && (
                      <div className="mt-1 max-h-48 overflow-y-auto border border-gray-200 rounded">
                        {filteredProducts.map((product) => (
                          <div
                            key={product.product_id}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              handleProductSelect(product.product_id);
                              setProductSearch(product.product_name);
                            }}
                          >
                            {product.product_name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <input
                      type="number"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={newDelivery.quantity}
                      onChange={(e) => setNewDelivery({ ...newDelivery, quantity: parseInt(e.target.value, 10) || 0 })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cost Price (per unit)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={newDelivery.cost_price}
                      onChange={(e) => setNewDelivery({ ...newDelivery, cost_price: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price (per unit)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={newDelivery.selling_price}
                      onChange={(e) => setNewDelivery({ ...newDelivery, selling_price: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={newDelivery.contact_number}
                      onChange={(e) => setNewDelivery({ ...newDelivery, contact_number: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                    onClick={() => setShowAddDeliveryForm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded hover:bg-blue-800"
                    disabled={loading}
                  >
                    {loading ? 'Scheduling...' : 'Add Delivery'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  export default Delivery;