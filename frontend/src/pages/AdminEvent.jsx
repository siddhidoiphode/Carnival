import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminEvent = () => {
    const [events, setEvents] = useState([]);
    const [eventCategoryTotals, setEventCategoryTotals] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchEventsWithCounts = async () => {
        try {
            const token = localStorage.getItem("token");

            const eventsRes = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/api/v1/student/all`
            );

            const updatedEvents = await Promise.all(
                eventsRes.data.map(async (event) => {
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

            // Summarize by category instead of type
            const categoryTotals = {};
            updatedEvents.forEach((event) => {
                const category = event.category || "Uncategorized";
                if (!categoryTotals[category]) categoryTotals[category] = 0;
                categoryTotals[category] += event.regCount;
            });

            setEventCategoryTotals(categoryTotals);
        } catch (error) {
            console.error("Error fetching events or registration counts", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEventsWithCounts();
    }, []);

    if (loading) return <p className="text-center mt-4">Loading ongoing events...</p>;

    return (
        <div className="p-6">
            {/* Header Summary Row */}
            {Object.keys(eventCategoryTotals).length > 0 && (
                <div className="mt-5 flex justify-center mb-5">
                    <div className="bg-white p-4 rounded-xl shadow-md border flex flex-wrap items-center gap-6 max-w-4xl w-full">
                        <h4 className="text-2xl font-bold text-gray-800 whitespace-nowrap">
                            Registrations Summary
                        </h4>
                        <div className="flex flex-wrap items-center gap-4">
                            {Object.entries(eventCategoryTotals).map(([category, count]) => (
                                <div
                                    key={category}
                                    className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-medium shadow-sm"
                                >
                                    <span className="capitalize">{category}:</span>
                                    <span>{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Event Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                {events.length > 0 ? (
                    events.map((event) => (
                        <div
                            key={event._id}
                            className="bg-white rounded-xl shadow-md p-4 border border-gray-200 flex flex-col justify-between h-full"
                        >
                            <div>
                                <h3 className="text-xl font-semibold mb-2 text-gray-800">{event.name}</h3>
                                <p className="text-sm text-gray-600">Type: {event.type}</p>
                                <p className="text-sm text-gray-600">Category: {event.category}</p>
                                <p className="text-sm text-gray-600">
                                    Event Coordinator: {event.guide?.name || "Not Assigned"}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Ends on: {new Date(event.endDate).toDateString()}
                                </p>
                            </div>
                            <p className="text-sm font-medium text-blue-600 mt-4">
                                Registrations: {event.regCount}
                            </p>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 col-span-full">
                        No ongoing events available.
                    </p>
                )}
            </div>
        </div>
    );
};

export default AdminEvent;
