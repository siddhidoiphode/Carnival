import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/login`,
        { email, password }
      );

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setEmail("");
        setPassword("");
        setError("");
        navigate("/");
      } else {
        setError(response.data.message); // Show specific message like "Your registration request is pending."
      }

    } catch (err) {
      if (err.response && err.response.status === 403) {
        setError(err.response.data.message); // Show specific message like "Your request has been rejected."
      } else {
        setError("Login failed. Please check your credentials and try again.");
      }
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-center h-screen max-h-screen px-4">
        <div className="w-full max-w-md p-6 border border-gray-300 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-4 mt-4">Login</h2>
          {error && <p className="text-red-500 text-center mb-2">{error}</p>}
          <form onSubmit={handleSubmit} className="p-3">
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border rounded-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-semibold mb-2">Password</label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-2 border rounded-md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md">
              Login
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Login;