import React, { useEffect } from "react";
import Navbar from "./Form/Navbar";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDetails } from "../redux/slices/userDeailsSlice";

const Result = () => {
  const dispatch = useDispatch();

  const { userDetails } = useSelector((state) => state.userDetails);

  useEffect(() => {
    dispatch(fetchUserDetails());
    console.log("userDetails", userDetails);
  }, []);
  useEffect(() => {
    dispatch(fetchUserDetails());
    console.log("userDetails", userDetails);
  }, [userDetails]);

  return (
    <div
      className=" overflow-auto w-full h-screen"
      style={{ backgroundColor: "#c61d23" }}
    >
      <div className="grid grid-cols-7 h-full">
        <div className="col-span-1">
          <Sidebar />
        </div>

        <div className="flex flex-col col-span-6 h-full ">
          {/* <div className=" pr-8 flex gap-12 justify-between items-center"> */}
          <Navbar />

          {/* </div> */}

          <div className="col-span-6 px-9 py-8 mb-3 mr-5 h-full bg-gray-100 rounded-3xl flex flex-col items-end gap-4 overflow-auto">
            <div className="flex justify-center items-center bg-white w-full h-full rounded-lg">
              {userDetails?.result ? (
                <a
                  href={userDetails?.result}
                  download="ReportCard.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  style={{ backgroundColor: "#c61d23" }}
                >
                  Download Your Report Card
                </a>
              )
              :
              (
                <p className="text-center text-gray-500">No Result Available</p>
              )
            
            
            }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;
