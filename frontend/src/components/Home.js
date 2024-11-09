import React, { useState } from 'react';
import Select from 'react-select';
import { BellIcon, InboxIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline'; // Import Logout Icon
import { categories } from './Items/items';
import { useNavigate } from 'react-router-dom';
// import backgroundImage from '../assets/images/background2.jpg';
// import Navbar from '../Navbar/Navbar';

const formatCurrency = (amount) => {
  return `₱${amount.toLocaleString()}`;
};

const categoryOptions = Object.keys(categories).map(category => ({
  value: category,
  label: category === 'schoolsupplies' ? 'School Supplies' : category.charAt(0).toUpperCase() + category.slice(1),
}));

function Home() {
  const [cart, setCart] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cashGiven, setCashGiven] = useState(0);

  const addToCart = (item, optionName) => {
    const itemPrice = item.options
      ? item.options.find(option => option.name === optionName).price
      : item.price;

    const itemInCart = cart.find(cartItem => cartItem.name === item.name && cartItem.option === optionName);
    if (itemInCart) {
      setCart(cart.map(cartItem =>
        cartItem.name === item.name && cartItem.option === optionName
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, price: itemPrice, option: optionName, quantity: 1 }]);
    }
  };

  const removeFromCart = (item, optionName) => {
    setCart(cart.filter(cartItem => !(cartItem.name === item.name && cartItem.option === optionName)));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = async () => {
    setIsModalOpen(true);

    try {
      const response = await fetch('http://localhost:4000/print', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cart,
          total: calculateTotal(),
        }),
      });

      if (response.ok) {
        console.log('Receipt printed successfully!');
      } else {
        console.error('Failed to print receipt.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const navigate = useNavigate();
  const handleLogout = () => {
    // Implement your logout logic here (e.g., clearing tokens, redirecting)
    alert('Logged out successfully');
    navigate('/'); // Redirect to login page after logout
  };

  const handleCategoryChange = (selectedOptions) => {
    setSelectedCategories(selectedOptions ? selectedOptions.map(option => option.value) : []);
  };

  const filteredItems = Object.entries(categories).flatMap(([category, items]) => {
    return selectedCategories.length === 0 || selectedCategories.includes(category)
      ? items.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
      : [];
  });

  const totalAmount = calculateTotal();
  const change = cashGiven - totalAmount;

  return (
    <div className="p-4">
      <div className="min-h-screen mx-auto flex space-x-8">
        <div className="flex-1 p-6 bg-blue/80 border-gray-200 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">LCCB BOOKSTORE</h1>
            <div className="flex space-x-4">
              <button
                className="flex items-center space-x-2 p-2 bg-[#0442b1] text-white rounded-md hover:bg-[#033387]"
                title="Notifications"
              >
                <BellIcon className="h-6 w-6" />
                <span>Notifications</span>
              </button>
              <button
                className="flex items-center space-x-2 p-2 bg-[#0442b1] text-white rounded-md hover:bg-[#033387]"
                title="Inventory"
              >
                <InboxIcon className="h-6 w-6" />
                <span>Inventory</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 p-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                title="Logout"
              >
                <ArrowLeftOnRectangleIcon className="h-6 w-6" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-700">Filter</h2>
            <div className="w-1/2">
              <Select
                isMulti
                options={categoryOptions}
                onChange={handleCategoryChange}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Select categories..."
              />
            </div>
          </div>

          <div className="mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Search items..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            {filteredItems.length === 0 ? (
              <p>No items available for the selected categories or search term.</p>
            ) : (
              filteredItems.map(item => (
                item.options ? (
                  <div key={item.name} className="p-4 bg-white/30 backdrop-blur-md border border-gray-200 rounded-lg shadow-md">
                    <h3 className="font-medium">{item.name}</h3>
                    {item.options.map(option => (
                      <div key={option.name} className="flex justify-between items-center mb-2">
                        <span>{option.name} - {formatCurrency(option.price)}</span>
                        <button
                          onClick={() => addToCart(item, option.name)}
                          className="ml-4 bg-indigo-600 text-white py-1 px-3 rounded hover:bg-indigo-700"
                        >
                          Add to Cart
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div key={item.name} className="p-4 bg-white/30 backdrop-blur-md border border-gray-200 rounded-lg shadow-md flex justify-between items-center">
                    <span>{item.name} - {formatCurrency(item.price)}</span>
                    <button
                      onClick={() => addToCart(item)}
                      className="ml-4 bg-indigo-600 text-white py-1 px-3 rounded hover:bg-indigo-700"
                    >
                      Add to Cart
                    </button>
                  </div>
                )
              ))
            )}
          </div>
        </div>

        <div className="w-80 bg-white/30 backdrop-blur-md p-4 border border-gray-200 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">ITEMS</h2>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <div>
              <ul>
                {cart.map((item) => (
                  <li key={`${item.name}-${item.option}`} className="border-b py-2 flex justify-between items-center">
                    <span>
                      {item.name} ({item.option ? item.option : 'No option'}) (x{item.quantity}) - {formatCurrency(item.price * item.quantity)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item, item.option)}
                      className="ml-4 bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-4 text-right">
                <h3 className="text-xl font-semibold">Total: {formatCurrency(totalAmount)}</h3>
                <input
                  type="text"
                  placeholder="Cash Given"
                  className="mt-2 p-2 border border-gray-300 rounded"
                  value={cashGiven}
                  onChange={(e) => setCashGiven(Number(e.target.value))}
                />
                <button
                  onClick={handleCheckout}
                  className="mt-4 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
                >
                  Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-4">Receipt</h2>
            <div className="mb-4">
              <h3 className="text-lg font-medium">Items</h3>
              <ul>
                {cart.map((item, index) => (
                  <li key={index}>
                    {item.name} ({item.option ? item.option : 'No option'}) - {formatCurrency(item.price)} x {item.quantity}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-medium">Total: {formatCurrency(totalAmount)}</h3>
              <h3 className="text-lg font-medium">Cash Given: {formatCurrency(cashGiven)}</h3>
              <h3 className="text-lg font-medium">Change: {formatCurrency(change)}</h3>
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;