import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBatchDetails,
  updateBatchDetails,
} from "../../redux/slices/batchDetailsSlice"; // Adjust the path as necessary
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import Spinner from "../../api/Spinner";

const BatchRelatedDetailsForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathLocation = location.pathname;
  const dispatch = useDispatch();

  const { formData, dataExist, loading, error } = useSelector(
    (state) => state.batchDetails
  );

  const [submitMessage, setSubmitMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [checkUrl, setCheckUrl] = useState("");

  useEffect(() => {
    dispatch(fetchBatchDetails());
    setCheckUrl(pathLocation === "/batchDetailsForm");
  }, [dispatch, pathLocation]);

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      if (!(key === "subjectCombination" && formData.classForAdmission <= 10)) {
        if (!formData[key]?.toString().trim()) {
          formErrors[key] = `${key.replace(/([A-Z])/g, " $1")} is required`;
          isValid = false;
        }
      }
    });

    setErrors(formErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateBatchDetails({ [name]: value }));

    if (value.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const url = dataExist
          ? "/form/batchRelatedDetails/updateForm"
          : "/form/batchRelatedDetails/addForm";
        const method = dataExist ? axios.patch : axios.post;

        await method(url, formData);

        setSubmitMessage(
          dataExist
            ? "Batch related details updated successfully!"
            : "Batch related details submitted successfully!"
        );

        if (checkUrl) {
          navigate("/familyDetailsForm");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        setSubmitMessage("Error submitting form. Please try again.");
      }
    }
  };

  const convertToNumber = (romanNumeral) => {
    const romanToNumber = {
      VI: 6,
      VII: 7,
      VIII: 8,
      IX: 9,
      X: 10,
      XI: 11,
      XII: 12,
    };

    return romanToNumber[romanNumeral];
  };

  // Options for select dropdowns
  const batchOptions =
    formData.classForAdmission <= 10
      ? [ "13/01/2025", "24/01/2025", "25/01/2025"]
      : [ "17/01/2025", "28/01/2025", "29/01/2025"];

  let subjectOptions =
    convertToNumber(formData.classForAdmission) >= 6 &&
    convertToNumber(formData.classForAdmission) <= 10
      ? ["Foundation"]
      : ["Engineering", "Medical"];
  const convertToRoman = (num) => {
    const romanNumerals = {
      6: "VI",
      7: "VII",
      8: "VIII",
      9: "IX",
      10: "X",
      11: "XI",
      12: "XII",
    };
    return romanNumerals[num];
  };

  // Fetch initial form data
  useEffect(() => {
    dispatch(fetchBatchDetails());
    setCheckUrl(pathLocation === "/batchDetailsForm");
  }, []);

  // Validate form fields

  useEffect(() => {
    console.log("formData", formData);
  }, [formData]);

  // Handle form submission
  return (
    <div
      className={`${
        pathLocation === "/batchDetailsForm" && "min-h-screen"
      } flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50`}
    >
      {loading ? (
        <Spinner />
      ) : (
        <form
          className="w-full max-w-lg bg-white shadow-lg rounded-lg p-4 space-y-6"
          onSubmit={onSubmit}
        >
          <h1 className="text-2xl font-bold text-center " style={{ color: "#c61d23" }} >
            Batch Related Details Form
          </h1>

          {/* Class  for admission*/}
          <div className="flex flex-col">
            <label
              htmlFor="classForAdmission"
              className="text-sm font-medium text-gray-600 mb-1"
            >
              Class
            </label>
            <select
              id="classForAdmission"
              name="classForAdmission"
              value={formData?.classForAdmission || ""}
              onChange={handleChange}
              placeholder="Select Class for adminssion"
              className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            >
              <option className="" disabled value="">
                Select Class for admission
              </option>
              {Array.from({ length: 7 }, (_, i) => i + 6).map((classNum) => (
                <option key={classNum} value={convertToRoman(classNum)}>
                  {convertToRoman(classNum)}
                </option>
              ))}
            </select>
            {errors.classForAdmission && (
              <p className="text-red-500 text-xs mt-1">
                {errors.classForAdmission}
              </p>
            )}
          </div>

          {/* Preferred Batch */}
          <div className="flex flex-col">
            <label
              htmlFor="preferredBatch"
              className="text-sm font-medium text-gray-600 mb-1"
            >
              Preferred Batch
            </label>
            <select
              id="preferredBatch"
              name="preferredBatch"
              value={formData.preferredBatch || ""}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            >
              <option disabled value="">
                Select Preferred Batch
              </option>
              {batchOptions.map((batch, index) => (
                <option key={index} value={batch}>
                  {batch}
                </option>
              ))}
            </select>
            {errors.preferredBatch && (
              <p className="text-red-500 text-xs mt-1">
                {errors.preferredBatch}
              </p>
            )}
          </div>

          {/* Subject Combination */}
          {
            <div className="flex flex-col">
              <label
                htmlFor="subjectCombination"
                className="text-sm font-medium text-gray-600 mb-1"
              >
                Subject Combination
              </label>
              <select
                id="subjectCombination"
                name="subjectCombination"
                value={formData.subjectCombination || ""}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              >
                <option disabled value="">
                  Select Subject Combination
                </option>
                {console.log("subjectOptions", subjectOptions)}

                {subjectOptions &&
                  subjectOptions.map((subject, index) => (
                    <option key={index} value={subject}>
                      {subject}
                    </option>
                  ))}
              </select>
              {errors.subjectCombination && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.subjectCombination}
                </p>
              )}
            </div>
          }

          {/* Submit and Previous Buttons */}
          <div className="flex justify-between items-center">
            {pathLocation === "/batchDetailsForm" && (
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-1/3 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg transition duration-200"
              >
                Previous
              </button>
            )}
            <button
              type="submit"
              className={` ${
                pathLocation === "/batchDetailsForm" ? "w-2/3" : "w-full"
              }  hover:bg-indigo-600 text-white font-semibold py-2 rounded-lg transition duration-200 ml-2`}

              style={{ backgroundColor: "#c61d23" }}
            >
              {checkUrl ? "Next" : "Update"}
            </button>
          </div>

          {/* Submit Message */}
          {submitMessage && (
            <p
              className={`text-sm text-center mt-4 ${
                submitMessage === "Batch related details updated successfully!"
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {submitMessage}
            </p>
          )}
        </form>
      )}
    </div>
  );
};

export default BatchRelatedDetailsForm;
