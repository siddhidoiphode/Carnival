// UploadNotice.js
import React, { useState } from "react";
import axios from "axios";
import Layout from "../components/Layout/Layout";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UploadNotice = () => {
    const navigate = useNavigate();
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) return alert("Please upload a file");

        const formData = new FormData();
        formData.append("description", description);
        formData.append("file", file);

        try {
            const { data } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/notice/upload`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            toast.success("Notice uploaded successfully");
            setDescription("");
            setFile(null);
            navigate("/")

        } catch (err) {
            console.error(err);
            alert("Failed to upload notice");
        }
    };

    return (
        <Layout>
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <form
                    onSubmit={handleSubmit}
                    className="p-5 shadow-xl bg-white rounded-2xl w-full max-w-md"
                >
                    <h2 className="text-xl font-semibold mb-4 text-center">Upload Notice</h2>
                    <input
                        type="text"
                        placeholder="Short Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="mb-3 p-2 border rounded w-full"
                    />
                    <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => setFile(e.target.files[0])}
                        required
                        className="mb-3 p-2 border rounded w-full"
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
                    >
                        Upload Notice
                    </button>
                </form>
            </div>
        </Layout>
    );
};

export default UploadNotice;
