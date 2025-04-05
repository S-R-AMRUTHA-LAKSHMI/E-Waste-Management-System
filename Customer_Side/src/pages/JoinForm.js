import React, { useState } from "react";
import { motion } from "framer-motion";
import "./JoinForm.css";

const JoinForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you for joining, ${formData.name}! We will get in touch soon.`);
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <motion.div 
      className="join-form-container"
      initial={{ opacity: 0, scale: 0.8 }} 
      animate={{ opacity: 1, scale: 1 }} 
      transition={{ duration: 0.8 }}
    >
      <h1>Join the Movement</h1>
      <p>Fill in your details below to become a part of our e-waste reduction mission.</p>
      
      <form onSubmit={handleSubmit} className="join-form">
        <motion.input 
          type="text" 
          name="name" 
          placeholder="Your Name" 
          value={formData.name} 
          onChange={handleChange} 
          required 
          whileFocus={{ scale: 1.05 }}
        />

        <motion.input 
          type="email" 
          name="email" 
          placeholder="Your Email" 
          value={formData.email} 
          onChange={handleChange} 
          required 
          whileFocus={{ scale: 1.05 }}
        />

        <motion.input 
          type="tel" 
          name="phone" 
          placeholder="Your Phone Number" 
          value={formData.phone} 
          onChange={handleChange} 
          required 
          whileFocus={{ scale: 1.05 }}
        />

        <motion.textarea 
          name="message" 
          placeholder="Why do you want to join us?" 
          value={formData.message} 
          onChange={handleChange} 
          required 
          whileFocus={{ scale: 1.05 }}
        ></motion.textarea>

        <motion.button 
          type="submit" 
          className="submit-btn"
          whileHover={{ scale: 1.1 }}
        >
          Submit
        </motion.button>
      </form>
    </motion.div>
  );
};

export default JoinForm;
