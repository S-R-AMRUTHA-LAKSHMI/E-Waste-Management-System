import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend } from 'chart.js'; // Import necessary Chart.js components
import { Pie } from 'react-chartjs-2'; 
import "./Dashboard.css";
import "./RadialBar.css";


ChartJS.register(ArcElement, ChartTooltip, Legend);



// Radial User Count Component
const RadialUserCount = ({ totalUsers, percentage, label }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setProgress(percentage);
    }, 500);
  }, [percentage]);

  const circumference = 2 * Math.PI * 80;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="radial-bar">
      <svg viewBox="0 0 200 200">
        <circle className="progress-bar" cx="100" cy="100" r="80" />
        <circle className="path" cx="100" cy="100" r="80" strokeDasharray={circumference} strokeDashoffset={offset} />
      </svg>
      <div className="percentage">{totalUsers}</div>
      <div className="text">{label}</div>
    </div>
  );
};

// Worker and Financial Data
const workerData = [
  { center: "Center A", active: 120, inactive: 30 },
  { center: "Center B", active: 100, inactive: 20 },
  { center: "Center C", active: 80, inactive: 40 },
  { center: "Center D", active: 60, inactive: 15 },
  { center: "Center E", active: 90, inactive: 25 },
  
];


const revenueData = [
  { month: "Jan", revenue: 8000 },
  { month: "Feb", revenue: 9000 },
  { month: "Mar", revenue: 10000 },
  { month: "Apr", revenue: 11000 },
  { month: "May", revenue: 12000 },
  { month: "Jun", revenue: 12500 },
];

const failureData = [
  { month: "Jan", failures: 3 },
  { month: "Feb", failures: 2 },
  { month: "Mar", failures: 4 },
  { month: "Apr", failures: 1 },
  { month: "May", failures: 2 },
  { month: "Jun", failures: 5 },
];

const expenseData = [
  { month: "Jan", expenses: 1500 },
  { month: "Feb", expenses: 1300 },
  { month: "Mar", expenses: 1600 },
  { month: "Apr", expenses: 1400 },
  { month: "May", expenses: 1500 },
  { month: "Jun", expenses: 1800 },
];

const totalRevenue = revenueData.reduce((total, item) => total + item.revenue, 0);
const totalFailures = failureData.reduce((total, item) => total + item.failures, 0);
const totalExpenses = expenseData.reduce((total, item) => total + item.expenses, 0);

const pieChartData = {
  labels: ['Requests per Day', 'Revenue per Day'],
  datasets: [
    {
      data: [70, 30], // Example data: 70% for requests, 30% for revenue
      backgroundColor: ['#FF6384', '#36A2EB'],
      hoverBackgroundColor: ['#FF4371', '#34A1D1'],
    },
  ],
};


// Dashboard Component
const Dashboard = () => {
  const workers = [
    { id: 1, name: "Worker 1", status: "Active" },
    { id: 2, name: "Worker 2", status: "Inactive" },
    { id: 3, name: "Worker 3", status: "Inactive" },
   
    { id: 5, name: "Worker 5", status: "Inactive" },
  ];

  const stats = {
    totalWorkers: 230,
    collectionRequests: 150,
    completedRequests: 120,
    recyclingRate: 85,
    revenue: "$12,500",
    alerts: 5
  };

  return (
    <div className="dashboard">
      <h2>Company Dashboard</h2>

      <div className="dashboard-stats">
        <RadialUserCount totalUsers={stats.totalWorkers} percentage={95} label="Total Workers" />
        <RadialUserCount totalUsers={stats.collectionRequests} percentage={80} label="E-Waste Requests" />
        <RadialUserCount totalUsers={stats.completedRequests} percentage={90} label="Completed Requests" />
        <RadialUserCount totalUsers={stats.recyclingRate} percentage={85} label="Recycling Efficiency" />
      </div>

      {/* Include DashboardGraphs component */}
      <div className="dashboard-graphs">
      
            <div className="graph-container">
                <h3>Worker Status Per Center</h3>
                 <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={workerData} barGap={5} barCategoryGap={15}>
                         <XAxis dataKey="center" />
                         <YAxis />
                         <Tooltip />
                         
                         <Bar dataKey="active" fill="#00897b" name="Active Workers" />
                         <Bar dataKey="inactive" fill="#d32f2f" name="Inactive Workers" />
                      </BarChart>
                  </ResponsiveContainer>
            </div>


        

            <div className="graph-container financial-growth">
                    <h3>Financial Growth</h3>
                    <ResponsiveContainer width="100%" height={300}>
                       <LineChart data={revenueData}>
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="revenue" stroke="#00796b" name="Revenue" />
                        </LineChart>
                    </ResponsiveContainer>
              </div>

              <div className="graph-container">
                 <h3>Requests and Revenue Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <Pie data={pieChartData} />
                  </ResponsiveContainer>
              </div>
       
      </div>

      <h3>Worker Details</h3>
      <div className="worker-container">
        {workers.map((worker) => (
          <div key={worker.id} className="worker-card">
            <h4>{worker.name}</h4>
            <Link to={`/workerdetails/${worker.id}`} className={`status-link ${worker.status.toLowerCase()}`}>
              {worker.status}
            </Link>
            <Link to={`/track/${worker.id}`} className="tracking-link">
              Tracking Status
            </Link>
          </div>
        ))}
      </div>

      <h3>Financial Overview</h3>
      <div className="financial-report">
        <p><strong>Total Revenue:</strong> ${totalRevenue}</p>
        <p><strong>Total count of e-waste acquired :</strong> {totalFailures+20} failures</p>
        <p><strong>Total System Failures:</strong> {totalFailures} failures</p>
        <p><strong>Total Expenses (All Months):</strong> ${totalExpenses}</p>
      </div>
      </div>
  );
};

export default Dashboard;
