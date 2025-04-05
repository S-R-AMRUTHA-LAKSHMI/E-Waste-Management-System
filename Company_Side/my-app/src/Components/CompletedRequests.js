import React from 'react';
import { useParams, Link } from 'react-router-dom';
import './CompletedRequests.css';

const CompletedRequests = () => {
  const { workerId } = useParams();

  // Sample data for completed requests
  const completedRequests = [
    {
      id: 101,
      name: 'Bob Williams',
      pickupAddress: '789 pine avenue,city',
      pickupTime: '10:00 AM',
      pickupDate: '2024-02-12',
      totalWeight: '50kg',
      itemType: 'Washing Machine,User Manual',
      pickupStatus: 'Completed',
      deliveryInformation: 'Delivered to recycling center at 11:30 AM.',
    },
    {
      id: 102,
      name: 'Alice Jhonson',
      pickupAddress: '456 Elm Street,City',
      pickupTime: '03:00 PM',
      pickupDate: '2024-02-10',
      totalWeight: '60kg',
      itemType: 'Television,Remote Control',
      pickupStatus: 'Completed',
      deliveryInformation: 'Delivered to e-waste facility at 03:15 PM.',
    },
  ];

  return (
    <div className="completed-requests">
      <h2>Completed Requests for Worker {workerId}</h2>
      <div className="request-list">
        {completedRequests.map(request => (
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
                <label>Pickup Time:</label>
                <div className="value">{request.pickupTime}</div>
              </div>
              <div>
                <label>Pickup Date:</label>
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
              <div>
                <label>Delivery Information:</label>
                <div className="value">{request.deliveryInformation}</div>
              </div>
            </form>
          </div>
        ))}
      </div>

      {completedRequests.length > 1 && (
  <Link
    to={`/workerdetails/${workerId}`}
    className={completedRequests[0].status === 'Active' ? 'active-link' : 'inactive-link'}
  >
    View other Workers Details
  </Link>
)}



      {/* Link to navigate back to Worker Details */}
      </div>
  );
};

export default CompletedRequests;
