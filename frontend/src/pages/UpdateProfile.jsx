import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout/Layout";

const UpdateProfile = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState(""); // Only for display
    const [role, setRole] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState("");
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const fetchUserProfile = async () => {
        try {
            const { data } = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/profile`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            setName(data.name);
            setEmail(data.email);
            setRole(data.role);
            setStatus(data.status);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch user profile");
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSuccess("");
        setError("");

        try {
            const { data } = await axios.put(
                `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/profile`,
                { name, password },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            setSuccess(data.message);
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message || "Update failed. Please try again."
            );
        }
    };

    return (
        <Layout>
            <div className="flex items-center justify-center min-h-screen px-4 py-6 ">
                <div className="w-full max-w-4xl p-5 border border-gray-300 rounded-xl shadow-xl bg-white mt-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Display Section */}
                    <div>
                        <h2 className="text-2xl font-bold mb-4 text-blue-600">Your Profile</h2>
                        <p><strong>Name:</strong> {name}</p>
                        <p><strong>Email:</strong> {email}</p>
                        <p><strong>Role:</strong> {role === "guide" ? "Event Coordinator" : role}</p>
                        <p><strong>Status:</strong> {status}</p>
                    </div>

                    {/* Update Form */}
                    <div>
                        <h2 className="text-2xl font-bold mb-4 text-green-600">Update Info</h2>

                        {error && <p className="text-red-500">{error}</p>}
                        {success && <p className="text-green-500">{success}</p>}

                        <form onSubmit={handleUpdate}>
                            <div className="mb-4">
                                <label className="block text-sm font-semibold mb-1">Name</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border rounded-md"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-semibold mb-1">New Password</label>
                                <input
                                    type="password"
                                    className="w-full px-4 py-2 border rounded-md"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Leave blank to keep unchanged"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md"
                            >
                                Update Profile
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default UpdateProfile;
