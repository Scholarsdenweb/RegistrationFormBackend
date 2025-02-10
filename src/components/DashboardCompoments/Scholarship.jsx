import React, { useState } from "react";
import Scholarsship from "../../assets/Scholarsship.png";
import ScholarshipDetails from "../ScholarshipDetails";


const Scholarship = () => {
  const [viewScholarship, setViewScholarship] = useState(false);
  return (
    <div className="flex justify-between h-4/5 w-full bg-white  rounded-xl">
      <div className="h-full p-7">
        <h3 className="text-2xl font-bold mb-4">
          SDAT<br className="p-0"/>
          Scholarsship
        </h3>
        <button className="py-2 px-10 text-white font-semibold rounded-full " onClick={()=>setViewScholarship(true) } style={{ backgroundColor: "#c61d23" }}>View</button>
      </div>
      <div className="flex justify-end items-center p-7">
        <img className="w-24 h-24" src={Scholarsship} alt="" />
      </div>
      {viewScholarship && <ScholarshipDetails setViewScholarship={setViewScholarship} />}
    </div>
  );
};

export default Scholarship;
