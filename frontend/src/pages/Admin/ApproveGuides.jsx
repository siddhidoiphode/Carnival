import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../components/Layout/Layout";

const ApproveGuides = () => {
    const [pendingGuides, setPendingGuides] = useState([]);
    const [selectedGuide, setSelectedGuide] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch pending guide requests
    useEffect(() => {
        const fetchPendingGuides = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/api/v1/admin/pending-guides`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPendingGuides(res.data.pendingGuides || []); // Ensure it's always an array
            } catch (error) {
                console.error("Error fetching guides:", error);
                setPendingGuides([]); // Set empty array to prevent crash
            }
        };

        fetchPendingGuides();
    }, []);


    // Handle "Proceed" button click
    const handleProceed = (guide) => {
        setSelectedGuide(guide);
    };

    // Handle Accept/Reject action
    const handleStatusChange = async (status) => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            await axios.put(
                `${import.meta.env.VITE_API_BASE_URL}/api/v1/admin/approve-guide/${selectedGuide._id}`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Update UI after approval/rejection
            setPendingGuides((prev) =>
                prev.filter((guide) => guide._id !== selectedGuide._id)
            );
            setSelectedGuide(null);
        } catch (error) {
            console.error("Error updating guide status:", error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <Layout>
            <div className="p-6">
                <div className="flex flex-col items-center h-screen">
                    <h2 className="text-2xl font-bold m-up p-3">Approve Event Coordinator</h2>
                    {pendingGuides?.length === 0 ? (
                        <p>No pending Event Coordinator requests.</p>
                    ) : (
                        <table className="w-[80%] border-collapse border border-gray-200 text-center">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border p-2">Name</th>
                                    <th className="border p-2">Email</th>
                                    <th className="border p-2">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingGuides?.map((guide) => (
                                    <tr key={guide._id}>
                                        <td className="border p-2">{guide.name}</td>
                                        <td className="border p-2">{guide.email}</td>
                                        <td className="border p-2">
                                            <button
                                                onClick={() => handleProceed(guide)}
                                                className="bg-blue-500 text-white px-3 py-1 rounded"
                                            >
                                                Proceed
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>



                {/* Modal for Accept/Reject */}
                {selectedGuide && (
                    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white rounded shadow-lg p-5">
                            <h3 className="text-lg font-semibold">Event Coordinator Details</h3>
                            <p><strong>Name:</strong> {selectedGuide.name}</p>
                            <p><strong>Email:</strong> {selectedGuide.email}</p>
                            <p><strong>Status:</strong> {selectedGuide.status}</p>
                            <div className="flex mt-4 gap-3">
                                <button
                                    onClick={() => handleStatusChange("approved")}
                                    className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                                    disabled={loading}
                                >
                                    {loading ? "Approving..." : "Accept"}
                                </button>
                                <button
                                    onClick={() => handleStatusChange("rejected")}
                                    className="bg-red-500 text-white px-4 py-2 rounded"
                                    disabled={loading}
                                >
                                    {loading ? "Rejecting..." : "Reject"}
                                </button>
                                <button
                                    onClick={() => setSelectedGuide(null)}
                                    className="bg-gray-400 text-white px-4 py-2 rounded ml-2"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default ApproveGuides;
