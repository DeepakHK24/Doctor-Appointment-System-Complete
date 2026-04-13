import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./auth.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient", // default role
  });

  const [error, setError] = useState("");

  const { name, email, password, role } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Role-based navigation
      if (res.data.user.role === "doctor") {
        alert("Doctor account created. Waiting for admin approval.");
        navigate("/");
      } else {
        navigate("/patient-dashboard");
      }

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <h1 className="project-title">
          🏥 Doctor Appointment System
        </h1>

        <h2>Create Account</h2>

        {error && <p className="error">{error}</p>}

        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={name}
            onChange={onChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={email}
            onChange={onChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={onChange}
            required
          />

          {/* ROLE SELECTION */}
          <div className="role-selection">
            <label>
              <input
                type="radio"
                name="role"
                value="patient"
                checked={role === "patient"}
                onChange={onChange}
              />
              Patient
            </label>

            <label>
              <input
                type="radio"
                name="role"
                value="doctor"
                checked={role === "doctor"}
                onChange={onChange}
              />
              Doctor
            </label>
          </div>

          <button type="submit">Register</button>
        </form>

        <p className="switch-link">
          Already have an account? <Link to="/">Login</Link>
        </p>

      </div>
    </div>
  );
}

export default Register;