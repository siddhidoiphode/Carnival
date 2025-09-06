import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear local storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect to login page
    navigate("/");
  }, [navigate]);

  return null; // No UI needed
};

export default Logout;
