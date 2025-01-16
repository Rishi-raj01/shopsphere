import React, { useState } from "react";
import "../../index.css";
import { useAuth } from "../../context/auth";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { FaShopware } from "react-icons/fa6";
import { toast } from "react-toastify";
import SearchInput from "../Form/SearchInput";
import useCategory from "../hooks/useCategory";
import { useCart } from "../../context/cart";
import { Badge } from "antd";

const Header = () => {
  const [auth, setAuth] = useAuth();
  const [showSearch, setShowSearch] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [cart] = useCart(); // Default to an empty array if cart is undefined
  const navigate = useNavigate();
  const categories = useCategory();

  const handleLogout = () => {
    setAuth({ ...auth, user: null, token: "" });
    localStorage.removeItem("auth"); // No extra spaces in "auth"
    toast.success("Successfully Logged Out");
    navigate("/");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarTogglerDemo01"
            aria-controls="navbarTogglerDemo01"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          
          <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
            
            <Link to="/" className="navbar-brand">
              <FaShopware />
              ShopSphere
            </Link>
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink to="/" className="nav-link">
                  Home
                </NavLink>
              </li>

              {!auth?.user ? (
                <>
                  <li className="nav-item">
                    <NavLink to="/register" className="nav-link">
                      Register
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/login" className="nav-link">
                      Login
                    </NavLink>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item dropdown">
                    <NavLink
                      className="nav-link dropdown-toggle"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      style={{ border: "none" }}
                    >
                      {auth?.user?.name}
                    </NavLink>
                    <ul className="dropdown-menu">
                      <li>
                        <NavLink
                          to={`/dashboard/${
                            auth?.user?.role === "admin" ? "admin" : "user"
                          }`}
                          className="dropdown-item"
                        >
                          Dashboard
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          onClick={handleLogout}
                          to="/login"
                          className="dropdown-item"
                        >
                          Logout
                        </NavLink>
                      </li>
                    </ul>
                  </li>
                </>
              )}

              <SearchInput />

              <li className="nav-item">
                <NavLink to="/cart" className="nav-link">
                  <Badge count={cart.length} showZero offset={[10, -5]}>
                    Cart
                  </Badge>
                </NavLink>
              </li>
            </ul>
          </div>

          <div className="d-block d-md-none p-2">
  <div className="d-flex justify-content-between">
    {/* Left side content (empty or add any elements if necessary) */}
    <div className="d-flex"></div>

    {/* Centered "shopsphere" */}
    <div className="d-flex justify-content-center align-items-center" style={{ flex: 1 }}>
      <Link
        to="/"
        style={{
          textDecoration: "none",
          color: "black",
          fontWeight: "bold",
          fontSize: "18px",
          margin:"auto",
          marginRight:"2.1rem"
        }}
      >
        shopsphere
      </Link>
    </div>

    {/* Right side content (profile, search, cart) */}
    <div className="d-flex align-items-center">
      <NavLink
        to="/dashboard/user"
        className="mx-3"
        style={{ textDecoration: "none", color: "black" }}
      >
        <i className="fa fa-user" style={{ fontSize: "24px" }} />
        👨🏻‍💼
      </NavLink>
      {/* Search Icon Button */}
      <button
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "24px",
        }}
        onClick={() => setShowSearch(!showSearch)}
      >
        ⌕
      </button>
      <NavLink
        to="/cart"
        className="mx-1"
        style={{
          textDecoration: "none",
          marginRight: "0px",
          paddingRight: "0px",
        }}
      >
        <Badge count={cart.length} showZero offset={[10, -5]}>
          <i className="fa fa-shopping-cart" style={{ fontSize: "24px" }} />
          🛒
        </Badge>
      </NavLink>
    </div>
  </div>

  {/* Conditionally Render the Search Input */}
  {showSearch && (
    <div className="p-1">
      <SearchInput />
    </div>
  )}
</div>

        </div>
      </nav>
    </>
  );
};

export default Header;
