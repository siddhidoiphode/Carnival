import React, { useEffect, useState } from "react";
import axios from "axios";
import EventRegistrationModal from "../components/EventRegistrationModel";

const OngoingEvents = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/api/v1/student/ongoing`
                );
                setEvents(response.data);
            } catch (error) {
                console.error("Error fetching events", error);
            }
        };

        fetchEvents();
    }, []);

    return (
        <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.length > 0 ? (
                    events.map((event) => (
                        <div
                            key={event._id}
                            className="bg-white rounded-xl shadow-md p-4 border border-gray-200 flex flex-col justify-between h-full"
                        >
                            <div>
                                <h3 className="text-xl font-semibold">{event.name}</h3>
                                <p className="text-sm text-gray-600">Type: {event.type}</p>
                                <p className="text-sm text-gray-600">Category: {event.category}</p>
                                <p className="text-sm text-gray-600">
                                    Event Coordinator: {event.guide?.name || "Not Assigned"}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Ends on: {new Date(event.endDate).toDateString()}
                                </p>
                            </div>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 mt-auto rounded hover:bg-blue-600 w-full no-underline"
                                onClick={() => setSelectedEvent(event)}
                            >
                                Register
                            </button>
                        </div>

                    ))
                ) : (
                    <p className="text-center text-gray-500 col-span-full">
                        No ongoing events available.
                    </p>
                )}
            </div>

            {selectedEvent && (
                <EventRegistrationModal
                    event={selectedEvent}
                    onClose={() => setSelectedEvent(null)}
                />
            )}
        </div>
    );
};

export default OngoingEvents;
