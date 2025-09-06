import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import axios from "axios";

const Gallery = () => {
    const [gallery, setGallery] = useState([]);
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState("");

    const fetchGallery = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/notice/gallery`);
            setGallery(res.data);
        } catch (error) {
            console.error("Failed to fetch gallery images", error);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/notice/gallery/upload`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setFile(null);
            setPreview("");
            fetchGallery();
        } catch (error) {
            console.error("Upload failed", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/v1/notice/gallery/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            fetchGallery();
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    useEffect(() => {
        fetchGallery();
    }, []);

    return (
        <Layout>
            <div className="p-4 max-w-7xl mx-auto mt-6">
                <h1 className="text-3xl font-bold text-center mb-5 mt-5">Gallery</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Upload Card */}
                    <div className="bg-white shadow-lg rounded-xl p-5 border h-[460px] flex flex-col justify-between">
                        <h2 className="text-xl font-semibold text-center mt-0">Upload Image</h2>
                        <form onSubmit={handleUpload} className="flex flex-col gap-4 p-2 flex-grow">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    setFile(e.target.files[0]);
                                    setPreview(URL.createObjectURL(e.target.files[0]));
                                }}
                                className="border p-2 rounded"
                            />
                            <div className="flex-grow flex justify-center items-center">
                                {preview ? (
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="w-full h-48 object-cover rounded shadow"
                                    />
                                ) : (
                                    <div className="w-full h-48 border-dashed border-2 border-gray-300 flex items-center justify-center text-gray-400 rounded">
                                        Preview will appear here
                                    </div>
                                )}
                            </div>
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                            >
                                Upload Image
                            </button>
                        </form>
                    </div>

                    {/* Gallery */}
                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6 lg:mt-0">
                        {Array.isArray(gallery) &&
                            gallery.map((img) => (
                                <div
                                    key={img._id}
                                    className="relative rounded-xl overflow-hidden shadow border bg-white h-[220px] flex"
                                >
                                    <img
                                        src={img.imageUrl}
                                        alt="Gallery"
                                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                    />
                                    <button
                                        onClick={() => handleDelete(img._id)}
                                        className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-red-100 transition"
                                        title="Delete"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 text-red-600 hover:text-red-800"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                    </div>
                </div>
            </div>

        </Layout>
    );
};

export default Gallery;
