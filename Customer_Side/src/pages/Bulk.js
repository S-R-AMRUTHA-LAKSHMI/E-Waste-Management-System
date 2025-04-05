import React, { useState } from "react";
import "./Bulk.css"; // Ensure this file exists and is correctly imported

const BulkOrderForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    products: [{ name: "", quantity: 1 }],
  });

  const handleChange = (index, event) => {
    const newProducts = [...formData.products];
    newProducts[index][event.target.name] = event.target.value;
    setFormData({ ...formData, products: newProducts });
  };

  const addProduct = () => {
    setFormData({
      ...formData,
      products: [...formData.products, { name: "", quantity: 1 }],
    });
  };

  const removeProduct = (index) => {
    const newProducts = formData.products.filter((_, i) => i !== index);
    setFormData({ ...formData, products: newProducts });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Bulk Order Data:", formData);

    // Formatting the order details for alert
    const orderDetails = formData.products
      .map((product, index) => `${index + 1}. ${product.name} (Qty: ${product.quantity})`)
      .join("\n");

    alert(
      `Order Submitted Successfully!\n\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\n\nOrder Details:\n${orderDetails}`
    );

    // Optionally, reset form after submission
    setFormData({
      name: "",
      email: "",
      phone: "",
      products: [{ name: "", quantity: 1 }],
    });
  };

  return (
    <div className="bulk-container">
      <h2 className="text-xl font-bold mb-4 text-center">Bulk Order Placement</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          className="input-field"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          className="input-field"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          className="input-field"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
        />

        <h3 className="order-details">Order Details</h3>
        {formData.products.map((product, index) => (
          <div key={index} className="product-item">
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              className="product-input"
              value={product.name}
              onChange={(e) => handleChange(index, e)}
              required
            />
            <input
              type="number"
              name="quantity"
              min="1"
              className="quantity-input"
              value={product.quantity}
              onChange={(e) => handleChange(index, e)}
              required
            />
            <button
              type="button"
              className="remove-btn"
              onClick={() => removeProduct(index)}
            >
              X
            </button>
          </div>
        ))}

        <button type="button" className="add-btn" onClick={addProduct}>
          + Add Product
        </button>

        <button type="submit" className="submit-btn">
          Submit Order
        </button>
      </form>
    </div>
  );
};

export default BulkOrderForm;
