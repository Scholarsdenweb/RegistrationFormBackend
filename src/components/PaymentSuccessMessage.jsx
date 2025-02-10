import { useNavigate, useParams } from "react-router-dom";
import tickCircle from "../assets/tickCircle.png";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDetails } from "../redux/slices/userDeailsSlice";

const PaymentSuccessMessage = () => {
  const { paymentId } = useParams();
  const navigate = useNavigate();
  const [admitCardStatus, setAdmitCardStatus] = useState("Pending");
  const { userData } = useSelector((state) => state.userDetails);

  const dispatch = useDispatch();

  const generateAdmitCard = async () => {
    try {
      const response = await axios.post("/payment/generateAdmitCard");
      console.log("response from generateAdmitCard", response);
      setAdmitCardStatus("Generated");
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    generateAdmitCard();

    const addPaymentId = async () => {


      console.log("ADD payment Id function is running now");
      try {
        const response = await axios.patch("/students/editStudent", {
          paymentId,
        });
        console.log("response from paymentId", response);
      } catch (error) {
        console.log("error", error);
      }
    };

    addPaymentId();

    dispatch(fetchUserDetails());
  }, []);
 
  return (

      <div className="flex flex-col justify-center items-center shadow-lg p-6 rounded-lg">
        <img src={tickCircle} alt="" />
        <div className="text-2xl p-10">
          {` Your Payment is Successfull. Order ID : ${paymentId ? paymentId : userData.paymentId}`}
        </div>
        <span>Wait for a minute. Admit Card will be generated soon</span>
        <span>Thank you for your payment.</span>
      </div>
 
  );
};
export default PaymentSuccessMessage;
