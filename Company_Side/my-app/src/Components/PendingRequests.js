import React from 'react';
import { useParams } from "react-router-dom";
import './PendingRequests.css';

const PendingRequests = () => {
  // Sample data for pending requests
  const { workerId } = useParams(); 
  const pendingRequests = [
    {
      id: 101,
      name: 'Alice Johnson',
      pickupAddress: '456 Elm Streer,city',
      contactNumber: '1234567890',
      pickupDate: '2024-02-10',
      totalWeight: '50kg',
      itemType: 'Telivision,Remote Control',
      pickupStatus: 'Pending',
    },
    {
      id: 102,
      name: 'Jane Smith',
      pickupAddress: 'Street 2, Thiruvallur',
      contactNumber: '0987654321',
      pickupDate: '2025-02-16',
      totalWeight: '60kg',
      itemType: 'E-Waste',
      pickupStatus: 'Pending',
    },
    // Add more requests if needed
  ];

  return (
    <div className="pending-requests">
      <h2>Pending Requests  for Worker {workerId}</h2>
      <div className="request-list">
        {pendingRequests.map(request => (
          <div className="request-card" key={request.id}>
           <form className="request-form">
              <div>
                <label>Request ID:</label>
                <div className="value">{request.id}</div>
              </div>
              <div>
                <label>Name:</label>
                <div className="value">{request.name}</div>
              </div>
              <div>
                <label>PickUp Address:</label>
                <div className="value">{request.pickupAddress}</div>
              </div>
              <div>
                <label>Contact Number:</label>
                <div className="value">{request.contactNumber}</div>
              </div>
              <div>
                <label>Request Pickup Date:</label>
                <div className="value">{request.pickupDate}</div>
              </div>
              <div>
                <label>Total Weight:</label>
                <div className="value">{request.totalWeight}</div>
              </div>
              <div>
                <label>Item Type:</label>
                <div className="value">{request.itemType}</div>
              </div>
              <div>
                <label>Pickup Status:</label>
                <div className="value">{request.pickupStatus}</div>
              </div>
            </form>
          
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingRequests;
