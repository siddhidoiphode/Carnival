import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../../components/Layout/Layout";

const Register = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("guide");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !email || !password || !role) {
      setError("Please fill in all required fields");
      return;
    }

    if ((role === "guide" || role === "admin") && !secretKey) {
      setError("Secret key is required for guide/admin registration");
      return;
    }

    let userData = {
      name,
      email,
      password,
      role,
      secretKey,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/register`,
        userData
      );

      setSuccess(response.data.message);
      setError("");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Registration failed. Please try again.");
      }
      setSuccess("");
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full sm:w-96 p-6 border border-gray-300 rounded-lg shadow-lg mt-5">
          <h2 className="text-2xl font-bold text-center mb-1 mt-3">Register</h2>

          {error && <p className="text-red-500 text-center">{error}</p>}
          {success && (
            <p className="text-green-500 text-center mb-2">
              {success} Redirecting...
            </p>
          )}

          <form onSubmit={handleSubmit} className="p-3">
            <div className="mb-4">
              <label htmlFor="role" className="block text-sm font-semibold">
                Register as
              </label>
              <select
                id="role"
                className="w-full px-4 py-2 border rounded-md"
                value={role}
                onChange={handleRoleChange}
              >
                <option value="guide">Event Coordinator</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-semibold">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-2 border rounded-md"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-semibold">
                Email
              </label>
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
              <label htmlFor="password" className="block text-sm font-semibold">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-2 border rounded-md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {(role === "guide" || role === "admin") && (
              <div className="mb-4">
                <label htmlFor="secretKey" className="block text-sm font-semibold">
                  Secret Key
                </label>
                <input
                  type="password"
                  id="secretKey"
                  className="w-full px-4 py-2 border rounded-md"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  required
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md mb-2"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
