import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../components/Layout/Layout"
import EventRegistrationModal from "../../components/EventRegistrationModel";

const StudentEvents = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      document.body.style.overflow = "hidden"; // lock scroll
    } else {
      document.body.style.overflow = "auto"; // unlock scroll
    }

    return () => {
      document.body.style.overflow = "auto"; // cleanup
    };
  }, [selectedEvent]);


  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/student/ongoing`);
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events", error);
    }
  };

  return (
    <Layout>
      <div className="p-4 flex flex-col items-center">
        <h2 className="text-2xl font-bold p-3 text-center mt-5">Ongoing Events</h2>

        {/* Responsive Table Container */}
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse border border-gray-200 text-center shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Name</th>
                <th className="border p-2">Type</th>
                <th className="border p-2">Category</th>
                <th className="border p-2">Event Coordinator</th>
                <th className="border p-2">End Date of Registration</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.length > 0 ? (
                events.map((event) => (
                  <tr key={event._id} className="border-b">
                    <td className="border p-2">{event.name}</td>
                    <td className="border p-2">{event.type}</td>
                    <td className="border p-2">{event.category}</td>
                    <td className="border p-2">{event.guide?.name || "Not Assigned"}</td>
                    <td className="border p-2">{new Date(event.endDate).toDateString()}</td>
                    <td className="border p-2">
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded w-full sm:w-auto"
                        onClick={() => setSelectedEvent(event)}
                      >
                        Register
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-4 text-gray-500">
                    No ongoing events available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Registration Modal */}
      {selectedEvent && <EventRegistrationModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
    </Layout>

  );
};

export default StudentEvents;
