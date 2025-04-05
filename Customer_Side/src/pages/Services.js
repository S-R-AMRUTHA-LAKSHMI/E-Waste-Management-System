import React from "react";
import { motion } from "framer-motion";
import "./Services.css";
import r2 from '../assets/r2.png';
import estewards from '../assets/estewards.png';
import { useNavigate } from 'react-router-dom';

const Services = () => {
  const navigate = useNavigate();  // Moved inside the component

  return (
    <div className="services-container">
      {/* Hero Section */}
      <motion.div 
        className="services-hero"
        initial={{ opacity: 0, y: -50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 1 }}
      >
        <h1>WhyCle - Empowering the Future</h1>
        <p>Making a Difference by Reducing E-Waste Through Innovative Solutions.</p>
      </motion.div>

      {/* Service Highlights */}
      <motion.div 
        className="service-highlight"
        initial={{ opacity: 0, x: -100 }} 
        whileInView={{ opacity: 1, x: 0 }} 
        transition={{ duration: 1 }}
      >
      <br/>
        <h2>Our Key Services</h2>
        <ul>
          <li>🌱 <strong>E-Waste Collection:</strong> Request a pickup for responsible recycling.</li>
          <li>🔄 <strong>Certified Recycling Process:</strong> Our certified partners ensure all materials are safely recycled.</li>
          <li>♻️ <strong>Repurposing Electronics:</strong> We help repurpose valuable materials for new products.</li>
        </ul>
      </motion.div>

      {/* Certifications Section */}
      <motion.div 
        className="certifications-section"
        initial={{ opacity: 0, y: 700 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        transition={{ duration: 1 }}
      >
        <h2>Our Certifications</h2>
        <p>
          WhyCle is certified by leading environmental organizations to ensure our processes align with global e-waste recycling standards. Our certifications include:
        </p>
        <div className="certifications-list">
          <img src={r2} alt="R2 Certification" />
          <img src={estewards} alt="E-Stewards Certification" />
        </div>
      </motion.div>

      {/* Awareness Video Section */}
      <motion.div 
        className="video-section"
        initial={{ opacity: 0, x: 100 }} 
        whileInView={{ opacity: 1, x: 0 }} 
        transition={{ duration: 1 }}
      >
        <h2>Raising Awareness</h2>
        <p>
          Join our mission by watching the following videos, where we explain the significance of responsible e-waste management and how you can contribute to a sustainable future.
        </p>
        <div className="video-container">
          <iframe 
            width="315" 
            height="215" 
            src="https://www.youtube.com/embed/bEw34DyFBS4" 
            title="WhyCle Awareness Video" 
            frameBorder="0" 
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          ></iframe>

          <iframe 
            width="315" 
            height="215" 
            src="https://www.youtube.com/embed/HV2Ir1e513o" 
            title="WhyCle Sustainability Video" 
            frameBorder="0" 
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          ></iframe>

          <iframe 
            width="315" 
            height="215" 
            src="https://www.youtube.com/embed/FoSc5h4yxHc" 
            title="WhyCle E-Waste Impact Video" 
            frameBorder="0" 
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          ></iframe>
        </div>
      </motion.div>

      {/* Testimonials Section */}
      <motion.div 
        className="testimonials-section"
        initial={{ opacity: 0 }} 
        whileInView={{ opacity: 1 }} 
        transition={{ duration: 1 }}
      >
        <h2>What Our Supporters Say</h2>
        <p>"WhyCle helped me recycle my old gadgets hassle-free!" - Alex R.</p>
        <p>"An excellent initiative for a cleaner planet." - Priya D.</p>
      </motion.div>

      {/* Call to Action */}
      <motion.div 
        className="cta-section"
        initial={{ scale: 0.8 }} 
        whileInView={{ scale: 1 }} 
        transition={{ duration: 0.5 }}
      >
        <h2>Take Action Now!</h2>
        <p>
          Become part of our global initiative to reduce e-waste and create a sustainable environment. Together, we can make a real impact.
        </p>
        <button className="cta-btn" onClick={() => navigate('/join')}>
          Join the Movement
        </button>
      </motion.div>
    </div>
  );
};

export default Services;
