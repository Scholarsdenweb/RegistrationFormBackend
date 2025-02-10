import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const DashboardSidebar = () => {
  const navigate = useNavigate();
  const location =  useLocation();

  const handleLogout = () => {
    // Clear the cookie by setting it with an expired date
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/");
  };
  
  

  return (
    <div className="bg-gray-900 text-white p-6 h-screen flex flex-col justify-between shadow-lg">
      <div>
        <h2 className="text-2xl font-bold mb-6" style={{ color: "#c61d23"}}>Dashboard</h2>
        <ul className="space-y-4">
          <li>
            <Link
              to="/dashboard"
              className={`${location.pathname === "/dashboard" ? "bg-gray-600" : ""} flex items-center text-gray-300 hover:text-white hover:bg-gray-700 px-4 py-2 rounded-md`}
            >
              📈 <span className="ml-2">View User Details</span>
            </Link>
          </li>
          <li>
            <Link
              to="/FormDetailPage"
              className={`${location.pathname === "/FormDetailPage" ? "bg-gray-600" : ""} flex items-center text-gray-300 hover:text-white hover:bg-gray-700 px-4 py-2 rounded-md`}
            >
              ✍️ <span className="ml-2">Edit Form Details</span>
            </Link>
          </li>
          <li>
            <Link
              to="/resultDetails"
              className={`${location.pathname === "/resultDetails" ? "bg-gray-600" : ""} flex items-center text-gray-300 hover:text-white hover:bg-gray-700 px-4 py-2 rounded-md`}
            >
              📊 <span className="ml-2">Result Details</span>
            </Link>
          </li>
        </ul>
      </div>

      <div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center border border-red-500  text-white py-2 rounded-md hover:bg-red-600 transition duration-200"
        >
          ❌ <span className="ml-2">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default DashboardSidebar;
