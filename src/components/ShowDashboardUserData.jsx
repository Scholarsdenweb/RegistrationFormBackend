import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { updateUserDetails } from "../redux/slices/userDeailsSlice";
import { fetchUserDetails } from "../redux/slices/userDeailsSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

const ShowDashboardUserData = () => {
  const dispatch = useDispatch();
  const { userData, loading } = useSelector((state) => state.userDetails);
  const [errors, setErrors] = useState();

  const [editing, setEditing] = useState(false);

  // Fetch user details from API
  // const fetchUserDetails = async () => {
  //   try {
  //     const response = await axios.get("/students/getStudentsById");
  // setUserDetails(response.data);
  //     setUpdatedDetails(response.data);
  //     console.log("User details fetched:", response.data);
  //     setLoading(false);
  //   } catch (error) {
  //     console.error("Error fetching user details:", error);
  //     setLoading(false);
  //   }
  // };

  // Handle input changes in the edit form

  const validateData = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Email must be a valid email address",
      }));
      return false;
    }
    return true;
  };
  const handleEditChange = (e) => {
    const { name, value } = e.target;

    dispatch(updateUserDetails({ [name]: value }));
    if (value.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  // Handle updating user details
  const handleUpdateDetails = async () => {
    if (!validateData()) return;
    try {
      const response = await axios.patch("/students/editStudent", userData);
      // setUserDetails((prev) => ({ ...prev, ...updatedDetails }));
      setEditing(false);
      console.log("Details updated successfully:", response.data);
    } catch (error) {
      setErrors({ "error": error.response.data });
      console.error("Error updating user details:", error);
    }
  };

  // Toggle edit mode
  const toggleEditing = () => {
    setEditing(!editing);
  };

  // Fetch user details on component mount
  useEffect(() => {
    dispatch(fetchUserDetails());
    // fetchUserDetails();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 shadow-xl rounded-2xl">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">User Details</h3>
      {editing ? (
        <div>
          {/* Edit Form */}
          {Object.keys(userData).map(
            (key) =>
              (key == "name" || key == "email") && (
                <div className="mb-5" key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </label>
                  <input
                    type="text"
                    name={key}
                    value={userData[key]}
                    onChange={handleEditChange}
                    className="p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              )
          )}
          {errors && (
            <div className="text-red-500 mb-4">
              {Object.keys(errors).map((error) => (
                <p key={error}>{errors[error]}</p>
              ))}
            </div>
          )}
          <button
            className=" hover:bg-indigo-600 text-white py-3 px-6 rounded-lg mt-4"
            style={{ backgroundColor: "#c61d23" }}
            onClick={handleUpdateDetails}
          >
            Update Details
          </button>
        </div>
      ) : (
        <div>
          {/* View Mode */}
          {Object.keys(userData).map(
            (key) =>
              key !== "paymentStatus" &&
              key !== "admitCard" &&
              key !== "paymentId" &&
              key !== "result" && (
                <p className="text-gray-700 mb-4" key={key}>
                  <span className="font-semibold text-gray-800">
                    {key.charAt(0).toUpperCase() + key.slice(1)}:
                  </span>{" "}
                  {userData[key]}
                </p>
              )
          )}
          <button
            className=" hover:bg-indigo-600 text-white py-3 px-6 rounded-lg mt-4"
            onClick={toggleEditing}
            style={{ backgroundColor: "#c61d23" }}

          >
            Edit Details
          </button>
        </div>
      )}
    </div>
  );
};

export default ShowDashboardUserData;
