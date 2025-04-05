import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './Items.css';  // Import the updated CSS for styling

const categories = [
  {
    title: 'Information and Communication Tech Devices',
    items: [
      { name: 'Smartphone', rate: '$50' },
      { name: 'Laptop', rate: '$100' },
      { name: 'Tablet', rate: '$40' },
    ],
  },
  {
    title: 'Home Appliances',
    items: [
      { name: 'Refrigerator', rate: '$150' },
      { name: 'Washing Machine', rate: '$100' },
      { name: 'Microwave', rate: '$80' },
    ],
  },
  {
    title: 'Home Entertainment Devices',
    items: [
      { name: 'TV', rate: '$120' },
      { name: 'Home Theater', rate: '$200' },
      { name: 'Speaker', rate: '$50' },
    ],
  },
  {
    title: 'Electronic Utilities',
    items: [
      { name: 'Air Conditioner', rate: '$250' },
      { name: 'Heater', rate: '$150' },
      { name: 'Electric Fan', rate: '$30' },
    ],
  },
  {
    title: 'Office/Medical Equipment',
    items: [
      { name: 'Printer', rate: '$75' },
      { name: 'Scanner', rate: '$60' },
      { name: 'Medical Monitor', rate: '$200' },
    ],
  },
  {
    title: 'Other Categories',
    items: [
      { name: 'Battery', rate: '$10' },
      { name: 'Power Adapter', rate: '$15' },
      { name: 'Wires/Cables', rate: '$5' },
    ],
  },
];

const Items = () => {
  const [activeCategory, setActiveCategory] = useState(null);

  const toggleCategory = (index) => {
    setActiveCategory(activeCategory === index ? null : index);
  };

  return (
    <div className="items-container">
      {categories.map((category, idx) => (
        <motion.div
          key={idx}
          className="category-table"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: idx * 0.2 }}
        >
          {/* Category Header - Click to toggle visibility of items */}
          <h2 
            onClick={() => {
              toggleCategory(idx);
              document.getElementById(`category-${idx}`).classList.toggle("active");
            }}
            id={`category-${idx}`}
          >
            {category.title}
            <span className="toggle-icon">+</span>
          </h2>

          {/* Category Items - Visible only if this category is active */}
          {activeCategory === idx && (
            <div className="category-items">
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {category.items.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.name}</td>
                      <td>{item.rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default Items;
