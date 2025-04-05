import React from "react";
import "./CustomerQueries.css"; // Ensure you create this CSS file for styling

const CustomerQueries = () => {
  const queries = [
    { id: 1, name: "John Doe", email: "john@example.com", query: "How can I recycle old batteries?", feedback: "Great service!" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", query: "Do you accept electronic waste pickups?", feedback: "Fast response!" },
    { id: 3, name: "Robert Brown", email: "robert@example.com", query: "What are your drop-off locations?", feedback: "Very helpful!" }
  ];

  return (
    <div className="customer-queries">
      <h2>Customer Queries & Feedback</h2>
      <div className="query-list">
        {queries.map((item) => (
          <div key={item.id} className="query-card">
            <p><strong>Name:</strong> {item.name}</p>
            <p><strong>Email:</strong> {item.email}</p>
            <p><strong>Query:</strong> {item.query}</p>
            <p><strong>Feedback:</strong> {item.feedback}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerQueries;