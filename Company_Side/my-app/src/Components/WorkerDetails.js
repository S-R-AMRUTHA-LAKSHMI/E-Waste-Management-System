import React, { useEffect, useState } from 'react';
import { useParams,Link} from 'react-router-dom';
import './WorkerDetails.css';

const WorkerDetails = () => {
  const { workerId } = useParams(); // Get workerId from the URL params
  const [worker, setWorker] = useState(null);

  useEffect(() => {
    // Sample data representing workers
    const workers = [
        { 
          id: 1, 
          name: "Worker 1", 
          status: "Active", 
          age: 30, 
          role: "Recycler", 
          contact: "1234567890", 
          location: "Center madipakam", 
          ratings: "5", 
          address: "Street 1, Madipakam" 
        },
        { 
          id: 2, 
          name: "Worker 2", 
          status: "Inactive", 
          age: 35, 
          role: "Supervisor", 
          contact: "0987654321", 
          location: "Center thiruvallur", 
          ratings: "4", 
          address: "Street 2, Thiruvallur" 
        },
        { 
          id: 3, 
          name: "Worker 3", 
          status: "Inactive", 
          age: 40, 
          role: "Technician", 
          contact: "1122334455", 
          location: "Center guindy", 
          ratings: "3", 
          address: "Street 3, Guindy" 
        },
        { 
          id: 4, 
          name: "Worker 4", 
          status: "Active", 
          age: 28, 
          role: "Manager", 
          contact: "2233445566", 
          location: "Center avadi", 
          ratings: "5", 
          address: "Street 4, Avadi" 
        },
        { 
          id: 5, 
          name: "Worker 5", 
          status: "Inactive", 
          age: 50, 
          role: "Cleaner", 
          contact: "3344556677", 
          location: "Center velacherry", 
          ratings: "2", 
          address: "Street 5, Velacherry" 
        }
      ];
      

    // Find the worker by ID
    const selectedWorker = workers.find(w => w.id === parseInt(workerId));
    setWorker(selectedWorker);
  }, [workerId]);

  return (
    <div className="worker-details">
      {worker ? (
        <>
          <h2>{worker.name} - Worker Details</h2>
          <p><strong>Age:</strong> {worker.age}</p>
          <p><strong>Role:</strong> {worker.role}</p>
          <p><strong>Contact:</strong> {worker.contact}</p>
          <p><strong>Location:</strong> {worker.location}</p>
          <p><strong>Status:</strong> {worker.status}</p>
          <p><strong>Ratings:</strong> {worker.ratings}</p>
          <p><strong>Address:</strong> {worker.address}</p>
          <div className="worker-actions">
  <Link 
    to={`/worker/${workerId}/pending-requests`} 
    className={worker.status === "Active" ? "active-link" : "inactive-link"}
  >
    Pending Requests
  </Link>
  <Link 
    to={`/worker/${workerId}/completed-requests`} 
    className="request-button"
  >
    Completed Requests
  </Link>
</div>

          
        </>
      ) : (
        <p>Worker not found!</p>
      )}
    </div>
  );
};

export default WorkerDetails;
