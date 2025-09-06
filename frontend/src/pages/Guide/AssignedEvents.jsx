import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Layout from "../../components/Layout/Layout";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const handleDownloadExcel = async (eventId, eventName) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/guide/event-registrations/${eventId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const registrations = res.data.registrations;

    if (!registrations.length) {
      alert("No registrations found for this event.");
      return;
    }

    let includeSpecialization = false;

    const formattedData = registrations.flatMap((reg) => {
      if (reg.type === "solo") {
        const hasSpecialization = reg.formData.specialization?.trim();
        if (hasSpecialization) includeSpecialization = true;

        const data = {
          ...reg.formData,
          registrationDate: new Date(reg.registeredAt).toLocaleString(),
        };

        // Remove specialization field if empty
        if (!hasSpecialization) delete data.specialization;

        return data;
      } else if (reg.type === "group") {
        return reg.participants.map((p) => ({
          TeamName: reg.teamName || "",
          Name: p.name,
          RollNumber: p.rollNumber,
          Branch: p.branch,
          Year: p.year,
          Division: p.division,
          Email: p.email,
          Mobile: p.mobileNumber,
          registrationDate: new Date(reg.registeredAt).toLocaleString(),
        }));
      }
    });

    // Remove specialization column if not needed
    if (!includeSpecialization) {
      formattedData.forEach((entry) => delete entry.specialization);
    }

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `${eventName.replace(/\s+/g, "_")}_Registrations.xlsx`);
  } catch (error) {
    console.error("Error downloading Excel:", error);
    alert("Failed to download Excel. Please try again.");
  }
};

const AssignedEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAssignedEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/guide/assigned-events`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEvents(res.data.events || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching assigned events", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedEvents();
  }, []);

  if (loading) return <p className="text-center mt-4">Loading assigned events...</p>;

  return (
    <Layout>
      <div className="p-4 md:p-6">
        <div className="flex flex-col items-center mt-5 min-h-screen">
          <h2 className="text-2xl font-bold mt-5 mb-5 text-center">Assigned Events</h2>
          {events.length === 0 ? (
            <p className="text-center">No events assigned yet.</p>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="min-w-[600px] w-full border-collapse border border-gray-200 text-center shadow-md">
                <thead>
                  <tr className="bg-gray-100 text-sm md:text-base">
                    <th className="border p-2">Event Name</th>
                    <th className="border p-2">Type</th>
                    <th className="border p-2">Category</th>
                    <th className="border p-2">Dates</th>
                    <th className="border p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr key={event._id} className="text-sm md:text-base">
                      <td className="border p-2 font-medium">{event.name}</td>
                      <td className="border p-2 capitalize">{event.type}</td>
                      <td className="border p-2 capitalize">{event.category}</td>
                      <td className="border p-2">
                        {new Date(event.startDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}{" "}
                        -{" "}
                        {new Date(event.endDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="border p-2">
                        <div className="flex flex-col md:flex-row gap-2 justify-center items-center">
                          <Link
                            to={`/event-registrations/${event._id}`}
                            className="inline-block bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 text-center"
                            style={{ textDecoration: "none" }}
                          >
                            View Registrations
                          </Link>
                          <button
                            onClick={() => handleDownloadExcel(event._id, event.name)}
                            className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 text-center"
                          >
                            Download Excel
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AssignedEvents;
