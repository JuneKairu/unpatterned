import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
// import backgroundImage from '../../assets/images/background2.jpg';
import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:8081' 
});

function Delivery() {
  const [deliveries, setDeliveries] = useState([]);
  const [products, setProducts] = useState([]);
  const [showAddDeliveryForm, setShowAddDeliveryForm] = useState(false);
  const [newDelivery, setNewDelivery] = useState({
    delivery_date: '',
    delivery_time: '',
    supplier: '',
    product_id: '', 
    quantity: 0,
    price: 0,
    total_amount: 0,
    contact_number: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch deliveries and products when the component mounts
  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const res = await api.get('/api/deliveries');
        setDeliveries(res.data);
      } catch (err) {
        setError('Failed to load deliveries'); 
      }
    };

    const fetchProducts = async () => {
      try {
        const res = await api.get('/api/products');
        setProducts(res.data); 
      } catch (err) {
        setError('Failed to load products'); 
      }
    };

    fetchDeliveries();
    fetchProducts();
  }, []); 

  const handleAddDelivery = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/api/deliveries', {
        ...newDelivery,
        total_amount: newDelivery.quantity * newDelivery.price
      });

      alert('Delivery scheduled successfully');
      setShowAddDeliveryForm(false);
      setNewDelivery({ 
        delivery_date: '',
        delivery_time: '',
        supplier: '',
        product_id: '',
        quantity: 0,
        price: 0,
        total_amount: 0,
        contact_number: ''
      });

      // Refresh deliveries list after adding a new delivery
      const res = await api.get('/api/deliveries');
      setDeliveries(res.data);
    } catch (err) {
      alert('Failed to schedule delivery'); 
      console.error(err); // Log the error for debugging
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex" style={{ backgroundColor: 'white', minHeight: '100vh' }}>

      <Navbar />

      <div className="flex-1 p-4">
        {/* <div className="flex flex-col h-full bg-white/80 rounded-lg shadow-md p-6"> */}
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
            {deliveries.length > 0 ? (
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border px-4 py-2">Date</th>
                    <th className="border px-4 py-2">Time</th>
                    <th className="border px-4 py-2">Supplier</th>
                    <th className="border px-4 py-2">Product</th>
                    <th className="border px-4 py-2">Quantity</th>
                    <th className="border px-4 py-2">Price</th>
                    <th className="border px-4 py-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveries.map((delivery) => (
                    <tr key={delivery.id}> 
                      <td className="border px-4 py-2">{delivery.delivery_date}</td>
                      <td className="border px-4 py-2">{delivery.delivery_time}</td>
                      <td className="border px-4 py-2">{delivery.supplier}</td>
                      <td className="border px-4 py-2">{delivery.product_name}</td> 
                      <td className="border px-4 py-2">{delivery.quantity}</td>
                      <td className="border px-4 py-2">{delivery.price}</td>
                      <td className="border px-4 py-2">{delivery.total_amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-sm text-gray-500">No Record found.</p> 
            )}
          </div>
        {/* </div> */}
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
                        <select
                            className="w-full p-2 border border-gray-300 rounded"
                            value={newDelivery.product_id}
                            onChange={(e) => setNewDelivery({ ...newDelivery, product_id: e.target.value })}
                            required
                        >
                            <option value="">Select Product</option>
                            {products.map((product) => (
                                <option key={product.product_id} value={product.product_id}>
                                    {product.product_name}
                                </option>
                            ))}
                        </select>
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price (per unit)</label>
                        <input
                            type="number"
                            step="0.01"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={newDelivery.price}
                            onChange={(e) => setNewDelivery({ ...newDelivery, price: parseFloat(e.target.value) || 0 })}
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