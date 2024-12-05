
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import Trend from '../trend/Trend';
import backgroundImage from '../../assets/images/background2.jpg';

function Admin_dashboard() {
  const [salesData, setSalesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [transactionDetails, setTransactionDetails] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchSalesData();
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      handleFilter();
    } else {
      setFilteredData(salesData); // Reset to all sales data if date range is cleared
    }
  }, [startDate, endDate]);

  const fetchSalesData = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/sales-data');
      if (response.data.success) {
        setSalesData(response.data.data);
        setFilteredData(response.data.data);

        // Calculate total sales
        const total = response.data.data.reduce((sum, sale) => sum + sale.total_amount, 0);
        setTotalSales(total);
      } else {
        setError('Failed to fetch sales data');
      }
      setLoading(false);
    } catch (error) {
      setError('Error fetching sales data');
      setLoading(false);
    }
  };

  const handleFilter = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/sales-data', {
        params: { startDate, endDate },
      });
      if (response.data.success) {
        setFilteredData(response.data.data);

        // Recalculate total sales for the filtered data
        const total = response.data.data.reduce((sum, sale) => sum + sale.total_amount, 0);
        setTotalSales(total);
      } else {
        setError('Failed to fetch filtered sales data');
      }
    } catch (error) {
      setError('Error fetching filtered sales data');
    }
  };

  const fetchTransactionDetails = async (transactionId) => {
    try {
      const response = await axios.get(`http://localhost:8081/api/transactions/${transactionId}`);
      if (response.data.success) {
        setTransactionDetails(response.data.data);
        setModalOpen(true);
      } else {
        alert('Failed to fetch transaction details');
      }
    } catch (error) {
      alert('Error fetching transaction details');
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setTransactionDetails([]);
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

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
        <Trend />
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">ADMIN DASHBOARD</h1>
          </div>

          <div className="flex space-x-4 mb-4">
            <input
              type="date"
              className="p-2 border border-gray-300 rounded"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="date"
              className="p-2 border border-gray-300 rounded"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <button
              className="px-4 py-2 bg-[#0442b1] text-white rounded hover:bg-[#033387] transition-colors"
              onClick={() => {
                setStartDate('');
                setEndDate('');
                setFilteredData(salesData);
                setTotalSales(salesData.reduce((sum, sale) => sum + sale.total_amount, 0));
              }}
            >
              View All
            </button>
          </div>
          
          <div className="w-full bg-white p-4 border border-gray-200 rounded-lg shadow-sm mt-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Sales Records</h2>
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && filteredData.length === 0 && <p>No Records Found.</p>}
            {!loading && !error && filteredData.length > 0 && (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Transaction ID</th>
                    <th className="px-4 py-3">Total Amount</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredData.map((sale) => (
                    <tr key={sale.transaction_id}>
                      
                        <td className="px-4 py-3 text-center">{formatDate(sale.created_date)}</td>
                        <td className="px-4 py-3 text-center">{sale.transaction_id}</td>
                        <td className="px-4 py-3 text-center">P{parseFloat(sale.total_amount).toFixed(2)}</td>
                        <td className="px-4 py-3 text-center">
                          <button
                            className="px-4 py-2 bg-[#0442b1] hover:bg-[#033387] text-white rounded"
                            onClick={() => fetchTransactionDetails(sale.transaction_id)}
                          >
                            View Details
                          </button>
                        </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {!loading && !error && (
            <div className="mt-4 text-right">
              <h3 className="text-lg font-semibold">
                Total Sales: P{totalSales.toFixed(2)}
              </h3>
            </div>
          )}
        </div>
      </div>
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-bold mb-4">Transaction Details</h2>
            {transactionDetails.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2">Product Name</th>
                    <th className="px-4 py-2">Quantity</th>
                    <th className="px-4 py-2">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {transactionDetails.map((detail, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2">{detail.product_name}</td>
                      <td className="px-4 py-2">{detail.quantity}</td>
                      <td className="px-4 py-2">P{parseFloat(detail.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No details found</p>
            )}
            <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin_dashboard;
