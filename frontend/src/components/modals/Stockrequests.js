import React, { useState, useEffect } from 'react';
import { XCircleIcon } from '@heroicons/react/24/outline';

const StockRequests = ({ isOpen, onClose }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchStockRequests();
    }
  }, [isOpen]);

  const fetchStockRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8081/api/stock-requests');
      if (!response.ok) throw new Error('Failed to fetch requests');
      const data = await response.json();
      setRequests(data);
    } catch (err) {
      console.error('Error fetching stock requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRestock = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:8081/api/stock-requests/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'completed' }),
      });

      if (!response.ok) throw new Error('Failed to update request');
      
      // Refresh the requests list
      fetchStockRequests();
      
    } catch (err) {
      console.error('Error updating stock request:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-3/4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#0D47A1]">Stock Requests</h2>
          <button onClick={onClose} className="text-red-600 hover:text-red-700 text-xl flex items-center">
            <XCircleIcon className="h-10 w-10" />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : requests.length === 0 ? (
          <p className="text-center text-gray-600">No stock requests found.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#1E88E5]">
                <th className="p-2 text-left font-bold border text-white">Product Name</th>
                <th className="p-2 text-left font-bold border text-white">Quantity</th>
                <th className="p-2 text-left font-bold border text-white">Request Date</th>
                <th className="p-2 text-left font-bold border text-white">Status</th>
                <th className="p-2 text-left font-bold border text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.request_id} className="border-b">
                  <td className="p-2 border font-medium">{request.product_name}</td>
                  <td className="p-2 border font-medium">{request.quantity}</td>
                  <td className="p-2 border font-medium">
                    {new Date(request.request_date).toLocaleDateString()}
                  </td>
                  <td className="p-2 border">
                    <span className={`px-2 py-1 rounded-md text-sm ${
                      request.status === 'pending'
                        ? 'bg-yellow-500 text-white'
                        : request.status === 'completed'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-500 text-white'
                    }`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="p-2 border">
                    {request.status === 'pending' && (
                      <button
                        onClick={() => handleRestock(request.request_id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        Restock
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default StockRequests;