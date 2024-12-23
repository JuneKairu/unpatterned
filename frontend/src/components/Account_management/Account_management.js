import React, { useState, useEffect } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import Navbar from '../Navbar/Navbar';
import backgroundImage from '../../assets/images/background2.jpg';
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8081/' // Base URL for the API
});

function AccountManagement() {
    const [showAddAccountForm, setShowAddAccountForm] = useState(false);
    const [showUpdateAccountForm, setShowUpdateAccountForm] = useState(false);
    const [newAccountEmail, setNewAccountEmail] = useState('');
    const [newAccountPassword, setNewAccountPassword] = useState('');
    const [accounts, setAccounts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedAccount, setSelectedAccount] = useState(null);

    useEffect(() => {
        fetchAccounts();
    }, []);

    // Fetch accounts from the backend
    const fetchAccounts = async () => {
        try {
            const response = await api.get('api/accounts');
            setAccounts(response.data);
        } catch (error) {
            console.error('Error fetching accounts:', error);
        }
    };

    // Add a new account
    const handleAddAccount = async () => {
        try {
            if (!newAccountEmail || !newAccountPassword) {
                alert("Please fill in both email and password fields.");
                return;
            }
    
            const response = await api.post('api/signup', {
                email: newAccountEmail,
                password: newAccountPassword,
            });
    
            if (response.status === 201) {
                alert('Account created successfully!');
                setShowAddAccountForm(false);
                setNewAccountEmail('');
                setNewAccountPassword('');
                fetchAccounts(); // Refresh the account list
            } else if (response.status === 409) {
                alert('An account with this email already exists.');
            } else {
                alert('An unexpected error occurred. Please try again later.');
            }
        } catch (error) {
            console.error('Error creating account:', error);
            alert('Failed to add account. Please check your input and try again.');
        }
    };
    

    // Update an account
    const handleUpdateAccount = async () => {
        if (!selectedAccount || !selectedAccount.email || !selectedAccount.password) {
            alert("Please fill in all required fields.");
            return;
        }
    
        try {
            const response = await api.put(`api/accounts/${selectedAccount.id}`, {
                email: selectedAccount.email,
                password: selectedAccount.password,
            });
    
            if (response.status === 200) {
                alert('Account updated successfully!');
                setShowUpdateAccountForm(false);
                setSelectedAccount(null);
                fetchAccounts(); // Refresh account list
            } else {
                alert('An error occurred while updating the account. Please try again.');
            }
        } catch (error) {
            console.error('Error updating account:', error);
            alert('Failed to update account. Please check your input and try again.');
        }
    };
    
    

    // Delete an account
    const handleDeleteAccount = async (accountId) => {
        try {
            await api.delete(`api/accounts/${accountId}`);
            // Filter out the deleted account from the state
            setAccounts((prevAccounts) =>
                prevAccounts.filter((account) => account.id !== accountId)
            );
        } catch (error) {
            console.error('Error deleting account:', error);
        }
    };

    // Filter accounts based on search query
    const filteredAccounts = accounts.filter((account) =>
        account.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">ACCOUNT MANAGEMENT</h1>
                        <button
                            className="flex items-center space-x-2 p-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition-colors"
                            title="Notifications"
                        >
                            <BellIcon className="h-5 w-5" />
                            <span className="text-sm">Notifications</span>
                        </button>
                    </div>
                    {showAddAccountForm && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Add Account</h2>
            <input
                type="email"
                placeholder="Email"
                className="border border-gray-400 p-2 rounded w-full mb-4"
                value={newAccountEmail}
                onChange={(e) => setNewAccountEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                className="border border-gray-400 p-2 rounded w-full mb-4"
                value={newAccountPassword}
                onChange={(e) => setNewAccountPassword(e.target.value)}
            />
            <div className="flex justify-between">
                <button
                    className="bg-blue-500 text-white py-1.5 px-3 rounded hover:bg-blue-600 transition-colors"
                    onClick={handleAddAccount}
                >
                    Create Account
                </button>
                <button
                    className="bg-red-500 text-white py-1.5 px-3 rounded hover:bg-red-600 transition-colors"
                    onClick={() => setShowAddAccountForm(false)}
                >
                    Cancel
                </button>
            </div>
        </div>
    </div>
)}

{showUpdateAccountForm && selectedAccount && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Update Account</h2>
            <input
                type="email"
                placeholder="Email"
                className="border border-gray-400 p-2 rounded w-full mb-4"
                value={selectedAccount.email}
                onChange={(e) =>
                    setSelectedAccount({ ...selectedAccount, email: e.target.value })
                }
            />
            <input
                type="password"
                placeholder="New Password"
                className="border border-gray-400 p-2 rounded w-full mb-4"
                value={selectedAccount.password || ''}
                onChange={(e) =>
                    setSelectedAccount({ ...selectedAccount, password: e.target.value })
                }
            />
            <div className="flex justify-between">
                <button
                    className="bg-blue-500 text-white py-1.5 px-3 rounded hover:bg-blue-600 transition-colors"
                    onClick={handleUpdateAccount}
                >
                    Save Changes
                </button>
                <button
                    className="bg-red-500 text-white py-1.5 px-3 rounded hover:bg-red-600 transition-colors"
                    onClick={() => setShowUpdateAccountForm(false)}
                >
                    Cancel
                </button>
            </div>
        </div>
    </div>
)}



                    <button
                        className="bg-blue-700 text-white py-1.5 px-3 rounded hover:bg-blue-800 transition-colors text-sm"
                        onClick={() => setShowAddAccountForm(true)}
                    >
                        Add Account
                    </button>

                    <input
                        type="text"
                        placeholder="Search by email"
                        className="border border-gray-400 p-2 rounded w-full my-4"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />

                    <table className="table-auto w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-white">
                                <th className="border border-gray-300 px-4 py-2">ID</th>
                                <th className="border border-gray-300 px-4 py-2">Email</th>
                                <th className="border border-gray-300 px-4 py-2">Actions</th>
                                <th className="border border-gray-300 px-4 py-2">Total Sales</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAccounts.map((account) => (
                                <tr key={account.id} className="hover:bg-gray-100">
                                    <td className="border border-gray-300 px-4 py-2">{account.id}</td>
                                    <td className="border border-gray-300 px-4 py-2">{account.email}</td>
                                    <td className="border border-gray-300 px-4 py-2 flex gap-2">
                                        <button
                                            onClick={() => {
                                                setSelectedAccount(account);
                                                setShowUpdateAccountForm(true);
                                            }}
                                            className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600"
                                        >
                                            Update
                                        </button>
                                        <button
                                            onClick={() => handleDeleteAccount(account.id)}
                                            className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                    <button
                                            className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600"
                                        >
                                            View Sales
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
        </div>
    );
}

export default AccountManagement;
