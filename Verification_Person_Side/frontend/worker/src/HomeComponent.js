import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import VerificationDetails from './VerificationDetails.js';
import "./HomeComponent.css";

function HomeComponent() {
    const [userData, setUserData] = useState(null);
    const [requests, setRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            navigate('/login');
            return;
        }
        
        try {
            const parsedUser = JSON.parse(userStr);
            if (!parsedUser.id) {
                localStorage.removeItem('user');
                navigate('/login');
                return;
            }
            
            setUserData(parsedUser);
    
            const fetchRequests = async () => {
                setLoading(true);
                try {
                    const response = await axios.get(`http://localhost:5000/api/requests/${parsedUser.id}`);
                    setRequests(response.data);
                } catch (error) {
                    console.error('Error fetching requests:', error);
                    setError('Failed to fetch requests');
                } finally {
                    setLoading(false);
                }
            };
    
            fetchRequests();
        } catch (error) {
            console.error('Error parsing user data:', error);
            localStorage.removeItem('user');
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleUpdateStatus = async (requestId, updates) => {
        try {
            const response = await axios.put(`http://localhost:5000/api/requests/${requestId}`, updates);
            setRequests(prev =>
                prev.map(req =>
                    req._id === requestId
                        ? { ...req, amount: updates.amount, report: updates.report, status: response.data.status }
                        : req
                )
            );
            if (selectedRequest && selectedRequest._id === requestId) {
                setSelectedRequest(response.data);
            }
        } catch (error) {
            console.error('Error updating request:', error);
        }
    };
    
    if (!userData) return null;
    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    if (selectedRequest) {
        return (
            <VerificationDetails
                request={selectedRequest}
                onBack={() => setSelectedRequest(null)}
                onUpdateStatus={handleUpdateStatus}
            />
        );
    }

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <div className="header-content">
                    <div className="header-left">
                        <h1 className="dashboard-title">E-Waste Verification Dashboard</h1>
                        <div className="collector-info">
                            Collector: {userData.name}
                        </div>
                    </div>
                    <button className="logout-btn" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </header>

            <main className="dashboard-content">
                <div className="requests-container">
                    {requests.length === 0 ? (
                        <p className="no-requests">No requests assigned yet.</p>
                    ) : (
                        requests.map(request => (
                            <div key={request._id} className="request-card">
                                <div className="request-details">
                                    <p><strong>Customer Name:</strong> {request.customerName}</p>
                                    <p><strong>Mobile Number:</strong> {request.phone}</p>
                                    <p><strong>Item Name:</strong> {request.itemDetails}</p>
                                    <p><strong>Date:</strong> {request.pickupDate}</p>
                                    <p><strong>Time:</strong> {request.pickupTime}</p>
                                    <p><strong>Amount:</strong> {(request.amount || request.report?.predictionResult?.finalAmount) 
                                        ? `₹${request.amount || request.report?.predictionResult?.finalAmount.toFixed(2)}` 
                                        : 'Not calculated'}
                                    </p>
                                    <p><strong>Request Status:</strong> <span className={`status-${request.status}`}>{request.status.charAt(0).toUpperCase() + request.status.slice(1)}</span></p>
                                </div>
                                <button 
                                    className="view-btn"
                                    onClick={() => setSelectedRequest(request)}
                                >
                                    View Details
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}

export default HomeComponent;