import { use } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const UserDetailsPage = ({ setUserDetailShow }) => {
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
          <h2 className="text-lg font-bold">User Details</h2>
          <button
            className="bg-white text-[#c61d23] px-3 py-1 text-sm font-medium rounded hover:bg-black hover:text-white transition"
            onClick={() => setUserDetailShow(false)}
          >
            Close
          </button>
        </div>
        <div className="p-6 text-black">
          {userDetails ? (
            <div className="space-y-4">
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">Student ID:</span>
                <span>{userDetails.StudentsId || "N/A"}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">Name:</span>
                <span>{userDetails.name || "N/A"}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">Admit Card:</span>
                {userDetails.admitCard ? (
                  <a
                    href={userDetails.admitCard} // Link to the PDF
                    download="AdmitCard.pdf" // Suggest a default filename
                    target="_blank" // Open in a new tab
                    rel="noopener noreferrer" // Security best practice
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    style={{ backgroundColor: "#c61d23" }}
                  >
                    Download Your Admit Card
                  </a>
                ) : (
                  <span>N/A</span>
                )}
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">Email:</span>
                <span>{userDetails.email || "N/A"}</span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">Payment ID:</span>
                <span>{userDetails.paymentId || "N/A"}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">Phone:</span>
                <span>{userDetails.phone || "N/A"}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">Result:</span>

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
                ) : (
                  <span>N/A</span>
                )}
                {/* <span>{userDetails.result || "N/A"}</span> */}
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500">
              No user details available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetailsPage;
