import React, { useState } from 'react';
import Select from 'react-select';
import { BellIcon, InboxIcon } from '@heroicons/react/24/outline';

const categories = {
  uniforms: [
    { name: 'SBIT Departmental Shirt', price: 500 },
    { name: 'PE Uniform (College) - Shirt', price: 300 },
    { name: 'SHTM Departmental Shirt (Medium)', price: 550 },
    { name: 'SSLATE Departmental Shirt', price: 750 },
    { name: 'PE Uniform (College) - Pants', price: 300 },
    { name: 'SARFAID Departmental Shirt', price: 500 },
    { name: 'SHTM Departmental Shirt', price: 550 },
  ],
  schoolsupplies: [
    { name: 'Yellow Pad', price: 75 },
    { name: 'Intermediate Pad', price: 75 },
    { name: 'Eggs', price: 150 },
  ],
  others: [
    { name: 'Sanitary Pads', price: 10 },
    { name: 'Jeans', price: 2500 },
    { name: 'Jacket', price: 5000 },
  ],
};

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cashGiven, setCashGiven] = useState(0);

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

  const handleCategoryChange = (selectedOptions) => {
    setSelectedCategories(selectedOptions ? selectedOptions.map(option => option.value) : []);
  };

  const filteredItems = selectedCategories.length === 0
    ? Object.values(categories).flat()
    : Object.entries(categories).flatMap(([category, items]) =>
        selectedCategories.includes(category) ? items : []
      );

  const totalAmount = calculateTotal();
  const change = cashGiven - totalAmount;

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

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            {filteredItems.length === 0 ? (
              <p>No items available for the selected categories.</p>
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
                <h3 className="text-xl font-semibold">Total: {formatCurrency(totalAmount)}</h3>
                <input
                  type="number"
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
                {cart.map(item => (
                  <li key={item.name} className="border-b py-2 flex justify-between items-center">
                    <span>{item.name} (x{item.quantity}) - {formatCurrency(item.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-4 text-right">
              <h3 className="text-xl font-semibold">Total: {formatCurrency(totalAmount)}</h3>
              <h3 className="text-xl font-semibold">Cash: {formatCurrency(cashGiven)}</h3>
              <h3 className="text-xl font-semibold">Change: {formatCurrency(change)}</h3>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400"
              >
                Close
              </button>
              <button
                onClick={async () => {
                  try {
                    const response = await fetch('http://localhost:4000/print', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        cart,
                        total: totalAmount,
                        cashGiven,
                        change,
                      }),
                    });

                    if (response.ok) {
                      console.log('Receipt printed successfully!');
                      setIsModalOpen(false);
                      setCart([]);
                      setCashGiven(0);
                    } else {
                      console.error('Failed to print receipt.');
                    }
                  } catch (error) {
                    console.error('Error:', error);
                  }
                }}
                className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
              >
                Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
