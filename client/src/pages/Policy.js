import React from "react";
import Layout from "../components/Layout/Layout";
import { NavLink ,Link} from "react-router-dom";
const Policy = () => {
  return (
    <Layout title={"Our Policy - Ritwins"}>
      <div className="container mt-4">
        <h1 className="mb-3 text-center">Privacy Policy</h1>
        <p>
          At <strong>Ritwins</strong>, we value your trust and are committed to safeguarding your privacy. This privacy policy outlines how we collect, use, and protect your personal information when you visit or make a purchase on our website.
        </p>

        <h2 className="mt-4 mb-3">Information We Collect</h2>
        <p>When you use our services, we may collect the following types of information:</p>
        <ul>
          <li>
            <strong>Personal Information:</strong> Your name, email address, phone number, and delivery address when placing an order.
          </li>
          <li>
            <strong>Payment Information:</strong> Details required to process your payment securely.
          </li>
          <li>
            <strong>Usage Information:</strong> Data about your interactions with our website to improve your experience.
          </li>
        </ul>

        <h2 className="mt-4 mb-3">How We Use Your Information</h2>
        <ul>
          <li>To process and fulfill your orders efficiently.</li>
          <li>To provide customer support and address your queries.</li>
          <li>To improve our products, services, and website experience.</li>
          <li>To send you updates about your order and promotional offers (with your consent).</li>
        </ul>

        <h2 className="mt-4 mb-3">Delivery Policy</h2>
        <p>
          At <strong>Ritwins</strong>, we work closely with our suppliers to ensure timely delivery of your orders. Our handmade crochets and gifts are crafted with care, and delivery times may vary based on the item’s complexity and availability. 
        </p>
        <p>
          Please confirm the estimated delivery timeline for your specific order by contacting us or the supplier. Typically, handmade items are delivered within <strong>7-14 business days</strong> from the date of order confirmation. Custom or bulk orders may require additional time.
        </p>

        <h2 className="mt-4 mb-3">Your Rights and Choices</h2>
        <ul>
          <li>
            <strong>Access and Update:</strong> You can access and update your personal information at any time.
          </li>
          <li>
            <strong>Opt-Out:</strong> You can opt out of receiving promotional communications from us.
          </li>
          <li>
            <strong>Data Removal:</strong> You can request the deletion of your personal information, subject to legal and regulatory requirements.
          </li>
        </ul>

        <h2 className="mt-4 mb-3">How We Protect Your Information</h2>
        <p>
          We use industry-standard security measures to protect your personal information from unauthorized access, alteration, or disclosure. However, no online system can be completely secure, and we urge you to take precautions to safeguard your data.
        </p>
        <Link to="/contact" style={{textDecoration: "none",fontSize: "1.2rem", color: "#007bff",fontWeight: "bold",  padding: "0.5rem 1rem",transition: "all 0.3s ease"}}>Contact us </Link>
        {/* <h2 className="mt-4 mb-3">Contact Us</h2> */}
        
        <p>
          If you have any questions or concerns about our privacy policy or delivery process, please feel free to contact us at <strong>support@ritwins.com</strong>.
        </p>
        <p>
          Thank you for choosing Ritwins. We’re committed to making your shopping experience delightful and secure!
        </p>
      </div>
    </Layout>
  );
};

export default Policy;
