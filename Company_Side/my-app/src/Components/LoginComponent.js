import { useState } from "react";
import axios from "axios";
import "./LoginComponent.css"; // Import CSS file

const LoginComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/login", { email, password });
      setMessage(response.data.message);
      localStorage.setItem("token", response.data.token);
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />
          <button type="submit" className="login-button">Login</button>
        </form> 
        {message && <p className="error-message">{message}</p>}
      </div>
    </div>
  );
};

export default LoginComponent;
