import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BellIcon, InboxIcon, UserCircleIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import html2canvas from 'html2canvas';
import InventoryModal from '../components/modals/InventoryModal';
import NotificationModal from '../components/modals/NotificationModal';

const formatCurrency = (amount) => `₱${amount.toLocaleString()}`;

function Home() {
  const [cart, setCart] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [cashGiven, setCashGiven] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const navigate = useNavigate();
  const receiptRef = useRef(null);

  const handleInventoryClick = () => {
    setIsInventoryModalOpen(true);
  };

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

  const addToCart = (item, inputQuantity = 1) => {
    const quantityToAdd = parseInt(inputQuantity);
    
    if (isNaN(quantityToAdd) || quantityToAdd <= 0) {
      alert("Please enter a valid quantity!");
      return;
    }

    if (item.quantity < quantityToAdd) {
      alert("Not enough stock available!");
      return;
    }

    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.product_id === item.product_id
          ? { ...product, quantity: product.quantity - quantityToAdd }
          : product
      )
    );

    setCart((prevCart) => {
      const itemInCart = prevCart.find((cartItem) => cartItem.product_id === item.product_id);
      if (itemInCart) {
        return prevCart.map((cartItem) =>
          cartItem.product_id === item.product_id
            ? { ...cartItem, quantity: cartItem.quantity + quantityToAdd }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: quantityToAdd }];
      }
    });
  };

  // New function to update cart item quantity directly
  const updateCartItemQuantity = (item, newQuantity) => {
    const parsedQuantity = parseInt(newQuantity);
    
    if (isNaN(parsedQuantity) || parsedQuantity < 0) {
      alert("Please enter a valid quantity!");
      return;
    }

    const currentCartItem = cart.find(cartItem => cartItem.product_id === item.product_id);
    const quantityDifference = currentCartItem.quantity - parsedQuantity;

    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.product_id === item.product_id
          ? { ...product, quantity: product.quantity + quantityDifference }
          : product
      )
    );

    setCart(prevCart =>
      prevCart.map(cartItem =>
        cartItem.product_id === item.product_id
          ? { ...cartItem, quantity: parsedQuantity }
          : cartItem
      ).filter(cartItem => cartItem.quantity > 0)
    );
  };

  const decrementCartItem = (item) => {
    updateCartItemQuantity(item, item.quantity - 1);
  };

  const calculateTotal = () => cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleLogout = () => {
    alert('Logged out successfully');
    navigate('/');
  };

  // New function to export receipt as image
  const exportReceipt = async () => {
    const receiptContent = receiptRef.current;
    
    if (receiptContent) {
      try {
        // Set specific options for html2canvas
        const canvas = await html2canvas(receiptContent, {
          backgroundColor: 'white',
          scale: 2, // Higher resolution
          logging: false,
          useCORS: true,
          onclone: (clonedDoc) => {
            // Ensure the cloned element maintains styling
            const clonedReceipt = clonedDoc.querySelector('.receipt-content');
            if (clonedReceipt) {
              clonedReceipt.style.padding = '20px';
              clonedReceipt.style.background = 'white';
            }
          }
        });
  
        // Convert to image and trigger download
        const image = canvas.toDataURL('image/png', 1.0);
        const link = document.createElement('a');
        link.href = image;
        link.download = `LCCB-Receipt-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Error exporting receipt:', error);
        alert('Failed to export receipt');
      }
    }
  };
  const totalAmount = calculateTotal();
  const change = cashGiven - totalAmount;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Updated handleConfirmPurchase with receipt export
  const handleConfirmPurchase = async () => {
    if (cart.length === 0) {
      alert('Cart is empty');
      return;
    }

    if (cashGiven < totalAmount) {
      alert('Insufficient cash given');
      return;
    }

    const transactionId = `T${Date.now()}`;
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

      await exportReceipt();
      
      const result = await response.json();
      setCart([]);
      setCashGiven(0);
      closeModal();
      alert('Transaction completed successfully!');
      
      if (selectedCategory) {
        handleCategoryClick(selectedCategory);
      }

    } catch (error) {
      console.error('Transaction failed:', error);
      alert(`Transaction failed: ${error.message}`);
    }
  };

  const removeFromCart = (productId) => {
    const itemToRemove = cart.find(item => item.product_id === productId);
    if (itemToRemove) {
      setProducts(prevProducts =>
        prevProducts.map(product =>
          product.product_id === productId
            ? { ...product, quantity: product.quantity + itemToRemove.quantity }
            : product
        )
      );
    }
    setCart((prevCart) => prevCart.filter((item) => item.product_id !== productId));
  };

  return (
    <div className="flex" style={{ backgroundColor: 'white', minHeight: '100vh' }}>
      <div className="flex-1 p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#03045e]">LCCB BOOKSTORE</h1>

          <div className="flex space-x-4">
            <button 
              onClick={() => setIsNotificationModalOpen(true)} 
              className="flex items-center space-x-2 p-2 bg-[#1565C0] text-white rounded-md hover:bg-[#0D47A1]" 
              title="Notifications"
            >
              <BellIcon className="h-6 w-6" />
              <span>Notifications</span>
            </button>
            <NotificationModal 
  isOpen={isNotificationModalOpen} 
  onClose={() => setIsNotificationModalOpen(false)} 
/>
<InventoryModal 
  isOpen={isInventoryModalOpen} 
  onClose={() => setIsInventoryModalOpen(false)} 
/>

            <button 
              className="flex items-center space-x-2 p-2 bg-green-700 text-white rounded-md hover:bg-green-800" 
              title="Profile"
            >
              <UserCircleIcon className="h-6 w-6" />
              <span>Profile</span>
            </button>

            <button 
              onClick={handleInventoryClick} 
              className="flex items-center space-x-2 p-2 bg-[#1565C0] text-white rounded-md hover:bg-[#0D47A1]" 
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
          <h2 className="text-lg font-medium text-gray-700">Product Categories</h2>
          <div className="grid grid-cols-3 gap-4">
            {categories.map(category => (
              <button
                key={category.value}
                onClick={() => handleCategoryClick(category.value)}
                className="p-4 bg-[#1565C0] text-white rounded-lg hover:bg-[#0D47A1]"
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
              <div key={item.product_id} className="p-4 bg-[#1565C0] backdrop-blur-md border rounded-lg shadow-md flex flex-col text-white">
                <div className="flex justify-between items-center mb-2">
                  <span>{item.product_name}</span>
                  <span>Price: {formatCurrency(item.price)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Available: {item.quantity}</span>
                  <div className="flex items-center">
                    <input
                      type="number"
                      min="1"
                      max={item.quantity}
                      defaultValue="1"
                      className="w-16 p-1 mr-2 text-black rounded"
                      onChange={(e) => e.target.value = Math.min(Math.max(1, e.target.value), item.quantity)}
                    />
                    <button 
                      onClick={() => addToCart(item, document.querySelector(`input[type="number"]`).value)}
                      className="bg-green-600 text-white py-1 px-3 rounded hover:bg-green-800"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Updated Cart Component */}
      <div className="w-72 bg-[#1565C0] backdrop-blur-md p-4 shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-white">ORDERED ITEMS</h2>
        {cart.length === 0 ? (
          <p className='text-black font-medium'>Your cart is empty.</p>
        ) : (
          <div>
            <ul>
              {cart.map((item) => (
                <li key={item.product_id} className="border-b py-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white">{item.product_name}</span>
                    <button
                      onClick={() => removeFromCart(item.product_id)}
                      className="px-2 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-800"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateCartItemQuantity(item, e.target.value)}
                      className="w-20 p-1 text-black rounded"
                    />
                    <span className="text-white">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            
            <div className="mt-4 text-right">
              <h3 className="text-xl font-medium text-white">Total: {formatCurrency(totalAmount)}</h3>
              <input
                type="number"
                placeholder="Cash Given"
                className="mt-2 p-2 border border-gray-300 rounded w-full text-black"
                value={cashGiven}
                onChange={(e) => setCashGiven(Number(e.target.value))}
              />
            </div>
            <button 
              onClick={openModal} 
              className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
            >
              Complete Transaction
            </button>
          </div>
        )}
      </div>
{/* Updated Receipt Modal */}
{isModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      {/* Separate container for receipt content */}
      <div ref={receiptRef} className="receipt-content bg-white mb-6">
        <h2 className="text-2xl font-bold mb-4 text-center">LCCB BOOKSTORE</h2>
        <p className="text-center text-sm mb-4">Transaction Receipt</p>
        <div className="border-b pb-2 mb-4">
          <p className="text-center text-sm text-gray-600">
            Transaction ID: T{Date.now()}
            <br />
            Date: {new Date().toLocaleString()}
          </p>
        </div>
        <ul className="mb-4">
          {cart.map((item) => (
            <li key={item.product_id} className="flex justify-between mb-2">
              <div>
                <span>{item.product_name}</span>
                <br />
                <span className="text-sm text-gray-600">
                  x{item.quantity} @ {formatCurrency(item.price)}
                </span>
              </div>
              <div>{formatCurrency(item.quantity * item.price)}</div>
            </li>
          ))}
        </ul>
        <div className="border-t pt-4">
          <div className="flex justify-between font-bold mb-2">
            <span>Total</span>
            <span>{formatCurrency(totalAmount)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Cash Given:</span>
            <span>{formatCurrency(cashGiven)}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span>Change:</span>
            <span>{formatCurrency(change)}</span>
          </div>
          <p className="text-center text-sm text-gray-600 mt-4">
            Thank you for shopping!
          </p>
        </div>
      </div>

      {/* Separate container for buttons */}
      <div className="flex justify-between space-x-4">
        <button 
          onClick={closeModal} 
          className="w-1/2 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
        >
          Close
        </button>
        <button
          onClick={handleConfirmPurchase}
          className="w-1/2 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
        >
          Confirm Purchase
        </button>
      </div>
    </div>
  </div>
)}

      {/* Inventory Modal */}
      {isInventoryModalOpen && <InventoryModal closeModal={() => setIsInventoryModalOpen(false)} />}
      {/* Notification Modal */}
      {isNotificationModalOpen && <NotificationModal closeModal={() => setIsNotificationModalOpen(false)} />}
    </div>
  );
}

export default Home;
