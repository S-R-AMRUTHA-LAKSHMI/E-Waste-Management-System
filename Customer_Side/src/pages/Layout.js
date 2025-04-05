import { Outlet, Link, useLocation } from "react-router-dom";
import "./Layout.css"; // Import layout-specific styles

const Layout = () => {
  const location = useLocation();
  return (
    <div className="layoutContainer">
      <nav className="navbar">
        <div className="logo">E-Waste</div>
        <div className="links">
          <Link to="/" className={location.pathname === "/" ? "active" : ""}>Home</Link>
          <Link to="/blogs" className={location.pathname === "/blogs" ? "active" : ""}>About us</Link>
          <Link to="/contact" className={location.pathname === "/contact" ? "active" : ""}>Services</Link>
          <Link to="/add" className={location.pathname === "/add" ? "active" : ""}>Whycle?</Link>
          <Link to="/items" className={location.pathname === "/items" ? "active" : ""}>Items</Link>
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
