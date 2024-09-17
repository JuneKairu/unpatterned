import React, { useState } from 'react';
import { BellIcon, InboxIcon } from '@heroicons/react/24/outline';

const categories = {
  electronics: [
    { name: 'TV', price: 50000 },
    { name: 'Laptop', price: 100000 },
    { name: 'Headphones', price: 5000 },
  ],
  groceries: [
    { name: 'Milk', price: 100 },
    { name: 'Bread', price: 75 },
    { name: 'Eggs', price: 150 },
  ],
  clothing: [
    { name: 'T-Shirt', price: 1000 },
    { name: 'Jeans', price: 2500 },
    { name: 'Jacket', price: 5000 },
  ],
};

const formatCurrency = (amount) => {
  return `₱${amount.toLocaleString()}`;
};

function Home() {
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const addToCart = (item) => {
    const itemInCart = cart.find((cartItem) => cartItem.name === item.name);
    if (itemInCart) {
      setCart(cart.map(cartItem =>
        cartItem.name === item.name ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (item) => {
    setCart(cart.filter(cartItem => cartItem.name !== item.name));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = () => {
    alert(`Total amount: ${formatCurrency(calculateTotal())}`);
    setCart([]);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const filteredItems = selectedCategory === 'all'
    ? Object.values(categories).flat()
    : categories[selectedCategory] || [];

  return (
    <div className="p-4">
      <div className="min-h-screen mx-auto flex space-x-8">
        <div className="flex-1 p-6 bg-white/30 backdrop-blur-md border border-gray-200 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">LCCB BOOKSTORE</h1>
            <div className="flex space-x-4">
              <button
                className="flex items-center space-x-2 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
                title="Notifications"
              >
                <BellIcon className="h-6 w-6" />
                <span>Notify</span>
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

          <div className="mb-6">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Select Category</label>
            <select
              id="category"
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white/80"
            >
              <option value="all">All Categories</option>
              {Object.keys(categories).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Products */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            {filteredItems.length === 0 ? (
              <p>No items available for the selected category.</p>
            ) : (
              filteredItems.map(item => (
                <div key={item.name} className="p-4 bg-white/30 backdrop-blur-md border border-gray-200 rounded-lg shadow-md flex justify-between items-center">
                  <span>{item.name} - {formatCurrency(item.price)}</span>
                  <button
                    onClick={() => addToCart(item)}
                    className="ml-4 bg-indigo-600 text-white py-1 px-3 rounded hover:bg-indigo-700"
                  >
                    Add to Cart
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Cart */}
        <div className="w-80 bg-white/30 backdrop-blur-md p-4 border border-gray-200 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">ITEMS</h2>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <div>
              <ul>
                {cart.map((item) => (
                  <li key={item.name} className="border-b py-2 flex justify-between items-center">
                    <span>
                      {item.name} (x{item.quantity}) - {formatCurrency(item.price * item.quantity)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item)}
                      className="ml-4 bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-4 text-right">
                <h3 className="text-xl font-semibold">Total: {formatCurrency(calculateTotal())}</h3>
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
    </div>
  );
}

export default Home;
