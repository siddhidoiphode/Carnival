import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../components/Layout/Layout";

const ManageNotices = () => {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotices = async () => {
            const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/notice/all`);
            setNotices(data);
            setLoading(false);
        };
        fetchNotices();
    }, []);


    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this notice?")) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/v1/notice/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setNotices(notices.filter((n) => n._id !== id));
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    return (
        <Layout>
            <div className="p-5">
                <h2 className="text-xl font-bold mb-4 mt-5 text-center">Manage Notices</h2>
                {loading ? (
                    <p>Loading notices...</p>
                ) : notices.length === 0 ? (
                    <p className=" text-center">No notices available.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border border-gray-300">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="p-2">#</th>
                                    <th className="p-2">Description</th>
                                    <th className="p-2">Created</th>
                                    <th className="p-2">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {notices.map((notice, index) => (
                                    <tr key={notice._id} className="border-t">
                                        <td className="p-2">{index + 1}</td>
                                        <td className="p-2">{notice.description}</td>
                                        <td className="p-2">{new Date(notice.createdAt).toLocaleString()}</td>
                                        <td className="p-2">
                                            <button
                                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                                onClick={() => handleDelete(notice._id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default ManageNotices;
