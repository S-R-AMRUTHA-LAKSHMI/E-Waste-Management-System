import React from "react";
import { motion } from "framer-motion";
import "./AboutUs.css";

const Blogs = () => {
  return (
    <div className="about-container">
      {/* Hero Section */}
      <motion.div 
        className="about-hero"
        initial={{ opacity: 0, y: -50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 1 }}
      >
        <h1>About Us</h1>
        <p>Creating a sustainable future by managing e-waste responsibly.</p>
      </motion.div>

      {/* Mission Section */}
      <motion.div 
        className="about-section"
        initial={{ opacity: 0, x: -100 }} 
        whileInView={{ opacity: 1, x: 0 }} 
        transition={{ duration: 1 }}
      >
        <h2>Our Mission</h2>
        <p>
          Our goal is to reduce electronic waste by promoting <strong>recycling, reusing, and responsible disposal</strong>. 
          We are committed to spreading awareness and providing easy solutions to manage e-waste effectively.
        </p>
      </motion.div>

      {/* Vision Section */}
      <motion.div 
        className="about-section"
        initial={{ opacity: 0, x: 100 }} 
        whileInView={{ opacity: 1, x: 0 }} 
        transition={{ duration: 1 }}
      >
        <h2>Our Vision</h2>
        <p>
          We envision a world where electronic waste is minimized and valuable materials are repurposed. 
          By working together, we can create a <strong>greener planet</strong> for future generations.
        </p>
      </motion.div>

      <motion.div 
        className="about-section"
        initial={{ opacity: 0, x: 100 }} 
        whileInView={{ opacity: 1, x: 0 }} 
        transition={{ duration: 1 }}
      >
        <h2>How We Work?</h2>
        <p>
         Request a Pickup
         choose a time
         we collect and recycle your e waste!
        </p>
      </motion.div>

      {/* Core Values Section */}
      <motion.div 
        className="about-section"
        initial={{ opacity: 0, y: 100 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        transition={{ duration: 1 }}
      >
        <h2>Our Core Values</h2>
        <ul>
          <li>🌱 <strong>Sustainability:</strong> We strive for an eco-friendly future.</li>
          <li>💡 <strong>Innovation:</strong> Finding creative solutions for waste management.</li>
          <li>🤝 <strong>Community:</strong> Empowering people to make a difference.</li>
          <li>🔄 <strong>Responsibility:</strong> Ensuring ethical and sustainable practices.</li>
        </ul>
      </motion.div>
      <motion.div 
  className="about-section contact"
  initial={{ opacity: 0, y: 50, scale: 0.9 }} 
  whileInView={{ opacity: 1, y: 0, scale: 1 }} 
  transition={{ duration: 0.8, ease: "easeOut", bounce: 0.3 }}
  whileHover={{ scale: 1.02 }}
>
  <h2>Contact Us</h2>
  <p>Got questions or need assistance? Feel free to reach out to us!</p>
  
  <motion.p 
    initial={{ opacity: 0, x: -20 }} 
    whileInView={{ opacity: 1, x: 0 }} 
    transition={{ duration: 0.6, delay: 0.2 }}
  >
    <strong>Email:</strong> <a href="mailto:ewaste@gmail.com">ewaste@gmail.com</a>
  </motion.p>

  <motion.p 
    initial={{ opacity: 0, x: 20 }} 
    whileInView={{ opacity: 1, x: 0 }} 
    transition={{ duration: 0.6, delay: 0.3 }}
  >
    <strong>Phone:</strong> <a href="tel:+919876543210">+91 9876543210</a>
  </motion.p>
</motion.div>



      {/* Call to Action */}
      <motion.div 
        className="cta-section"
        initial={{ scale: 0.8 }} 
        whileInView={{ scale: 1 }} 
        transition={{ duration: 0.5 }}
      >
        <h2>Join Us in Making a Change!</h2>
        <p>
          Together, we can create a cleaner, greener world. Be a part of our mission today!
        </p>
        <button className="cta-btn">Get Involved</button>
      </motion.div>
    </div>
  );
};

export default Blogs;
