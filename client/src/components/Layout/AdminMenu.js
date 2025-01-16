import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./AdminMenu.css";

const AdminMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <div className="admin-menu-container text-center" style={{ backgroundColor: "rgba(0,0,0,0.2)", color: "white" }} >
      <button className="menu-toggle" onClick={toggleMenu}>
        Admin Menu {isMenuOpen ? "▲" : "▼"}
      </button>

      {/* Corrected className syntax */}
      <div className={`menu-links ${isMenuOpen ? "show" : ""}`}>
        <h4>Admin Panel</h4>
        <Link to="/dashboard/admin">Profile</Link>
        <Link to="/dashboard/admin/create-category">Create Category</Link>
        <Link to="/dashboard/admin/create-product">Create Product</Link>
        <Link to="/dashboard/admin/products">Manage Products</Link>
        <Link to="/dashboard/admin/orders">Orders</Link>
        <Link to="/dashboard/admin/users">Users</Link>
        {/* Add more links as needed */}
      </div>
    </div>
  );
};

export default AdminMenu;
