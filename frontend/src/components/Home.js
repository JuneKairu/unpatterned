import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BellIcon, InboxIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';

const formatCurrency = (amount) => `₱${amount.toLocaleString()}`;

function Home() {
  const [cart, setCart] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categorySearch, setCategorySearch] = useState('');
  const [cashGiven, setCashGiven] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  // Fetch categories on component mount
  useEffect(() => {
    fetch('http://localhost:8081/api/categories')
      .then(response => response.json())
      .then(data => {
        console.log('Categories fetched:', data);
        setCategories(data.map(category => ({
          value: category.category_id,
          label: category.category_name,
        })));
      })
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  // Fetch products based on selected category
  const handleCategoryClick = (category_id) => {
    setSelectedCategory(category_id);
    fetch(`http://localhost:8081/api/products/${category_id}`)
      .then(response => response.json())
      .then(data => {
        console.log(`Products for category ${category_id}:`, data);
        setProducts(data || []);
      })
      .catch(error => console.error('Error fetching products:', error));
  };

  // Filter categories based on search
  const filteredCategories = categories.filter(category =>
    category.label.toLowerCase().includes(categorySearch.toLowerCase())
  );

  // Add item to cart with quantity deduction from stock
  const addToCart = (item) => {
    if (item.quantity === 0) {
      alert("Item is out of stock!");
      return;
    }

    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.product_id === item.product_id
          ? { ...product, quantity: product.quantity - 1 }
          : product
      )
    );

    setCart((prevCart) => {
      const itemInCart = prevCart.find((cartItem) => cartItem.product_id === item.product_id);
      if (itemInCart) {
        return prevCart.map((cartItem) =>
          cartItem.product_id === item.product_id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  // Remove or decrement item in cart
  const decrementCartItem = (item) => {
    setCart((prevCart) =>
      prevCart
        .map((cartItem) =>
          cartItem.product_id === item.product_id
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        )
        .filter((cartItem) => cartItem.quantity > 0)
    );

    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.product_id === item.product_id
          ? { ...product, quantity: product.quantity + 1 }
          : product
      )
    );
  };

  const calculateTotal = () => cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleLogout = () => {
    alert('Logged out successfully');
    navigate('/');
  };

  const totalAmount = calculateTotal();
  const change = cashGiven - totalAmount;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleConfirmPurchase = () => {
    alert("Purchase confirmed!");
    setCart([]);
    setCashGiven(0);
    closeModal();
  };

  return (
    <div className="p-4 font-sans">
      <div className="min-h-screen mx-auto flex space-x-8">
        <div className="flex-1 p-6 bg-blue/80 border-gray-200 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">LCCB BOOKSTORE</h1>
            <div className="flex space-x-4">
              <button className="flex items-center space-x-2 p-2 bg-[#0442b1] text-white rounded-md hover:bg-[#033387]" title="Notifications">
                <BellIcon className="h-6 w-6" />
                <span>Notifications</span>
              </button>
              <button className="flex items-center space-x-2 p-2 bg-[#0442b1] text-white rounded-md hover:bg-[#033387]" title="Inventory">
                <InboxIcon className="h-6 w-6" />
                <span>Inventory</span>
              </button>
              <button onClick={handleLogout} className="flex items-center space-x-2 p-2 bg-red-600 text-white rounded-md hover:bg-red-700" title="Logout">
                <ArrowLeftOnRectangleIcon className="h-6 w-6" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-700">Product Categories</h2>
            <div className="mb-4">
              <input
                type="text"
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                placeholder="Search categories..."
              />
              <div className="grid grid-cols-3 gap-4">
                {filteredCategories.map(category => (
                  <button
                    key={category.value}
                    onClick={() => handleCategoryClick(category.value)}
                    className={`p-4 ${
                      selectedCategory === category.value 
                        ? 'bg-indigo-700' 
                        : 'bg-indigo-600'
                    } text-white rounded-lg hover:bg-indigo-700`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
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
            {products
              .filter(item => item.product_name && item.product_name.toLowerCase().includes(searchQuery.toLowerCase()))
              .map(item => (
                <div key={item.product_id} className="p-4 bg-white/30 backdrop-blur-md border border-gray-200 rounded-lg shadow-md">
                  <div className="flex flex-col space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="font-medium">{item.product_name}</span>
                      <span className="font-bold">{formatCurrency(item.price)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Stock: {item.quantity}</span>
                      <button 
                        onClick={() => addToCart(item)} 
                        className="bg-indigo-600 text-white py-1 px-3 rounded hover:bg-indigo-700 disabled:bg-gray-400"
                        disabled={item.quantity === 0}
                      >
                        {item.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Cart Component */}
        <div className="w-80 bg-white/30 backdrop-blur-md p-4 border border-gray-200 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">ITEMS</h2>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <div>
              <ul>
                {cart.map((item) => (
                  <li key={item.product_id} className="border-b py-2 flex justify-between items-center">
                    <span>{item.product_name} (x{item.quantity}) - {formatCurrency(item.price * item.quantity)}</span>
                    <button
                      onClick={() => decrementCartItem(item)}
                      className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
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
                  className="mt-2 p-2 border border-gray-300 rounded w-full"
                  value={cashGiven}
                  onChange={(e) => setCashGiven(Number(e.target.value))}
                />
              </div>
              <button 
                onClick={openModal} 
                className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:bg-gray-400"
                disabled={cart.length === 0 || cashGiven < totalAmount}
              >
                Complete Transaction
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Receipt */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Receipt</h2>
            <ul>
              {cart.map((item) => (
                <li key={item.product_id} className="flex justify-between">
                  <span>{item.product_name} x{item.quantity}</span>
                  <span>{formatCurrency(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <hr className="my-2" />
            <div className="flex justify-between">
              <span>Total:</span>
              <span>{formatCurrency(totalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Cash Given:</span>
              <span>{formatCurrency(cashGiven)}</span>
            </div>
            <div className="flex justify-between">
              <span>Change:</span>
              <span>{formatCurrency(change)}</span>
            </div>
            <div className="mt-4 flex space-x-2">
              <button
                onClick={closeModal}
                className="w-1/2 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              >
                Back
              </button>
              <button
                onClick={handleConfirmPurchase}
                className="w-1/2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Confirm Purchase
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;