import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout/Layout";
import OngoingEvent from "./OngoingEvents";
import GuideEvent from "./GuideEvent";
import AdminEvent from "./AdminEvent";

const Homepage = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [user, setUser] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]); // ✅ New state

  const heroImages = [
    {
      url: "/images/clg1.JPG",
      heading: "SKN Sinhgad College of Engineering Korti , Pandharpur",
      description:
        'Accredited by NBA (UG Programmes - Civil , E&TC , Mech) & NAAC with "A+" Grade',
      buttonText: "Explore Events",
      buttonLink: "#events",
    },
    {
      url: "/images/clg2.JPG",
      heading: "SKN Sinhgad College of Engineering Korti , Pandharpur",
      description:
        'Accredited by NBA (UG Programmes - Civil , E&TC , Mech) & NAAC with "A+" Grade',
      buttonText: "Explore Events",
      buttonLink: "#events",
    },
    {
      url: "/images/clg3.JPG",
      heading: "SKN Sinhgad College of Engineering Korti , Pandharpur",
      description:
        'Accredited by NBA (UG Programmes - Civil , E&TC , Mech) & NAAC with "A+" Grade',
      buttonText: "Explore Events",
      buttonLink: "#events",
    },
  ];

  useEffect(() => {
    fetchEvents();
    fetchGallery(); // ✅ Fetch gallery images
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

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

  const fetchGallery = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/notice/gallery`);
      setGalleryImages(response.data); // ✅ Set images in state
    } catch (error) {
      console.error("Error fetching gallery", error);
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative w-full h-[80vh] sm:h-[70vh] xs:h-[60vh] overflow-hidden mt-5 shadow-2xl rounded-2xl">
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black to-transparent z-10" />
        {heroImages.map((slide, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${index === currentSlide ? "opacity-100 z-20" : "opacity-0 z-0"
              }`}
            style={{
              backgroundImage: `url(${slide.url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="w-full h-full flex items-center justify-center px-2 sm:px-4">
              <div className="w-full max-w-4xl bg-[#000000cc] flex flex-col items-center justify-center text-white text-center rounded-2xl shadow-2xl p-4 sm:p-8">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight">
                  {slide.heading}
                </h1>
                <p className="text-base sm:text-lg md:text-xl mb-6">
                  {slide.description}
                </p>
                <a
                  href={slide.buttonLink}
                  style={{ textDecoration: "none" }}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-full text-lg transition-all duration-300 shadow-md p-5"
                >
                  {slide.buttonText}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Events and Gallery Section */}
      <div
        id="events"
        className="flex flex-col lg:flex-row gap-6 mt-5 h-[80vh] items-start"
      >
        {/* Events Section */}
        <div className="w-full lg:w-2/3 flex flex-col h-full">
          <h2 className="text-2xl font-bold mb-2 text-center text-blue-700">
            All Events
          </h2>
          <div className="event-scroll-container flex-1">
            {user?.role === "admin" ? (
              <AdminEvent />
            ) : user?.role === "guide" ? (
              <GuideEvent />
            ) : (
              <OngoingEvent
                events={events}
                onRegisterClick={setSelectedEvent}
              />
            )}
          </div>
        </div>

        {/* ✅ Gallery Section */}
        <div className="w-full lg:w-1/3 flex flex-col">
          <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">
            Gallery
          </h2>

          <div className="grid grid-cols-2 gap-4 overflow-y-auto max-h-[600px] pr-2">
            {galleryImages.length > 0 ? (
              galleryImages.map((img, index) => (
                <div
                  key={index}
                  className="w-full bg-gray-200 rounded-lg shadow-md overflow-hidden"
                >
                  <img
                    src={img.imageUrl}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-auto object-contain"
                  />
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-2">
                No images available.
              </p>
            )}
          </div>
        </div>


      </div>
    </Layout>
  );
};

export default Homepage;
