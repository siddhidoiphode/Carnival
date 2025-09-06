import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Layout from "../../components/Layout/Layout";
import { toast } from "react-toastify";

const UpdateEventForm = () => {
    const navigate = useNavigate();
    const [nameWarning, setNameWarning] = useState("");
    const { eventId } = useParams(); // Get event ID from URL

    const [formData, setFormData] = useState({
        name: "",
        type: "solo",
        category: "",
        guide: "", // Store only guide ID
        startDate: "",
        endDate: "",
        groupLimit: 0,
        registrationFields: [],
    });

    const [guides, setGuides] = useState([]);

    // Fetch existing event details
    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/api/v1/events/get-event/${eventId}`
                );
                const eventData = response.data.event;

                setFormData({
                    ...eventData,
                    guide: eventData.guide?._id || "", // Store guide ID instead of object
                    startDate: eventData.startDate.split("T")[0], // Extract date only
                    endDate: eventData.endDate.split("T")[0], // Extract date only
                });
            } catch (error) {
                console.error("Error fetching event details:", error);
            }
        };

        const fetchGuides = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/api/v1/admin/approved-guides`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setGuides(response.data.approvedGuides);
            } catch (error) {
                console.error("Error fetching guides:", error);
            }
        };

        fetchEventDetails();
        fetchGuides();
    }, [eventId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "name") {
            // Example validation: only letters, numbers, and spaces allowed
            const isValid = /^[a-zA-Z\s]+$/.test(value);
            if (!isValid) {
                setNameWarning("Event name can only contain letters, and spaces.");
            } else {
                setNameWarning("");
            }
        }

        setFormData({ ...formData, [name]: value });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(
                `${import.meta.env.VITE_API_BASE_URL}/api/v1/events/update-event/${eventId}`,
                formData
            );
            toast.success("Event updated successfully!");
            navigate("/manage-events");
        } catch (error) {
            console.error("Error updating event:", error);
        }
    };

    return (
        <Layout>
            <div className="m-up flex flex-col items-center">
                <form className="event-form mt-5" onSubmit={handleSubmit}>
                    <h2 className=" text-2xl font-bold z-20 relative">Update Event</h2>
                    <input
                        type="text"
                        name="name"
                        placeholder="Event Name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                    {nameWarning && (
                        <p className="text-red-500 text-sm mt-1">{nameWarning}</p>
                    )}

                    <select name="type" value={formData.type} onChange={handleInputChange}>
                        <option value="solo">Solo</option>
                        <option value="group">Group</option>
                    </select>

                    <select name="category" value={formData.category} onChange={handleInputChange} required>
                        <option value="">Select Category</option>
                        <option value="Cultural">Cultural Event</option>
                        <option value="Sports">Sports</option>
                    </select>

                    {/* Guide Selection Dropdown */}
                    <select name="guide" value={formData.guide} onChange={handleInputChange} required>
                        <option value="">Select Event Coordinator</option>
                        {guides.map((guide) => (
                            <option key={guide._id} value={guide._id}>
                                {guide.name}
                            </option>
                        ))}
                    </select>

                    <div className="input-group">
                        <label htmlFor="startDate">Registration Start Date</label>
                        <input
                            type="date"
                            id="startDate"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="endDate">Registration End Date</label>
                        <input
                            type="date"
                            id="endDate"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {formData.type === "group" && (
                        <div className="input-group mb-0">
                            <label htmlFor="groupLimit">
                                Group Limit{" "}
                                <p style={{ color: "green", marginBottom: "0px" }}>
                                    (enter 0 if no Group Limit)
                                </p>
                            </label>
                            <input
                                type="number"
                                id="groupLimit"
                                name="groupLimit"
                                value={formData.groupLimit}
                                onChange={handleInputChange}
                                min="0"
                                required
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={nameWarning !== ''}
                        className={`mt-4 px-4 py-2 rounded text-white font-semibold 
                        ${nameWarning !== '' ? 'bg-gray-400 cursor-not-allowed opacity-50' : 'bg-blue-500 hover:bg-blue-600'}`}>
                        Update Event
                    </button>

                </form>
            </div>
        </Layout>
    );
};

export default UpdateEventForm;
