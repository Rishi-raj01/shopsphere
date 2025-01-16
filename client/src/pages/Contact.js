import React from 'react'
import Layout from '../components/Layout/Layout'
import aboutImage from "../images/about.jpeg"; // Ensure the image path is correct
import whatsappIcon from '../images/icons8-whatsapp-48.png';

import { BiMailSend, BiPhoneCall, BiSupport } from "react-icons/bi";
const Contact = () => {
  return (
    <Layout title={"Contact us"}>
      <div className="row contactus ">
        <div className="col-md-6 ">
        <img
              src={aboutImage}
              alt="ShopSphere About Us"
              className="img-fluid rounded shadow-sm"
            />
        </div>
        <div className="col-md-4">
          <h1 className="bg-dark p-2 text-white text-center">CONTACT US</h1>
          <p className="text-justify mt-2">
            any query and info about prodduct feel free to call anytime we 24X7
            vaialible
          </p>
          {/* <p className="mt-3">
            <BiMailSend /> : www.help@ecommerceapp.com
          </p> */}
          <p className="mt-3">
            <BiPhoneCall /> : 012-3456789
          </p>
             <a 
                    href="https://wa.me/+919508253143?text=hey%20I%20wanted%20to%20ask%20about%20your%20products%20and%20its%20details%20" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    WhatsApp 
                    <img 
                      src={whatsappIcon} 
                      alt="WhatsApp Icon" 
                      style={{ marginLeft: "5px", width: "24px", verticalAlign: "middle" }} 
                    />
                  </a>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;