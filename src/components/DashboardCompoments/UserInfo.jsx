import React, { useEffect } from "react";
import { use } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDetails } from "../../redux/slices/userDeailsSlice";
import { fetchBatchDetails } from "../../redux/slices/batchDetailsSlice";
import { fetchBasicDetails } from "../../redux/slices/basicDetailsSlice";

const UserInfo = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.userDetails);
  const { formData: batchDetails } = useSelector((state) => state.batchDetails);
  const { data: basicDetails } = useSelector((state) => state.basicDetails);
  const todaysDate = new Date().toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
});


  useEffect(() => {
    dispatch(fetchUserDetails());
    dispatch(fetchBatchDetails());
    dispatch(fetchBasicDetails());
  }, [dispatch]);

  return (
    <div className="bg-white h-full shadow-lg rounded-lg">
      <div className="p-7">{todaysDate}</div>
      <div className="p-7">
        <h2 className="text-4xl mb-1 " style={{ color: "#c61d23" }}>
          Hello {userData.name}!
        </h2>
        <span className="text-gray-500">
          Welcome to your ScholarsDen student portal, you can check / edit your
          details here!{" "}
        </span>
      </div>

      <div className="p-7 text-gray-500">
        <span>Class : {batchDetails?.classForAdmission} </span>
        <br />
        <span>Duration : {batchDetails?.sectionForAdmission} </span>
        <br />
        <span>Scholarship : {basicDetails?.examName} </span>
      </div>
    </div>
  );
};

export default UserInfo;
