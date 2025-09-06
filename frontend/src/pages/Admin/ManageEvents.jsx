import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ManageEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [confirmationText, setConfirmationText] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/events/get-all-event`);
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events", error);
    }
  };

  const handleDeleteClick = (id) => {
    setSelectedEventId(id);
    setShowModal(true);
    setConfirmationText("");
  };

  const confirmDeletion = async () => {
    if (confirmationText.toLowerCase() !== "yes") {
      alert("Please type 'yes' to confirm deletion.");
      return;
    }

    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/v1/events/delete-event/${selectedEventId}`);
      setEvents(events.filter((event) => event._id !== selectedEventId));
      setShowModal(false);
      alert("Event and its registrations deleted successfully.");
    } catch (error) {
      console.error("Error deleting event", error);
      alert("Error deleting event");
    }
  };

  return (
  <Layout>
    <div className="p-4 flex flex-col items-center mt-5 w-full">
      <h2 className="text-2xl font-bold mb-4 mt-5 text-center">Event Management</h2>

      <div className="w-full overflow-x-auto px-2">
        <table className="min-w-[700px] border-collapse border border-gray-200 text-center shadow-md rounded-lg w-full">
          <thead>
            <tr className="bg-gray-100 text-sm sm:text-base">
              <th className="border p-2">Name</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Event Coordinator</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event._id} className="border-b text-sm sm:text-base">
                <td className="border p-2">{event.name}</td>
                <td className="border p-2">{event.type}</td>
                <td className="border p-2">{event.category}</td>
                <td className="border p-2">{event.guide?.name || "N/A"}</td>
                <td className="border p-2 text-center">
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
                    <button
                      onClick={() => handleDeleteClick(event._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded w-full sm:w-auto text-sm sm:text-base"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => navigate(`/update-event/${event._id}`)}
                      className="bg-blue-500 text-white px-4 py-2 rounded w-full sm:w-auto text-sm sm:text-base"
                    >
                      Update
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* MODAL */}
    {showModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-5 rounded-xl shadow-lg w-[90%] max-w-md">
          <h3 className="text-xl font-semibold mb-4 text-red-600">
            Are you sure you want to delete this event?
          </h3>
          <p className="mb-2 text-sm text-gray-600">
            Type <strong>"yes"</strong> to confirm.
          </p>
          <input
            type="text"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-red-400"
            placeholder='Type "yes" here...'
          />
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setShowModal(false)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              onClick={confirmDeletion}
              className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </div>
    )}
  </Layout>
);

};

export default ManageEvents;
