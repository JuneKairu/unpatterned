import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import backgroundImage from '../../assets/images/background2.jpg';

function Admin_dashboard() {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalSales, setTotalSales] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    fetchSalesData();
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      handleFilter(); // Auto-fetch when dates are selected
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (filteredData.length > 0) {
      const total = filteredData.reduce((sum, sale) => sum + sale.total_amount, 0);
      setTotalSales(total);
    } else {
      const total = salesData.reduce((sum, sale) => sum + sale.total_amount, 0);
      setTotalSales(total);
    }
  }, [filteredData, salesData]);

  const fetchSalesData = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/sales-data');
      if (response.data.success) {
        setSalesData(response.data.data);
        setFilteredData(response.data.data); // Initialize filtered data
      } else {
        setError('Failed to fetch sales data');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching sales data:', error);
      setError('Failed to fetch sales data');
      setLoading(false);
    }
  };

  const handleFilter = () => {
    if (!startDate || !endDate) {
      setFilteredData(salesData); // Reset filter if dates are empty
      return;
    }

    const filtered = salesData.filter((sale) => {
      const saleDate = new Date(sale.created_date);
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Normalize the dates to ignore time components
      const normalizedSaleDate = new Date(
        saleDate.getFullYear(),
        saleDate.getMonth(),
        saleDate.getDate()
      );
      const normalizedStart = new Date(start.getFullYear(), start.getMonth(), start.getDate());
      const normalizedEnd = new Date(end.getFullYear(), end.getMonth(), end.getDate());

      // Adjust end date to include the entire day
      normalizedEnd.setHours(23, 59, 59, 999);

      return normalizedSaleDate >= normalizedStart && normalizedSaleDate <= normalizedEnd;
    });

    setFilteredData(filtered);
  };

  const handleViewAll = () => {
    setStartDate('');
    setEndDate('');
    setFilteredData(salesData);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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
            <h1 className="text-2xl font-bold text-gray-800">ADMIN DASHBOARD</h1>
          </div>

          {/* Filter Section */}
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
              className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors"
              onClick={handleViewAll}
            >
              View All
            </button>
          </div>

          {/* Sales Section */}
          <div className="w-full bg-white p-4 border border-gray-200 rounded-lg shadow-sm mt-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Sales As of Date</h2>

            {loading && (
              <div className="flex justify-center items-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
              </div>
            )}

            {error && <p className="text-sm text-red-500">{error}</p>}

            {!loading && !error && filteredData.length === 0 && (
              <p className="text-sm text-gray-500">No Record found.</p>
            )}

            {!loading && !error && filteredData.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredData.map((sale, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{formatDate(sale.created_date)}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{sale.product_name}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">P{parseFloat(sale.product_price).toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{sale.quantity}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">P{parseFloat(sale.total_amount).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Total Sales */}
            {!loading && !error && (
              <div className="mt-4 text-right">
                <h3 className="text-lg font-semibold text-gray-800">
                  Total Sales: P{totalSales.toFixed(2)}
                </h3>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin_dashboard;
