// src/pages/Dashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import FormDetailPage from "./FormDetailPage";
import ResultPage from "./ResultPage";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";
import ShowDashboardUserData from "./ShowDashboardUserData";
import { useSelector } from "react-redux";
import Spinner from "../api/Spinner"; // Assuming Spinner is a spinner component
import Sidebar from "./Sidebar";
import Navbar from "./Form/Navbar";
import UserInfo from "./DashboardCompoments/UserInfo";
import UserDetail from "./DashboardCompoments/UserDetail";
import DailyNotice from "./DashboardCompoments/DailyNotice";
import Scholarship from "./DashboardCompoments/Scholarship";

const Dashboard = () => {
  // Fetch user details from Redux state
  const { loading } = useSelector((state) => state.userDetails);

  return (
    <div
      className="w-full h-screen overflow-auto "
      style={{ backgroundColor: "#c61d23" }}
    >
      <div className="grid grid-cols-7 h-full">
        {/* Spinner */}
        {/* {loading && (
        <div className="fixed inset-0 bg-opacity-50 z-50 flex justify-center items-center">
          <Spinner />
        </div>
      )} */}

        {/* Left Sidebar */}
        <div className="col-span-1">
          <Sidebar />
        </div>

        <div className="flex flex-col col-span-6 h-full ">
          <Navbar />

          {/* Main Content Area */}
          <div
            className={`col-span-6 px-9 py-8 mb-3 mr-5 h-full bg-gray-100 rounded-3xl flex flex-col items-end gap-4 overflow-auto`}
          >
            <div className="w-full h-full grid grid-cols-10 gap-12">
              <div className="col-span-3">
                <UserInfo />
              </div>
              <div className="col-span-2">
                <UserDetail />
              </div>
              <div className="col-span-5 grid grid-rows-10 ">
                <div className="row-span-6 rounded-2xl">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold mb-1 ">
                      Daily Notice
                    </h2>
                    <button className="text-xl font-semibold text-red-700">View all</button>
                  </div>

                  <DailyNotice />
                </div>

                <div className="row-span-4 w-full h-full">
                  <div className="flex justify-between items-center ">
                    <h2 className="text-2xl font-semibold mb-1 ">Enrolled Courses</h2>
                    <button className="text-xl font-semibold text-red-700">View all</button>
                  </div>

                  <Scholarship />


                </div>
              </div>
            </div>

            {/* <h1 className="text-3xl font-bold text-gray-700 mb-6">
          User Dashboard
        </h1>
        <div className="mb-8">
          <DashboardHeader />
        </div>
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <ShowDashboardUserData />
        </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
