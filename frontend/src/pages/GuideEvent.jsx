import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const GuideEvent = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAssignedEventsWithCounts = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/api/v1/guide/assigned-events`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const updatedEvents = await Promise.all(
                res.data.events.map(async (event) => {
                    try {
                        const regRes = await axios.get(
                            `${import.meta.env.VITE_API_BASE_URL}/api/v1/guide/event-registrations/${event._id}`,
                            {
                                headers: { Authorization: `Bearer ${token}` },
                            }
                        );

                        return {
                            ...event,
                            regCount: regRes.data?.registrations?.length || 0,
                        };
                    } catch {
                        return { ...event, regCount: 0 };
                    }
                })
            );

            setEvents(updatedEvents);
        } catch (error) {
            console.error("Error fetching assigned events", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssignedEventsWithCounts();
    }, []);

    if (loading) {
        return <p className="text-center mt-4">Loading assigned events...</p>;
    }

    return (
        <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.length > 0 ? (
                    events.map((event) => (
                        <div
                            key={event._id}
                            className="bg-white rounded-xl shadow-md p-4 border border-gray-200 flex flex-col justify-between"
                        >
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{event.name}</h3>
                            <p className="text-sm text-gray-600">Type: {event.type}</p>
                            <p className="text-sm text-gray-600">Category: {event.category}</p>
                            <p className="text-sm text-gray-600">
                                Registration End Dates:{" "}
                                {new Date(event.endDate).toLocaleDateString("en-IN")}
                            </p>
                            <p className="text-sm mt-2 text-blue-500">
                                Registrations: {event.regCount}
                            </p>
                            <Link
                                to={`/event-registrations/${event._id}`}
                                style={{ textDecoration: "none" }}
                                className="mt-2 text-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                            >
                                View Registrations
                            </Link>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 col-span-full">No assigned events.</p>
                )}
            </div>
        </div>
    );
};

export default GuideEvent;
