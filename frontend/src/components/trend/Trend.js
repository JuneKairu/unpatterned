import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function TopSellingProducts() {
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchTopSellingProducts();
  }, [dateRange.startDate, dateRange.endDate]);

  const fetchTopSellingProducts = async () => {
    try {
      const params = dateRange.startDate && dateRange.endDate 
        ? { 
            startDate: dateRange.startDate, 
            endDate: dateRange.endDate 
          } 
        : {};

      const response = await axios.get('http://localhost:8081/api/top-selling-products', { params });
      
      if (response.data.success) {
        setTopProducts(response.data.topProducts);
      } else {
        setError('Failed to fetch top-selling products');
      }
      setLoading(false);
    } catch (error) {
      console.error('Fetch error:', error);
      setError('Error fetching top-selling products: ' + error.message);
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const chartData = {
    labels: topProducts.map((product) => product.product_name),
    datasets: [
      {
        label: 'Quantity Sold',
        data: topProducts.map((product) => product.total_quantity),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Revenue (PHP)',
        data: topProducts.map((product) => product.total_revenue),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Quantity / Revenue'
        }
      }
    },
    plugins: {
      legend: { 
        position: 'top',
        labels: {
          boxWidth: 20,
        }
      },
      title: {
        display: true,
        text: 'Top-Selling Products (Quantity & Revenue)',
        font: {
          size: 16
        }
      },
    },
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex space-x-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={dateRange.startDate}
            onChange={handleDateChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            name="endDate"
            value={dateRange.endDate}
            onChange={handleDateChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
      </div>

      <div className="h-100vh">
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && topProducts.length > 0 && (
          <Bar
            data={chartData}
            options={chartOptions}
          />
        )}
        {!loading && !error && topProducts.length === 0 && (
          <p>No products found for the selected date range.</p>
        )}
      </div>
    </div>
  );
}

export default TopSellingProducts;