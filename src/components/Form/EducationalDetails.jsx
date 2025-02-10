import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import {
  fetchEducationalDetails,
  fetchBoards,
  updateEducationalDetails,
} from "../../redux/slices/educationalDetailsSlice";
import { fetchUserDetails } from "../../redux/slices/userDeailsSlice";
import Sidebar from "../Sidebar";
import Navbar from "./Navbar";
import {
  fetchFamilyDetails,
  submitFamilyDetails,
  updateFamilyDetails,
} from "../../redux/slices/familyDetailsSlice";

const EducationalDetailsForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const pathLocation = location.pathname;

  const [educationalErrors, setEducationalErrors] = useState({});
  const [familyErrors, setFamilyErrors] = useState({});
  const [educationalFormSubmit, setEducationalFormSubmit] = useState(false);
  const [familyFormSubmit, setFamilyFormSubmit] = useState(false);

  // Redux state selectors
  const {
    formData: educationalFormData,
    boards,
    loading,
    dataExist: educationalDataExist,
  } = useSelector((state) => state.educationalDetails);

  const { formData: familyFormData, dataExist: familyDataExist } = useSelector(
    (state) => state.familyDetails
  );

  const { userData } = useSelector((state) => state.userDetails);

  // Component state
  const [submitMessage, setSubmitMessage] = useState("");
  const [checkUrl, setCheckUrl] = useState(false);
  const [errors, setErrors] = useState({});

  const incomeRanges = [
    "Less than 1 Lakh",
    "1 Lakh - 5 Lakhs",
    "5 Lakhs - 10 Lakhs",
    "10 Lakhs - 20 Lakhs",
    "More than 20 Lakhs",
  ];

  const phoneRegex = /^[0-9]{10}$/;

  useEffect(() => {
    dispatch(fetchBoards());
    dispatch(fetchEducationalDetails());
    dispatch(fetchFamilyDetails());
    dispatch(fetchUserDetails());
    setCheckUrl(pathLocation === "/educationalDetailsForm");
  }, [dispatch, pathLocation]);

  useEffect(() => {
    dispatch(fetchBoards());
  }, []);

  useEffect(() => {
    console.log("borards", boards);
  }, [boards]);

  const handleChange = (e, updateAction, formData) => {
    const { name, value } = e.target;
    if (
      ["MotherContactNumber", "FatherContactNumber"].includes(name) &&
      value.length > 10
    ) {
      return;
    }

    dispatch(updateAction({ [name]: value }));
    if (value.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  // const validateForm = (formData, additionalValidations = {}) => {
  //   const formErrors = {};
  //   let isValid = true;

  //   Object.keys(formData).forEach((key) => {
  //     const value = formData[key]?.toString().trim();

  //     console.log("value", value);
  //     console.log("key", key);

  //     if (!value) {
  //       formErrors[key] = `${key.replace(/([A-Z])/g, " $1")} is required`;
  //       isValid = false;
  //     } else if (additionalValidations[key] && !additionalValidations[key](value)) {
  //       formErrors[key] = `${key.replace(/([A-Z])/g, " $1")} is invalid`;
  //       isValid = false;
  //     }
  //   });

  //   console.log("formErrors", formErrors);
  //   console.log("errors", errors);

  //   setErrors(()=>formErrors);
  //   return isValid;
  // };

  const validateForm = (
    formData,
    setErrorState,
    additionalValidations = {}
  ) => {
    const formErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      const value = formData[key]?.toString().trim();

      if (!value) {
        formErrors[key] = `${key.replace(/([A-Z])/g, " $1")} is required`;
        isValid = false;
      } else if (
        additionalValidations[key] &&
        !additionalValidations[key](value)
      ) {
        formErrors[key] = `${key.replace(/([A-Z])/g, " $1")} is invalid`;
        isValid = false;
      }
    });

    setErrorState(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isEducationalValid = validateForm(
      educationalFormData,
      setEducationalErrors
    );
    const isFamilyValid = validateForm(familyFormData, setFamilyErrors, {
      FatherContactNumber: (value) => phoneRegex.test(value),
      MotherContactNumber: (value) => phoneRegex.test(value),
    });

    if (isEducationalValid) {
      try {
        const url = educationalDataExist
          ? "/form/educationalDetails/updateForm"
          : "/form/educationalDetails/addForm";
        const method = educationalDataExist ? axios.patch : axios.post;

        await method(url, educationalFormData);

        setSubmitMessage(
          educationalDataExist
            ? "Educational details updated successfully!"
            : "Educational details submitted successfully!"
        );

        setEducationalFormSubmit(true);
      } catch (error) {
        console.error("Error submitting form:", error);
        setSubmitMessage("Error submitting form. Please try again.");
      }
    }

    if (isFamilyValid) {
      console.log("familyFormData", familyFormData);
      dispatch(
        submitFamilyDetails({
          familyFormData,
          familyDataExist,
          setFamilyFormSubmit
        }
        )
      );

      //   // Family details submission logic
    }
    if(familyFormSubmit && educationalFormSubmit){
      navigate("/payment");
    }

  };

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

  const renderInputField = (
    key,
    value,
    handleChange,
    additionalProps = {},
    errorsState
  ) => {
    const isPercentage = key === "Percentage";

    return (
      <div className="flex flex-col w-1/2 px-2" key={key}>
        <label htmlFor={key} className="text-sm font-medium text-gray-600 mb-1">
          {key.replace(/([A-Z])/g, " $1")}
        </label>
        <input
          type={isPercentage ? "number" : "text"}
          id={key}
          name={key}
          value={value}
          onChange={handleChange}
          placeholder={`Enter ${key.replace(/([A-Z])/g, " $1")}`}
          className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none w-full"
          {...additionalProps}
        />
        {errorsState[key] && (
          <p className="text-red-500 text-xs mt-1">{errorsState[key]}</p>
        )}
      </div>
    );
  };

  const renderSelectField = (
    key,
    value,
    handleChange,
    options,
    errorsState
  ) => {
    return (
      <div className="flex flex-col w-1/2 px-2" key={key}>
        <label htmlFor={key} className="text-sm font-medium text-gray-600 mb-1">
          {console.log("key", key)}
          {key.replace(/([A-Z])/g, " $1")}
        </label>
        <select
          name={key}
          value={value}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none w-full"
        >
          <option value="" disabled >{`Select ${key.replace(/([A-Z])/g, " $1")}`}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {errorsState[key] && (
          <p className="text-red-500 text-xs mt-1">{errorsState[key]}</p>
        )}
      </div>
    );
  };

  return (
    <div
      className="w-full h-screen overflow-auto"
      style={{ backgroundColor: "#c61d23" }}
    >
      <div className="grid grid-cols-7">
        <Sidebar />
        <div className="flex flex-col col-span-6 h-screen overflow-auto">
          <Navbar />

          <div className="px-9 py-4 mb-3 mr-5 bg-gray-200 rounded-3xl  h-full overflow-auto">
            <h3 className="text-2xl font-extrabold">User Details</h3>

            <form
              className="bg-white shadow-lg p-4 rounded-2xl"
              onSubmit={handleSubmit}
            >
              <h1 className="text-xl font-bold text-white bg-red-600 p-2 rounded-t-2xl">
                Educational Details
              </h1>
              <div className="flex flex-wrap">
                {Object.keys(educationalFormData).map((key) =>
                  key === "Class" || key === "YearOfPassing" || key === "Board"
                    ? renderSelectField(
                        key,
                        educationalFormData[key],
                        (e) =>
                          handleChange(
                            e,
                            updateEducationalDetails,
                            educationalFormData
                          ),
                        key === "YearOfPassing"
                          ? [2024]
                          : key === "Class"
                          ? Array.from({ length: 7 }, (_, i) => i + 6).map(
                              (classNum) => convertToRoman(classNum)
                            )
                          : boards
                          ? boards.map((board) => board.name)
                          : [],
                        educationalErrors
                      )
                    : renderInputField(
                        key,
                        educationalFormData[key],
                        (e) =>
                          handleChange(
                            e,
                            updateEducationalDetails,
                            educationalFormData
                          ),
                        {},
                        educationalErrors
                      )
                )}
              </div>

              <h1 className="text-xl font-bold text-white bg-red-600 p-2 rounded-t-2xl mt-4">
                Family Details
              </h1>
              <div className="flex flex-wrap">
                {Object.keys(familyFormData).map((key) =>
                  key === "FamilyIncome"
                    ? renderSelectField(
                        key,
                        familyFormData[key],
                        (e) =>
                          handleChange(e, updateFamilyDetails, familyFormData),
                        incomeRanges,
                        familyErrors
                      )
                    : renderInputField(
                        key,
                        familyFormData[key],
                        (e) =>
                          handleChange(e, updateFamilyDetails, familyFormData),
                        {},
                        familyErrors
                      )
                )}
              </div>

              {submitMessage && (
                <p
                  className={`text-sm text-center mt-4 ${
                    submitMessage.includes("successfully")
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {submitMessage}
                </p>
              )}
            </form>
            <div className="flex justify-end mt-4">
              {pathLocation === "/batchDetailsForm" && (
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="w-1/3 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg"
                >
                  Previous
                </button>
              )}
              <button
                onClick={handleSubmit}
                className={` bg-red-600 hover:bg-red-700 text-white py-2 px-9 rounded-full`}
              >
                {checkUrl ? "Next" : "Update"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationalDetailsForm;
