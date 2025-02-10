import React from "react";
import { useNavigate } from "react-router-dom";

const AllFormNotAvailable = ({
  setAllFormNotAvailable,
  familyDetailsDataExist,
  educationalDetailsDataExist,
  batchDetailsDataExist,
  basicDetailsDataExist,
}) => {
  const navigate = useNavigate();

    const clickHandler = async () => {
    if (!familyDetailsDataExist || !educationalDetailsDataExist) {
      navigate("/registration/educationalDetailsForm");
    }else{
      navigate("/registration/basicDetailsForm");
    }
  };

  return (
    <div className="absolute z-50 top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative flex flex-col w-3/4 max-w-2xl bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex justify-between items-center bg-[#c61d23] text-white px-6 py-4">
          <h2 className="text-lg font-bold">Form Status</h2>
          <button
            className="bg-white text-[#c61d23] px-3 py-1 text-sm font-medium rounded hover:bg-black hover:text-white transition"
            onClick={() => setAllFormNotAvailable(false)}
          >
            Close
          </button>
        </div>
        <div className="p-6 text-black flex flex-col justify-center items-center gap-1">
          <p className="text-center text-gray-500 ">
            {!familyDetailsDataExist && (
              <h2>Family Details From Not Available</h2>
            )}
          </p>
          <p className="text-center text-gray-500 ">
            {!educationalDetailsDataExist && (
              <h2>Educational Details From Not Available</h2>
            )}
          </p>
          <p className="text-center text-gray-500 ">
            {!basicDetailsDataExist && (
              <h2>Basic Details From Not Available</h2>
            )}
          </p>
          <p className="text-center text-gray-500 ">
            {!batchDetailsDataExist && (
              <h2>Batch Details From Not Available</h2>
            )}
          </p>

            <button
              className="bg-[#c61d23] text-white px-3 py-1 text-sm font-medium rounded hover:bg-black hover:text-white transition"
              onClick={clickHandler}
            >
              Fill Your Form
            </button>
        
        </div>
      </div>
    </div>
  );
};

export default AllFormNotAvailable;
