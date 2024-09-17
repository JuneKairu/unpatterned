import React from 'react';

const categories = {
  electronics: ['TV', 'Laptop', 'Headphones'],
  groceries: ['Milk', 'Bread', 'Eggs'],
  clothing: ['T-Shirt', 'Jeans', 'Jacket'],
};

function Home() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">POS System</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.keys(categories).map(category => (
          <div key={category} className="p-4 rounded-lg bg-white shadow-md">
            <h2 className="text-xl font-semibold mb-4 capitalize">{category}</h2>
            <ul>
              {categories[category].map(item => (
                <li key={item} className="border-b py-2">{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
