import { Outlet, Link, useLocation } from "react-router-dom";
import './Layout.css';

const Layout = () => {
  const location = useLocation();
  return (
    <div className="layoutContainer">
      <nav className="navbar">
        <div className="logo">E-Waste</div>  
        <div className="links">
          <Link to="/" className={location.pathname === "/Home" ? "active" : ""}>Home</Link>
          <Link to="/dashboard" className={location.pathname === "/Dashboard" ? "active" : ""}>DashBoard</Link>
          <Link to="/login" className={location.pathname === "/LoginComponent" ? "active" : ""}>Login</Link>
          
          <Link to="/signup" className={location.pathname === "/SignupComponent" ? "active" : ""}>SignUp</Link>
          <Link to="/customerqueries" className={location.pathname === "/CustomerQueries" ? "active" : ""}>CustomerQueries</Link>
          
          
        </div>
      </nav>
      <div className="pageContainer">
        <Outlet /> {/* This renders the page content dynamically */}
      </div>
      <footer className="footer">
        &copy; {new Date().getFullYear()} E-Waste Management. All Rights Reserved.
      </footer>
    </div>
  );
};

export default Layout;