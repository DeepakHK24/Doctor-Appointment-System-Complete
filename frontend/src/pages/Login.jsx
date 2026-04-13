import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      // Save token + user
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Role-based redirect
      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else if (res.data.user.role === "doctor") {
        navigate("/doctor-dashboard");
      } else {
        navigate("/patient-dashboard");
      }

    } catch (error) {
      console.log(error.response?.data || error.message);
      alert("Login failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <h1 className="project-title">Doctor Appointment System</h1><br></br>
        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Login</button><br></br>
        </form>
        <br></br>
        <p>
          Don’t have an account? <Link to="/register">Register</Link>
        </p>

      </div>
    </div>
  );
}

export default Login;