import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BellIcon, InboxIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import backgroundImage from '../assets/images/background2.jpg';


const formatCurrency = (amount) => `₱${amount.toLocaleString()}`;

function Home() {
  const [cart, setCart] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
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

  // Open and close modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

// FRONTEND: Updated handleConfirmPurchase for your React component
const handleConfirmPurchase = async () => {
  if (cart.length === 0) {
      alert('Cart is empty');
      return;
  }

  if (cashGiven < totalAmount) {
      alert('Insufficient cash given');
      return;
  }

  const transactionId = `T${Date.now()}`; // Generate unique transaction ID
  const createdAt = new Date().toISOString();

  const payload = {
      transaction_id: transactionId,
      created_at: createdAt,
      products: cart.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity
      })),
      total_amount: totalAmount
  };

  try {
      const response = await fetch('http://localhost:8081/api/transactions', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Transaction failed');
      }

      const result = await response.json();

      // Clear cart and close modal
      setCart([]);
      setCashGiven(0);
      closeModal();
      
      // Show success message
      alert('Transaction completed successfully!');
      
      // Refresh products list to show updated quantities
      if (selectedCategory) {
          handleCategoryClick(selectedCategory);
      }

  } catch (error) {
      console.error('Transaction failed:', error);
      alert(`Transaction failed: ${error.message}`);
  }
};

  const removeFromCart = (productId) => {
      setCart((prevCart) =>
        prevCart.filter((item) => item.product_id !== productId)
      );
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
      
        <div className="flex-1 p-4">
        <div className="flex flex-col h-full bg-white/80 rounded-lg shadow-md p-6">

          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">LCCB BOOKSTORE</h1>

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
            <div className="grid grid-cols-3 gap-4">
              {categories.map(category => (
                <button
                  key={category.value}
                  onClick={() => handleCategoryClick(category.value)}
                  className="p-4 bg-[#0442b1] text-white rounded-lg hover:bg-[#033387]"
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 border border-black rounded-lg placeholder-gray-600"
              placeholder="Search items..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            {products
              .filter(item => item.product_name && item.product_name.toLowerCase().includes(searchQuery.toLowerCase()))
              .map(item => (
                <div key={item.product_id} className="p-4 bg-[#0442b1] backdrop-blur-md border rounded-lg shadow-md flex justify-between items-center text-white">
                  <span>{item.product_name}</span>
                  <span className='ml-4'>Price: {formatCurrency(item.price)}</span>
                  <span className='ml-4'>Available: {item.quantity}</span>
                  <button onClick={() => addToCart(item)} className="ml-4 bg-green-600 text-white py-1 px-3 rounded hover:bg-green-800">
                    Add to Cart
                  </button>
                </div>
              ))}
          </div>
        </div>
        </div>

        {/* Cart Component */}
        <div className="w-64 bg-[#0442b1] backdrop-blur-md p-4 shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-white">ITEMS</h2>
          {cart.length === 0 ? (
            <p className='text-red-600 font-medium'>Your cart is empty.</p>
          ) : (
            <div>
              <ul>
              {cart.map((item) => (
                <li key={item.product_id} className="border-b py-2 flex justify-between items-center">
                  <span className='mr-2'>{item.product_name} (x{item.quantity}) - {formatCurrency(item.price * item.quantity)}</span>
                    <button
                      type='button'
                      onClick={() => removeFromCart(item.product_id)}
                      className="px-2 py-2 font-medium text-white bg-red-600 rounded hover:bg-red-800"
                    >
                      Remove
                    </button>
                </li>
              ))}
              </ul>
              
              <div className="mt-4 text-right">
                <h3 className="text-xl font-medium">Total: {formatCurrency(totalAmount)}</h3>
                <input
                  type="text"
                  placeholder="Cash Given"
                  className="mt-2 p-2 border border-gray-300 rounded w-full"
                  value={cashGiven}
                  onChange={(e) => setCashGiven(Number(e.target.value))}
                />
              </div>
              <button onClick={openModal} className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
                Complete Transaction
              </button>
            </div>
          )}
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
                className="w-1/2 bg-[#0442b1] text-white py-2 px-4 rounded hover:bg-[#033387]"
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