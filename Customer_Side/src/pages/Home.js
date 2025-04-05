
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import '@react-pdf-viewer/core/lib/styles/index.css';
import "./Home.css";
import heroImage from "../assets/hero.jpg";
import mechanicImage from "../assets/mechanic.png";
import map from '../assets/map.png';
import qrcode from '../assets/qrcode.png';
import { useNavigate } from "react-router-dom";
import coupon from '../assets/coupon.jpg';

const GO_MAPS_API_KEY = 'AlzaSy5Cw45UZY8NdDZWyZ6eho1rvTjNfJgtAxv';  // Replace this with your actual API key
const center = {
  lat: 28.6139,
  lng: 77.2090,
};

const Home = ({ user }) => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [mechanicLocation, setMechanicLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(center);
  const [showMechanicDetails, setShowMechanicDetails] = useState(false);
  const [mechanics, setMechanics] = useState([]);
  const [eWasteCompanies, setEWasteCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState('');
  const [showCoupon, setShowCoupon] = useState(false);
  const mapRef = useRef(null);
  
  // Add states for e-waste prediction
  const [predictedEwasteType, setPredictedEwasteType] = useState('');
  const [predictionLoading, setPredictionLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // PDF Viewer functionality
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleNextPage = () => {
    if (pageNumber < numPages) setPageNumber(pageNumber + 1);
  };

  const handlePrevPage = () => {
    if (pageNumber > 1) setPageNumber(pageNumber - 1);
  };

  const scrollToStore = () => {
    const storeSection = document.getElementById("store-section");
    if (storeSection) {
      storeSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Integrated fetch mechanics and location logic
  useEffect(() => {
    const fetchMechanics = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/mechanics/');
        setMechanics(response.data);
      } catch (error) {
        console.error('Error fetching mechanics:', error);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({ 
            lat: position.coords.latitude, 
            lng: position.coords.longitude 
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
        }
      );
    }

    fetchMechanics();
  }, []);

  const fetchEWasteCompanies = async (location) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:5000/api/e-waste-companies?location=${encodeURIComponent(location)}`);
      setEWasteCompanies(response.data);
    } catch (error) {
      setError('Failed to fetch e-waste companies');
      console.error('Error fetching e-waste companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSubmit = (e) => {
    e.preventDefault();
    fetchEWasteCompanies(location);
  };

  // New function to handle image upload and prediction
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedImage(file);
    setPredictionLoading(true);
    
    // Create a FormData object to send the image file
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      // Make a POST request to your prediction API
      const response = await axios.post('http://localhost:5001/api/predict-ewaste', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Update the state with the predicted e-waste type
      setPredictedEwasteType(response.data.predicted_label);
      
      // Find the input field and set its value
      const typeInput = document.querySelector('input[name="type"]');
      if (typeInput) {
        typeInput.value = response.data.predicted_label;
      }
    } catch (error) {
      console.error('Error predicting e-waste type:', error);
      setError('Failed to predict e-waste type');
    } finally {
      setPredictionLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newOrder = {
      id: orders.length + 1,
      type: formData.get("type"),
      quantity: formData.get("quantity"),
      address: formData.get("address"),
      date: formData.get("date"),
      status: "Pending",
      mechanicName: "John Doe",
      location: {
        lat: center.lat + (Math.random() - 0.5) * 0.1,
        lng: center.lng + (Math.random() - 0.5) * 0.1,
      },
    };
    setOrders([...orders, newOrder]);
    e.target.reset();
    setPredictedEwasteType('');
    setSelectedImage(null);
    alert("E-Waste request placed successfully!");
    setShowCoupon(true);
  };

  const toggleMechanicDetails = () => {
    setShowMechanicDetails(!showMechanicDetails);
  };

  return (
    <div className="home">
      <div className="left-right" style={{ display: "flex" }}>
        <div className="home-left">
          <div className="image-container">
            <img src={heroImage} alt="E-Waste Management" className="home-img" />
            <p className="image-caption">♲️ Let's create a greener future together! 🌍</p>
          </div>
        </div>
        <div className="home-right">
          <h3>WELCOME TO OUR INITIATIVE</h3>
          <h2>E-Waste Management: Reduce, Reuse, Recycle</h2>
          <p>
            Electronic waste is one of the fastest-growing pollution sources in the world. Our mission is to promote <strong>sustainable e-waste disposal</strong>, ensuring that materials are reused and recycled efficiently.
          </p>
          {user && <p>Welcome, {user.name}!</p>}
          <button className="home-btn" onClick={scrollToStore}>Request</button>
        </div>
      </div>

      {/* Location-based E-Waste Company Search */}
      <div className="location-search">
        <h2>Find E-Waste Companies Near You</h2>
        <form onSubmit={handleLocationSubmit}>
          <input
            type="text"
            placeholder="Enter your location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <button type="submit">Find Companies</button>
        </form>
        {loading && <p>Loading...</p>}
        {error && <p style={{color: 'red'}}>{error}</p>}
        {eWasteCompanies.length > 0 && (
          <ul>
            {eWasteCompanies.map((company, index) => (
              <li key={index}>
                {company.name} - {company.type} 
                (Distance: {company.distance_km} km)
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* E-Waste Collection Request Section */}
      <div id="store-section" className="store-section">
        <h2>Request E-Waste Collection</h2>
        <button type="button" onClick={() => navigate("/bulk")}>
          Bulk Order
        </button>
        <p>Fill in your details below, and we'll arrange for e-waste collection.</p>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            name="type" 
            placeholder="Type of E-waste" 
            value={predictedEwasteType}
            onChange={(e) => setPredictedEwasteType(e.target.value)}
            required 
          />
          <input type="number" name="quantity" placeholder="Quantity of E-waste" required />
          <input type="text" name="address" placeholder="Pickup Address" required />
          <div className="file-upload-container">
            <input 
              type="file" 
              name="image" 
              accept="image/*"
              onChange={handleImageUpload} 
              required 
            />
          
          </div>
          <input type="date" name="date" required />
          <button type="submit">Place Request</button>
        </form>
      </div>
      {showCoupon && (
        <div className="coupon-modal">
          <h2>🎉 Special Offer! 🎉</h2>
          <p>Your coupon is valid for one week!</p>
          <img src={coupon} alt="Coupon Code" style={{ width: '200px', height: '200px' }} />
        <br></br>  <button onClick={() => setShowCoupon(false)}>Close</button>
        </div>
      )} 
      {/* Dashboard Section */}
      <div className="dashboard">
        <h2>Dashboard - Orders & Tracking</h2>
        {orders.length === 0 ? (
          <p>No orders placed yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Address</th>
                <th>Pickup Date</th>
                <th>Status</th>
                <th>Mechanic</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.type}</td>
                  <td>{order.quantity}</td>
                  <td>{order.address}</td>
                  <td>{order.date}</td>
                  <td>{order.status}</td>
                  <td>{order.mechanicName}</td>
                  <td>
                    <button onClick={() => setSelectedOrder(order)}>View Status</button>
                    <button onClick={toggleMechanicDetails}>View Mechanic Details</button>
                    <br/><br/>
                    <button>
                      View Bill
                      <br/><br/>
                      <img 
                        src={qrcode}
                        alt="View QR Code" 
                        style={{ width: '120px', height: '120px' }} 
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* E-Waste Collection Request Section */}
      <div id="store-section" className="store-section">
        <h2>Request E-Waste Collection</h2>
        <button type="button" onClick={() => navigate("/bulk")}>
        Bulk Order
      </button>
        <p>Fill in your details below, and we'll arrange for e-waste collection.</p>
        <form onSubmit={handleSubmit}>
          <input type="text" name="type" placeholder="Type of E-waste" required />
          <input type="number" name="quantity" placeholder="Quantity of E-waste" required />
          <input type="text" name="address" placeholder="Pickup Address" required />
          <input type="file" name="image" placeholder="Upload Image" required />
          <input type="date" name="date" required />
          <button type="submit">Place Request</button>
        </form>
      </div>
      {showCoupon && (
        <div className="coupon-modal">
          <h2>🎉 Special Offer! 🎉</h2>
          <p>Your coupon is valid for one week!</p>
          <img src={coupon} alt="Coupon Code" style={{ width: '200px', height: '200px' }} />
        <br></br>  <button onClick={() => setShowCoupon(false)}>Close</button>
        </div>
      )} 
      {/* Dashboard Section */}
      <div className="dashboard">
        <h2>Dashboard - Orders & Tracking</h2>
        {orders.length === 0 ? (
          <p>No orders placed yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Address</th>
                <th>Pickup Date</th>
                <th>Status</th>
                <th>Mechanic</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.type}</td>
                  <td>{order.quantity}</td>
                  <td>{order.address}</td>
                  <td>{order.date}</td>
                  <td>{order.status}</td>
                  <td>{order.mechanicName}</td>
                  <td>
                    <button onClick={() => setSelectedOrder(order)}>View Status</button>
                    <button onClick={toggleMechanicDetails}>View Mechanic Details</button>
                    <br/><br/>
                    <button>
                      View Bill
                      <br/><br/>
                      <img 
                        src={qrcode}
                        alt="View QR Code" 
                        style={{ width: '120px', height: '120px' }} 
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

     

      {/* Additional Sections from Original Component */}
      {selectedOrder && (
        <div className="map-container">
          <h2>Tracking Order #{selectedOrder.id}</h2>
          <p>Mechanic: {selectedOrder.mechanicName}</p>
          <div className="map-container">
            <img 
              src={map} 
              alt="Static Map"
              style={{ width: '100%', height: '400px' }}
            />
          </div>
          <button onClick={() => setSelectedOrder(null)}>Close Map</button>
        </div>
      )}

      {showMechanicDetails && (
        <div className="mechanic-details-modal">
          <h3>Mechanic Details</h3>
          <img src={mechanicImage} alt="Mechanic" className="mechanic-img" />
          <p>Name: John Doe</p>
          <p>Experience: 5+ years in e-waste management</p>
          <p>Specialization: Safe and eco-friendly disposal methods</p>
          <button onClick={toggleMechanicDetails}>Close</button>
        </div>
      )}
    </div>
  );
};

export default Home;
