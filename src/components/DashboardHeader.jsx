import React from "react";
import { useState, useEffect } from "react";
import axios from "../api/axios";
import checkoutHandler from "../utils/Razorpay";
import { useSelector } from "react-redux";

const DashboardHeader = () => {
  const { userData } = useSelector((state) => state.userDetails);
  console.log("userData in DashboardHeader", userData);

  return (
    <div className="grid grid-cols-2 gap-8 mb-6">
      <div className="bg-white p-4 rounded-2xl shadow-lg">
        <h3 className="text-lg font-medium ">Payment Status</h3>
        <p className="text-gray-600">
          {userData.paymentId ? "Payment Successful" : "Payment Pending"}
        </p>
        {userData.paymentId === "" && (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-3"
            onClick={checkoutHandler}
          >
            Pay Now
          </button>
        )}
      </div>
      <div className="bg-white pb-5 rounded-2xl shadow-lg">
        <h3 className="text-lg font-medium m-3">Admit Card</h3>
        {userData.admitCard === "" ? (
          <p className="text-gray-600 px-4">Pay fees to get your Admit Card</p>
        ) : (
          <a
            href={userData.admitCard} // Link to the PDF
            download="AdmitCard.pdf" // Suggest a default filename
            target="_blank" // Open in a new tab
            rel="noopener noreferrer" // Security best practice
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-3"
            style= {{ backgroundColor: "#c61d23" }}
          >
            Download Your Admit Card
          </a>
        )}
      </div>
    </div>
  );
};

export default DashboardHeader;
