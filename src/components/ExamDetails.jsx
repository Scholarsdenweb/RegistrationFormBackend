import axios from "../api/axios";
import tickCircle from "../assets/tickCircle.png";
import { useEffect, useState } from "react";

const ExamDetails = () => {
  const [examData, setExamData] = useState({
      name: "",
      date: "",
    });
    const [paymentStatus, getPaymentStatus] = useState({
        transaction_id : "",
payment_status : "",
payment_method : "",
amount : "",
payment_date : "",
    })
  const fetchExamDetails = async () => {
    const response = await axios.get("/form/getExamDetails");

    console.log("response", response);
    setExamData({
        name: response.data.name,
        date: response.data.date,
    })
  };

  

  const fetchPaymentStatus = async () => {
    try {
      const response = await axios.get("/form/payment/getForm");
      console.log("Response2", response);
    } catch (error) {
      console.error("Error fetching payment status:", error);
    }
  };

  useEffect(() => {
    fetchExamDetails();
    fetchPaymentStatus()
  }, []);

  return (
    <div className="flex flex-col text-xl h-screen ">
      <div className="p-9 w-full">
        <h4>
          <strong>Payment Status : </strong>{" "}
        </h4>
        <h4>
          <strong>Exam Name : </strong>{`${examData && examData?.name}`}
        </h4>
        <h4>
          <strong>Exam Date : </strong>{`${examData && examData?.date}`}
        </h4> 
      </div>
      <div className="flex flex-col justify-center items-center shadow-lg p-6 rounded-lg">
       Admit Card is Processing
      </div>
    </div>
  );
};
export default ExamDetails;
