import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import NotificationWithIndicator from "../../assets/NotificationWithIndicator.png";

import NotificationWithoutIndicator from "../../assets/NotificationWithoutIndicator.png";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { userData: userDetails } = useSelector((state) => state.userDetails);

  useEffect(() => {
    console.log("userDetails", userDetails);
  }, []);
  useEffect(() => {
    console.log("userDetails", userDetails);
  }, [userDetails]);

  const pathLocation = useLocation().pathname;
  return (
    <div
      className={` pr-8 py-2 flex gap-12 ${
        pathLocation.includes("/registration")
          ? "justify-between"
          : "justify-end"
      } items-center`}
    >
      {pathLocation.includes("/registration") && (
        <div className="pl-10 flex gap-7 ">
          <Link
            to={"/registration/basicDetailsForm"}
            className={`${
              pathLocation === "/registration/basicDetailsForm"
                ? "bg-gray-200 text-black "
                : "text-white"
            }  p-2 rounded-xl`}
          >
            Basic/Batch{" "}
          </Link>
          <Link
            to={"/registration/educationalDetailsForm"}
            className={`${
              pathLocation === "/registration/educationalDetailsForm"
                ? "bg-gray-200 text-black "
                : "text-white"
            } p-2 rounded-xl`}
          >
            Educational/Family{" "}
          </Link>
        </div>
      )}
      <div className="flex items-center justify-center my-2 gap-12">
        <div className="flex justify-center items-center gap-3 ">
          {userDetails?.profilePicture ? (
            <img
              className="w-8 h-8 rounded-full"
              src={userDetails?.profilePicture}
              alt=""
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center text-lg font-bold">
              {userDetails?.name?.slice(0, 2).toUpperCase()}
            </div>
          )}

          <h4 className="text-white">{userDetails?.name}</h4>
        </div>

        <img src={NotificationWithoutIndicator} alt="" />
      </div>
    </div>
  );
};

export default Navbar;
