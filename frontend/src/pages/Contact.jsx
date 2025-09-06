import React, { useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout/Layout';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('Sending...');

        try {
            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/contact/send-query`, formData);
            setStatus(res.data.success);
            setFormData({ name: '', email: '', message: '' });
        } catch (err) {
            setStatus(err.response?.data?.error || 'Something went wrong!');
        }
    };

    return (
        <Layout>
            <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
                <div className="w-full max-w-xl bg-white shadow-2xl rounded-2xl p-5 mt-5">
                    <h2 className="text-2xl font-semibold text-center text-[#4285F4]">Contact Us</h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            {/* <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label> */}
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 mb-2 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4285F4]"
                                placeholder="Enter your name"
                            />
                        </div>
                        <div>
                            {/* <label className="block text-sm font-medium text-gray-700 mb-1">Your Email</label> */}
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border mb-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4285F4]"
                                placeholder="Enter your email"
                            />
                        </div>
                        <div>
                            {/* <label className="block text-sm font-medium text-gray-700 mb-1">Your Message</label> */}
                            <textarea
                                name="message"
                                rows="4"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4285F4]"
                                placeholder="Type your message"
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-[#4285F4] text-white py-2 rounded-md hover:bg-[#0b66c3] transition-all duration-200"
                        >
                            Send Email
                        </button>
                    </form>
                    {status && <p className="text-center mt-4 text-sm text-gray-600">{status}</p>}
                </div>
            </div>
        </Layout>
    );
};

export default Contact;
