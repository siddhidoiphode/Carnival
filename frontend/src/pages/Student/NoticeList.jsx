import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../components/Layout/Layout";

const NoticeList = () => {
    const [notices, setNotices] = useState([]);
    const [selectedNotice, setSelectedNotice] = useState(null);

    useEffect(() => {
        const fetchNotices = async () => {
            const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/notice/all`);
            setNotices(data);
        };
        fetchNotices();
    }, []);

    return (
        <Layout>
            <div className="p-4 flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-5 text-center mt-5">Notices</h2>

                <div className="w-full max-w-3xl space-y-4">
                    {notices.map((notice) => (
                        <div
                            key={notice._id}
                            className="flex justify-between items-start border p-4 rounded-lg shadow-md bg-white mb-3"
                        >
                            <div className="flex-1 pr-4">
                                <p className="text-base font-medium text-gray-800 mb-1">{notice.description}</p>
                                {/* <p className="text-sm text-gray-500 italic">
                                — Posted by {notice.uploadedBy?.name || "Unknown"}
                            </p> */}
                            </div>
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => setSelectedNotice(notice)}
                                    className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                                >
                                    Show
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Modal */}
                {selectedNotice && (
                    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
                        <div className="bg-white p-5 rounded-lg w-full max-w-sm shadow-xl relative">
                            <h3 className="text-lg font-semibold mb-4 text-center">
                                {selectedNotice.description}
                            </h3>
                            <div className="mb-4 max-h-80 overflow-y-auto rounded">
                                {selectedNotice.fileType === "pdf" ? (
                                    <embed
                                        src={selectedNotice.fileUrl}
                                        type="application/pdf"
                                        width="100%"
                                        height="250px"
                                        className="rounded"
                                    />
                                ) : (
                                    <img
                                        src={selectedNotice.fileUrl}
                                        alt="Notice"
                                        className="w-full h-auto rounded"
                                    />
                                )}
                            </div>
                            <div className="flex justify-center">
                                <button
                                    onClick={() => setSelectedNotice(null)}
                                    className="bg-gray-700 text-white px-5 py-2 rounded hover:bg-gray-800 transition-all duration-200"
                                >
                                    Go Back
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default NoticeList;
