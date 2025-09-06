import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const EventRegistrationModal = ({ event, onClose }) => {
    const [formData, setFormData] = useState({});
    const [total, setTotal] = useState(1);
    const [teamName, setTeamName] = useState("");
    const [participants, setParticipants] = useState([
        { name: "", rollNumber: "", mobileNumber: "", year: "", branch: "", email: "", division: "" }
    ]);

    const mainParticipantLabel = event?.category === "sports" ? "Name of the Captain" : "Name of Leader";

    const handleChange = (e, fieldName) => {
        setFormData({ ...formData, [fieldName]: e.target.value });
    };

    const handleParticipantChange = (index, field, value) => {
        const updatedParticipants = [...participants];
        updatedParticipants[index][field] = value;
        setParticipants(updatedParticipants);
    };

    const addParticipant = () => {
        if (event?.groupLimit === 0 || participants.length < event?.groupLimit) {
            setTotal(total + 1);
            setParticipants([...participants, { name: "", rollNumber: "", mobileNumber: "", year: "", branch: "", email: "", division: "" }]);
        } else {
            toast.error(`Maximum ${event?.groupLimit} participants allowed.`);
        }
    };

    const removeParticipant = (index) => {
        if (index !== 0) {
            setParticipants(participants.filter((_, i) => i !== index));
            setTotal(total - 1);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (event?.type === "group" && !teamName.trim()) {
            toast.error("Please enter a team name.");
            return;
        }

        const token = localStorage.getItem("token");

        try {
            await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/v1/student/registerEvent`,
                {
                    eventId: event?._id,
                    formData,
                    participants,
                    teamName: event?.type === "group" ? teamName : undefined,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        ...(token && { Authorization: `Bearer ${token}` }) // include only if token exists
                    }
                }
            );

            toast.success("Registration successful!");
            onClose();
        } catch (error) {
            console.error("Error registering", error.response?.data || error);
            toast.error("Registration failed!");
        }
    };


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-200 bg-opacity-40 backdrop-blur-sm p-4 mt-4">
            <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg relative max-h-[90vh] overflow-y-auto mt-5">
                <h2 className="text-xl font-bold text-center mb-0 mt-2">Register for {event?.name}</h2>

                <form onSubmit={handleSubmit} className="p-4 mt-0 mb-5">
                    {event?.type === "solo" && (
                        <>
                            {event?.registrationFields.map((field, index) => (
                                <div key={index}>
                                    <label className="block text-sm font-semibold">{field.label}</label>
                                    {field.type === "dropdown" ? (
                                        <select
                                            className="border p-2 w-full rounded"
                                            onChange={(e) => handleChange(e, field.label)}
                                            required={field.required}
                                        >
                                            <option value="">Select an option</option>
                                            {field.options.map((option, i) => (
                                                <option key={i} value={option}>{option}</option>
                                            ))}
                                        </select>
                                    ) : (

                                        <input
                                            type={field.type}
                                            className="border p-2 w-full rounded"
                                            value={formData[field.label] || ""} // Ensure controlled input
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                // If field expects only alphabets and spaces
                                                if (field.label.toLowerCase().includes("name")) {
                                                    if (/^[a-zA-Z\s]*$/.test(value)) {
                                                        handleChange(e, field.label);
                                                    }
                                                } else {
                                                    handleChange(e, field.label); // For all other field types
                                                }
                                            }}
                                            required={field.required}
                                        />

                                    )}
                                </div>
                            ))}

                            {/* Additional fields for Solo Events */}
                            {["cricket", "khokho", "kabaddi"].includes(event?.name?.toLowerCase().replace(/\s/g, "")) && (
                                <div>
                                    <label className="block text-sm font-semibold">Specialization</label>
                                    <select
                                        className="border p-2 w-full rounded"
                                        onChange={(e) => handleChange(e, "specialization")}
                                        required
                                    >
                                        <option value="">Select Specialization</option>
                                        {event?.name?.toLowerCase().replace(/\s/g, "") === "cricket" && (
                                            <>
                                                <option value="Batsman">Batsman</option>
                                                <option value="Bowler">Bowler</option>
                                                <option value="All-Rounder">All-Rounder</option>
                                            </>
                                        )}
                                        {event?.name?.toLowerCase().replace(/\s/g, "") === "khokho" && (
                                            <>
                                                <option value="Chaser">Chaser</option>
                                                <option value="Defender">Defender</option>
                                            </>
                                        )}
                                        {event?.name?.toLowerCase().replace(/\s/g, "") === "kabaddi" && (
                                            <>
                                                <option value="Raider">Raider</option>
                                                <option value="Defender">Defender</option>
                                                <option value="All-Rounder">All-Rounder</option>
                                            </>
                                        )}
                                    </select>
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-semibold">Division</label>
                                <select
                                    className="border p-2 w-full rounded"
                                    onChange={(e) => handleChange(e, "division")}
                                    required
                                >
                                    <option value="">Select Division</option>
                                    <option value="NA">NA</option>
                                    <option value="A">A</option>
                                    <option value="B">B</option>
                                    <option value="C">C</option>
                                    <option value="D">D</option>
                                    <option value="E">E</option>
                                    <option value="F">F</option>
                                    <option value="G">G</option>
                                    <option value="H">H</option>
                                    <option value="I">I</option>
                                    <option value="J">J</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold">Roll Number</label>
                                <input
                                    type="number"
                                    className="border p-2 w-full rounded"
                                    onChange={(e) => handleChange(e, "rollNumber")}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold">Mobile Number</label>
                                <input
                                    type="number"
                                    className="border p-2 w-full rounded"
                                    onChange={(e) => handleChange(e, "mobileNumber")}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold">Email</label>
                                <input
                                    type="email"
                                    className="border p-2 w-full rounded"
                                    onChange={(e) => handleChange(e, "email")}
                                    required
                                />
                            </div>
                        </>
                    )}


                    {event?.type === "group" && (
                        <div>
                            {/* Team Name for Group Events */}
                            <div>
                                <label className="block text-sm font-semibold">Team Name</label>
                                <input
                                    type="text"
                                    className="border p-2 w-full rounded"
                                    value={teamName}
                                    onChange={(e) => setTeamName(e.target.value)}
                                    required
                                />
                            </div>

                            <h3 className="text-md font-semibold mt-3">Group Participants - {total}</h3>
                            <div className="max-h-[300px] overflow-y-auto border p-4 rounded bg-gray-50">
                                {participants.map((participant, index) => (
                                    <div key={index} className="border p-3 rounded mb-2 bg-white">
                                        <label className="block text-sm font-semibold">
                                            {index === 0 ? mainParticipantLabel : `Participant ${index}`}
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Name"
                                            className="border p-2 w-full mb-1 rounded"
                                            value={participant.name}
                                            onChange={(e) => {
                                                const newValue = e.target.value;
                                                if (/^[a-zA-Z\s]*$/.test(newValue)) {
                                                    handleParticipantChange(index, "name", newValue);
                                                }
                                            }}
                                            required
                                        />

                                        {/* Roll Number Field */}
                                        <label className="block text-sm font-semibold mt-2">Roll Number</label>
                                        <input
                                            type="number"
                                            placeholder="Roll Number"
                                            className="border p-2 w-full mb-1 rounded"
                                            value={participant.rollNumber}
                                            onChange={(e) => handleParticipantChange(index, "rollNumber", e.target.value)}
                                            required
                                        />

                                        {/* Mobile Number Field */}
                                        <label className="block text-sm font-semibold mt-2">Mobile Number</label>
                                        <input
                                            type="number"
                                            placeholder="Mobile Number"
                                            className="border p-2 w-full mb-1 rounded"
                                            value={participant.mobileNumber}
                                            onChange={(e) => handleParticipantChange(index, "mobileNumber", e.target.value)}
                                            required
                                        />

                                        <label className="block text-sm font-semibold mt-2">Email</label>
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            className="border p-2 w-full mb-1 rounded"
                                            value={participant.email}
                                            onChange={(e) => handleParticipantChange(index, "email", e.target.value)}
                                            required
                                        />

                                        {/* Dropdown for Year */}
                                        <label className="block text-sm font-semibold mt-2">Year</label>
                                        <select
                                            className="border p-2 w-full rounded"
                                            value={participant.year}
                                            onChange={(e) => handleParticipantChange(index, "year", e.target.value)}
                                            required
                                        >
                                            <option value="">Select Year</option>
                                            {event?.registrationFields
                                                .find((field) => field.label === "Current Year")?.options.map((option, i) => (
                                                    <option key={i} value={option}>{option}</option>
                                                ))
                                            }
                                        </select>

                                        {/* Dropdown for Branch */}
                                        <label className="block text-sm font-semibold mt-2">Branch</label>
                                        <select
                                            className="border p-2 w-full rounded"
                                            value={participant.branch}
                                            onChange={(e) => handleParticipantChange(index, "branch", e.target.value)}
                                            required
                                        >
                                            <option value="">Select Branch</option>
                                            <option value="CSE">CSE</option>
                                            <option value="AIDS">AIDS</option>
                                            <option value="ENTC">ENTC</option>
                                            <option value="ELECTRICAL">ELECTRICAL</option>
                                            <option value="MECHANICAL">MECHANICAL</option>
                                            <option value="CIVIL">CIVIL</option>
                                        </select>

                                        <div>
                                            <label className="block text-sm font-semibold mt-2">Division</label>
                                            <select
                                                className="border p-2 w-full rounded"
                                                value={participant.division}
                                                onChange={(e) => handleParticipantChange(index, "division", e.target.value)}
                                                required
                                            >
                                                <option value="">Select Division</option>
                                                <option value="NA">NA</option>
                                                <option value="A">A</option>
                                                <option value="B">B</option>
                                                <option value="C">C</option>
                                                <option value="D">D</option>
                                                <option value="E">E</option>
                                                <option value="F">F</option>
                                                <option value="G">G</option>
                                                <option value="H">H</option>
                                                <option value="I">I</option>
                                                <option value="J">J</option>
                                            </select>
                                        </div>

                                        {/* Remove Button */}
                                        {index !== 0 && (
                                            <button
                                                type="button"
                                                onClick={() => removeParticipant(index)}
                                                className="bg-red-500 text-white px-3 py-1 rounded mt-2 w-full"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Add Participant Button */}
                            {(event?.groupLimit === 0 || participants.length < event?.groupLimit) && (
                                <button
                                    type="button"
                                    onClick={addParticipant}
                                    className="bg-blue-500 text-white px-3 py-2 rounded mt-2 w-full"
                                >
                                    Add Participant
                                </button>
                            )}
                        </div>
                    )}

                    {/* Form Buttons */}
                    <div className="flex justify-between mt-4">
                        <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">
                            Cancel
                        </button>
                        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EventRegistrationModal;
