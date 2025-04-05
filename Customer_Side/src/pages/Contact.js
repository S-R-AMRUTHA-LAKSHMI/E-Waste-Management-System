import React from "react";
import { motion } from "framer-motion";
import { FaWrench } from "react-icons/fa"; // Icon for mechanic (using react-icons)
import "./Contact.css";

const Contact = () => {
  const companies = [
    {
      name: "E-Waste Solutions Pvt Ltd",
      landmark: "Near Green Park, New Delhi",
      email: "contact@ewastesolutions.com",
      phone: "+91 9876543210",
      rating: 4.5
    },
    {
      name: "Recycle Tech Industries",
      landmark: "MG Road, Bangalore",
      email: "support@recycletech.com",
      phone: "+91 9123456789",
      rating: 4.0
    },
    {
      name: "Eco Reclaimers",
      landmark: "Sector 62, Noida",
      email: "info@ecoreclaimers.in",
      phone: "+91 9988776655",
      rating: 4.7
    },
    {
      name: "Green Earth E-Waste Management",
      landmark: "Powai, Mumbai",
      email: "hello@greenearth.com",
      phone: "+91 9765432100",
      rating: 4.3
    },
  ];

  const mechanics = [
    {
      name: "Revi Kumar M",
      landmark:"10 years Experience in Mobile handling",
      email: "contact@ewastesolutions.com",
      phone: "+91 9876543210",
      rating: 4.5
    },
    {
      name: "Krishna Kumar",
      landmark: "6 years Experience Laptop Handling",
      email: "support@recycletech.com",
      phone: "+91 9123456789",
      rating: 4.0
    },
    {
      name: "Ram",
      landmark: "12 years Experience in Oven handling",
      email: "info@ecoreclaimers.in",
      phone: "+91 9988776655",
      rating: 4.7
    },
    {
      name: "Pradeep",
      landmark: "4 years Experience in Scrap handling",
      email: "hello@greenearth.com",
      phone: "+91 9765432100",
      rating: 4.3
    },
  ];

  return (
    <div className="contact-container">
      <motion.h1
        className="contact-title"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Contact Us
      </motion.h1>
      <br />
      <motion.p
        className="contact-intro"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        Find the best e-waste management companies near you. Reach out to them for responsible recycling solutions.
      </motion.p>

      <div className="contact-list">
        {companies.map((company, index) => (
          <motion.div
            key={index}
            className="contact-card"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
          >
            <h2>{company.name}</h2>
            <p>
              <strong>📍 Landmark:</strong> {company.landmark}
            </p>
            <p>
              <strong>✉️ Email:</strong> <a href={`mailto:${company.email}`}>{company.email}</a>
            </p>
            <p>
              <strong>📞 Phone:</strong> <a href={`tel:${company.phone}`}>{company.phone}</a>
            </p>
            <p>
              <strong>⭐ Rating:</strong> {"★".repeat(Math.floor(company.rating))}
              {company.rating % 1 !== 0 ? "½" : ""}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Mechanics Section */}
      <div className="mechanics-section">
        <motion.h2
          className="mechanics-title"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Our Trusted Mechanics
        </motion.h2>
        <div className="mechanics-list">
          {mechanics.map((mechanic, index) => (
            <motion.div
              key={index}
              className="mechanics-card"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div className="mechanic-header">
                <FaWrench style={{ fontSize: "24px", color: "#27ae60" }} />
                <h3>{mechanic.name}</h3>
              </div>
              <p>
                <strong>📍 Landmark:</strong> {mechanic.landmark}
              </p>
              <p>
                <strong>✉️ Email:</strong> <a href={`mailto:${mechanic.email}`}>{mechanic.email}</a>
              </p>
              <p>
                <strong>📞 Phone:</strong> <a href={`tel:${mechanic.phone}`}>{mechanic.phone}</a>
              </p>
              <div className="rating">
                {"★".repeat(Math.floor(mechanic.rating))}
                {mechanic.rating % 1 !== 0 && "½"}
                {"★".repeat(5 - Math.floor(mechanic.rating))} {/* Fill up the rest of the stars */}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contact;
