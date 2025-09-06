import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout/Layout';
import { useNavigate } from "react-router-dom";

const CreateEventForm = () => {
    const navigate = useNavigate();
    const [nameWarning, setNameWarning] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        type: 'solo',
        category: '',
        guide: '',
        startDate: '',
        endDate: '',
        groupLimit: 0,
        registrationFields: [
            {
                label: 'Participant Name',
                type: 'text',
                options: [],
                required: true,
            },
            {
                label: 'Department',
                type: 'dropdown',
                options: ['CSE', 'AIDS', 'ENTC', 'ELECTRICAL', 'MECHANICAL', 'CIVIL'],
                required: true,
            },
            {
                label: 'Current Year',
                type: 'dropdown',
                options: ['First', 'Second', 'Third', 'Final'],
                required: true,
            },
        ],
    });

    const [guides, setGuides] = useState([]);

    useEffect(() => {
        const fetchGuides = async () => {
            try {
                const token = localStorage.getItem("token"); // Fetch stored token
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/admin/approved-guides`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include token in request
                    },
                });
                setGuides(response.data.approvedGuides);
            } catch (error) {
                console.error('Error fetching guides:', error);
                setError('Failed to load guides. Please log in as an admin.');
            }
        };
        fetchGuides();
    }, []);


    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "name") {
            const nameRegex = /^[A-Za-z\s]+$/;
            if (!nameRegex.test(value) && value !== "") {
                setNameWarning("Only alphabets and spaces are allowed in event name.");
            } else {
                setNameWarning("");
            }
        }

        setFormData({ ...formData, [name]: value });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/events/create-event`, formData);
            navigate("/");
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <Layout>
            <div className='m-up flex flex-col items-center '>
                <form className="event-form mt-5" onSubmit={handleSubmit}>
                    <h2 className=''>Create Event</h2>

                    <div className="input-group">
                        <input
                            type="text"
                            name="name"
                            placeholder="Event Name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                        {nameWarning && <p className="text-red-500 text-sm">{nameWarning}</p>}
                    </div>

                    <select name="type" value={formData.type} onChange={handleInputChange}>
                        <option value="solo">Solo</option>
                        <option value="group">Group</option>
                    </select>

                    <select name="category" value={formData.category} onChange={handleInputChange} required>
                        <option value="">Select Category</option>
                        <option value="Cultural">Cultural Event</option>
                        <option value="Sports">Sports</option>
                    </select>

                    <select name="guide" value={formData.guide} onChange={handleInputChange} required>
                        <option value="">Select Event Coordinator </option>
                        {guides.length > 0 ? (
                            guides.map((guide) => (
                                <option key={guide._id} value={guide._id}>{guide.name}</option>
                            ))
                        ) : (
                            <option disabled>No event coordinator available</option>
                        )}

                    </select>

                    <div className="input-group">
                        <label htmlFor="startDate">Registration Start Date</label>
                        <input type="date" id="startDate" name="startDate" value={formData.startDate} onChange={handleInputChange} required />
                    </div>

                    <div className="input-group">
                        <label htmlFor="endDate">Registration End Date</label>
                        <input type="date" id="endDate" name="endDate" value={formData.endDate} onChange={handleInputChange} required />
                    </div>

                    {formData.type === 'group' && (
                        <div className="input-group mb-0">
                            <label htmlFor="groupLimit">Group Limit <p style={{ color: "green", marginBottom: "0px" }}>(enter 0 if no Group Limit)</p></label>
                            <input type="number" id="groupLimit" name="groupLimit" placeholder="Group Limit" value={formData.groupLimit} onChange={handleInputChange} min="0" required />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={nameWarning !== ''}
                        className={`mt-4 px-4 py-2 rounded text-white font-semibold 
                        ${nameWarning !== '' ? 'bg-gray-400 cursor-not-allowed opacity-50' : 'bg-blue-500 hover:bg-blue-600'}`}>
                        Create Event
                    </button>

                </form>
            </div>
        </Layout>
    );
};

export default CreateEventForm;
