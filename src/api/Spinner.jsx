import React from "react";
import { useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";

const Spinner = () => {
  let [loading, setLoading] = useState(true);
  let [color, setColor] = useState("#ffffff");
  return (
    <div
      className="absolute top-0 right-0 left-0 bottom-0 flex justify-center items-center h-full w-full bg-black bg-opacity-50 backdrop-blur-sm"
    >
      <BeatLoader
        color="#c61d23"
        loading
        margin={8}
        size={18}
        speedMultiplier={1}
      />
    </div>
  );
};

export default Spinner;
