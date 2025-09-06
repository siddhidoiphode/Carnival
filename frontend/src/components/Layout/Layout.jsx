import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Layout = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Convert JSON string to object
    }
  }, []);

  return (
    <div>
      <Header user={user} /> 
      <main style={{ minHeight: "80vh" }}>
        <ToastContainer />
        {children}
      </main>
      <Footer />
    </div>
  );
};


// Layout.defaultProps = {
//   title: "Event Registration",
//   description: "Event Registration Website",
//   keywords: "event, registration, cultural, sports, MERN",
//   author: "Your Name",
// };

export default Layout;

