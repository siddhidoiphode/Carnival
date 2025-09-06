import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai"; // Icons for better UI
import logo from "/images/clg-logo.jpg";
import { Link } from 'react-router-dom';

const Header = ({ user }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const renderNav = () => {
    if (!user) {
      // Show all general routes by default (previously shown to 'student')
      return (
        <ul className="navbar-nav">
          <li className="nav-item">
            <NavLink to="/" className="nav-link">Home</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/events" className="nav-link">Events</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/notice" className="nav-link">Notice</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/register" className="nav-link">Register</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/login" className="nav-link">Login</NavLink>
          </li>
        </ul>
      );
    }

    if (user.role === "guide") {
      return (
        <ul className="navbar-nav">
          <li className="nav-item">
            <NavLink to="/" className="nav-link">Home</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/assigned-events" className="nav-link">Assigned-Events</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/profile" className="nav-link">Update-Profile</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/upload-notice" className="nav-link">Upload-Notice</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/logout" className="nav-link">Logout</NavLink>
          </li>
        </ul>
      );
    }

    if (user.role === "admin") {
      return (
        <ul className="navbar-nav">
          <li className="nav-item">
            <NavLink to="/" className="nav-link">Home</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/create-event" className="nav-link">Create-Event</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/manage-events" className="nav-link">Manage-Events</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/approve-guides" className="nav-link">Approve-Event-Coordinator</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/upload-notice" className="nav-link">Upload-Notice</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/manage-notice" className="nav-link">Manage-Notices</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/gallery" className="nav-link">Gallery</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/profile" className="nav-link">Update-Profile</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/logout" className="nav-link">Logout</NavLink>
          </li>
        </ul>
      );
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-body-tertiary px-3 fixed-top mb-5">
      <div className="container-fluid">
        {/* Logo & Brand */}
        <NavLink to="/" className="navbar-brand d-flex align-items-center">
          <img src={logo} alt="Logo" style={{ height: "50px" }} className="me-2" />
          <h3 className="mb-0"><b>Carnival</b></h3>
        </NavLink>

        {/* Hamburger Button for small screens */}
        <div className="d-lg-none">
          {!menuOpen && (
            <button className="btn" onClick={toggleMenu}>
              <AiOutlineMenu size={30} />
            </button>
          )}
        </div>

        {/* Sidebar Menu on small screens */}
        <div className={`custom-menu ${menuOpen ? "open" : ""}`}>
          <button className="close-btn" onClick={toggleMenu}>
            <AiOutlineClose size={30} />
          </button>
          {renderNav()}
          <div className="flex flex-col gap-2">
            <a
              href="https://www.sknscoe.ac.in/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="About SKNSCOE official website"
              className="inline-block text-[#4285F4] hover:text-[#0b66c3] transition-colors duration-200 font-medium"
              style={{ textDecoration: "none" }}
            >
              About
            </a>
            <Link
              to="/contact"
              aria-label="Contact Page"
              className="inline-block text-[#EA4335] hover:text-[#c5221f] transition-colors duration-200 font-medium"
              style={{ textDecoration: "none" }}
            >
              Contact
            </Link>
          </div>
          
        </div>

        {/* Full nav on large screens */}
        <div className="d-none d-lg-flex ms-auto">
          {renderNav()}
        </div>
      </div>
    </nav>
  );
};

export default Header;
