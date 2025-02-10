import Right from "./Right";
import LoginRight from "./LoginLeft";
import { useDispatch, useSelector } from "react-redux";

import scholarsDenLogo from "../../assets/scholarsDenLogo.png";
import SdenLogo from "../SdenLogo";
import Spinner from "../../api/Spinner";
import { useEffect } from "react";
import { setLoading } from "../../redux/slices/loadingSlice";

const Login = () => {
  const { loading } = useSelector((state) => state.loadingDetails);
  const dispatch = useDispatch();
  // console.log("loading", loading)
  useEffect(()=>{
   dispatch(setLoading(false)); 
  }, [])
  return loading ? (
    <Spinner />
  ) : (
    <div
      className="grid grid-cols-12 justify-between items-center h-screen"
      style={{ backgroundColor: "#c61d23" }}
    >
      <div className="col-span-5 gap-3">
        <LoginRight />
      </div>
      <div className="col-span-7 flex justify-center p-6 w-full h-full">
        <Right />
      </div>
    </div>
  );
};

// {loading && (
//   <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
//     <Spinner />
//   </div>
// )}

export default Login;
