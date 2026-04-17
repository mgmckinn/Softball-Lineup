/** @format */

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger Menu Button */}
      <button
        className={`hamburger-btn ${isOpen ? "open" : ""}`}
        onClick={toggleMenu}
        aria-label='Toggle menu'>
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Sidebar Menu */}
      <nav className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className='sidebar-header'>
          <h2>Menu</h2>
          <button className='close-btn' onClick={toggleMenu}>
            ×
          </button>
        </div>
        <ul className='sidebar-menu'>
          <li
            className={location.pathname === "/" ? "active" : ""}
            onClick={() => handleNavigation("/")}>
            <span className='menu-icon'>⚾</span>
            <span>Lineup Generator</span>
          </li>
          <li
            className={location.pathname === "/batting-order" ? "active" : ""}
            onClick={() => handleNavigation("/batting-order")}>
            <span className='menu-icon'>⚾</span>
            <span>Batting Order</span>
          </li>
          <li
            className={location.pathname === "/rotation-log" ? "active" : ""}
            onClick={() => handleNavigation("/rotation-log")}>
            <span className='menu-icon'>⚾</span>
            <span>Rotation Log</span>
          </li>
        </ul>
      </nav>

      {/* Overlay */}
      {isOpen && <div className='sidebar-overlay' onClick={toggleMenu}></div>}
    </>
  );
}

export default Sidebar;
