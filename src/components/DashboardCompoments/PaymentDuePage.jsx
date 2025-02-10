import { useEffect } from "react";
import { useSelector } from "react-redux";
const PaymentDuePage = ({ setPaymentDueShow }) => {
  console.log("UserDetailsPage is running");

  const { userData: userDetails } = useSelector((state) => state.userDetails);

  useEffect(() => {
    console.log("UserDetailsPage is running");
    console.log("userDetails", userDetails);
  }, []);

  useEffect(() => {
    console.log("UserDetailsPage userDetails is running");
    console.log("userDetails", userDetails);
  }, [userDetails]);

  return (
    <div className="absolute z-50 top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative flex flex-col w-3/4 max-w-2xl bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex justify-between items-center bg-[#c61d23] text-white px-6 py-4">
          <h2 className="text-lg font-bold">Payment Due</h2>
          <button
            className="bg-white text-[#c61d23] px-3 py-1 text-sm font-medium rounded hover:bg-black hover:text-white transition"
            onClick={() => setPaymentDueShow(false)}
          >
            Close
          </button>
        </div>
        <div className="p-6 text-black">
         
            <p className="text-center text-gray-500">
              No Payment details available.
            </p>
          
        </div>
      </div>
    </div>
  );
};

export default PaymentDuePage;
