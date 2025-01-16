import React from 'react'
import Layout from "../../../src/components/Layout/Layout"
import AdminMenu from "../../components/Layout/AdminMenu";
import { useAuth } from "../../context/auth";

const AdminDashboard = () => {
  const [auth] = useAuth();
  
  const backgroundImageUrl = "https://asset.gecdesigns.com/img/wallpapers/fairytale-valley-at-night-glowing-flowers-nature-wallpaper-sr10012422-1706504489805-cover.webp";

  const dashboardStyle = {
    backgroundImage: `url(${backgroundImageUrl})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    minHeight: "100vh",
  };

  const cardStyle = {
    backgroundColor: "rgba(0, 0,0, 0.001)", // semi-transparent white background
    color: "white", // default text color
    borderRadius: "8px", // rounded corners
    padding: "20px",
    backdropFilter: "blur(10px)", // apply blur effect
    WebkitBackdropFilter: "blur(10px)", // for Safari
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // subtle shadow for depth
    border: "1px solid rgba(255, 255, 255, 0.3)", // light border for glass effect
  };

  return (
    <Layout>
      <div className="container-fluid m-3 p-3 dashboard text-center" style={dashboardStyle}>
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <div className="card w-80" style={cardStyle}>
              <h3>Admin Name: {auth?.user?.name}</h3>
              <h3>Admin Email: {auth?.user?.email}</h3>
              <h3>Admin Contact: {auth?.user?.phone}</h3>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
