import React from "react";
import DashboardSidebar from "./DashboardSidebar";

const ResultPage = () => {
const resultDetails = async()=>{
    const response = await axios.get("/students/getResult");
    console.log("response of resultDetails", response);
    


}

  return (
    <div className="grid grid-cols-12 ">

      <div className="col-span-2">
        <DashboardSidebar/>
      </div>
      <div className="col-span-10 flex flex-col justify-center items-center shadow-lg p-6 rounded-lg">
        
        Result
      </div>
    </div>
  );
};

export default ResultPage;
