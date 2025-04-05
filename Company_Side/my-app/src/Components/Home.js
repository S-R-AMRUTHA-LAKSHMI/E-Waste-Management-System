import React from "react";


import  "./Home.css";


const Home = () => {
 
  return (
    <div className="home">
      <header className="header">
        <nav className="navbar">
          <h1>E-Waste </h1>
          <div className="nav-links">
            

            {/*<Link to="/Dashboard" className="nav-link">Dashboard</Link>*/}
            {/* <Route index element={<Dashboard />} /> */}
          </div>
        </nav>
      </header>

      <div className="left-right" style={{ display: 'flex' }}>
        <div className="home-left">
          <div className="image-container">
            
            <p className="image-caption">♻ Let's create a greener future together! 🌍</p>
          </div>
        </div>
        <div className="home-right">
          <h3>WELCOME TO OUR INITIATIVE</h3>
          <h2>E-Waste Management: Reduce, Reuse, Recycle</h2>
          <p>
            Electronic waste is one of the fastest-growing pollution sources in the world. Our mission is to promote <strong>sustainable e-waste disposal</strong>, ensuring that materials are reused and recycled efficiently.
          </p>
          <p>
            By adopting responsible e-waste practices, we can reduce environmental impact, conserve resources, and <strong>build a cleaner future</strong>. Join us in our efforts to make a difference!
          </p>

          </div>
      </div>

      {/* Store Section (where details are collected) */}
      <br />
      
    </div>
  );
};

export default Home;
