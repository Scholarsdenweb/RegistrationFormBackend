import React, { useEffect, useState } from "react";
import UserDetails from "../../assets/UserDetails.png";
import EditUserDetails from "../../assets/EditUserDetails.png";
import PaymentDue from "../../assets/PaymentDue.png";
import UserDetailsPage from "./UserDetailsPage";
import { useSelector } from "react-redux";
import EditUserDetailsPage from "./EditUserDetailsPage";
import PaymentDuePage from "./PaymentDuePage";

const UserDetail = () => {
  const [userDetailShow, setUserDetailShow] = useState(false);

  const [editUserDetailsShow, setEditUserDetailsShow] = useState(false);
  const [paymentDueShow, setPaymentDueShow] = useState(false);



 

  useEffect(() => {
    // Toggle body overflow to prevent scrolling when modal is open
    if (userDetailShow) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto"; // Cleanup on component unmount
    };
  }, [userDetailShow]);

  return (
    <div className="flex flex-col justify-start items-start h-full w-full">
      <h2 className="text-2xl font-semibold mb-1">User</h2>

      <div className="flex flex-col gap-4 justify-center h-full w-full">
        <div
          className="bg-white w-full h-1/3 hover:border-4 cursor-pointer border-red-600 rounded-xl shadow-xl flex flex-col justify-center items-center gap-1"
          onClick={() => setUserDetailShow(true)}
        >
          <div className="flex flex-col justify-center items-center">
            <img className="w-20 h-20" src={UserDetails} alt="User Details" />
            <h4 className="text-2xl text-center font-semibold">
              User
              <br /> Details
            </h4>
          </div>
        </div>
        <div className="bg-white w-full h-1/3 hover:border-4 cursor-pointer border-red-600 rounded-xl shadow-xl flex flex-col justify-center items-center gap-1"
        onClick={() => setEditUserDetailsShow(true)}
        >
          <div className="flex flex-col justify-center items-center">
            <img
              className="w-20 h-20"
              src={EditUserDetails}
              alt="Edit User Details"
            />
            <h4 className="text-2xl text-center font-semibold">
              Edit User
              <br /> Details
            </h4>
          </div>
        </div>
        <div className="bg-white w-full h-1/3 hover:border-4 cursor-pointer border-red-600 rounded-xl shadow-xl flex flex-col justify-center items-center gap-1"
        onClick={() => setPaymentDueShow(true)}
        >
          <div className="flex flex-col justify-center items-center">
            <img
              className="w-20 h-20"
              src={PaymentDue}
              alt="Payment Due"
            />
            <h4 className="text-2xl text-center font-semibold">
              Payment
              <br /> Due
            </h4>
          </div>
        </div>
      </div>

      {/* Render the UserDetailsPage when userDetailShow is true */}
      {userDetailShow && <UserDetailsPage setUserDetailShow={setUserDetailShow} />}
      {editUserDetailsShow && <EditUserDetailsPage setEditUserDetailsShow={setEditUserDetailsShow} />}

      {paymentDueShow && <PaymentDuePage setPaymentDueShow={setPaymentDueShow} />}
    </div>
  );
};

export default UserDetail;
