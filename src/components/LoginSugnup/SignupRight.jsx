import { useState } from "react";
import axios from "../../api/axios";
import { useNavigate, Link } from "react-router-dom";
import Spinner from "../../api/Spinner";
import ScholarsDenLogo from "../../assets/scholarsDenLogo.png";

export default function SignupRight() {
  const navigate = useNavigate();

  // Regex pattern for phone number validation (+91 followed by 10 digits)
  const phoneRegex = /^\+91[0-9]{10}$/;
  const [codeVerified, setCodeVerified] = useState(true);
  const [loading, setLoading] = useState(false);
  // const [codeVerified, setCodeVerified] = useState(false);

  // State hooks
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [showCodeBox, setShowCodeBox] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: value ? "" : `${name} is required`,
    }));
  };

  const validateForm = () => {
    const formErrors = {};
    let isValid = true;

    // Field validation
    ["name", "email", "phone", "password"].forEach((field) => {
      if (!formData[field]) {
        formErrors[field] = `${field} is required`;
        isValid = false;
      }
    });

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      formErrors.email = "Email must be valid";
      isValid = false;
    }

    if (!phoneRegex.test(`+91${formData.phone}`)) {
      formErrors.phone = "Phone must be a valid 10-digit number";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitMessage("");
    console.log("Button Clicked");
    if (codeVerified === false) {
      setSubmitMessage("Please Verify Your Phone Number");
    }

    if (validateForm() && codeVerified) {
      try {
        const response = await axios.post("/auth/student_signup", formData);
        setSubmitMessage("Form submitted successfully!");
        document.cookie = `token=${response.data.token}`;
        navigate("/registration/basicDetailsForm");
      } catch (error) {
        console.log("Error submitting form 2", error.response.data);
        setSubmitMessage(error.response.data);

        console.error("Error submitting form", error);
      }
    }
  };

  const verifyPhoneNo = async () => {
    setLoading(true);

    try {
      setShowCodeBox(true);

      // const response = await axios.post("/students/sendVerification", {
      //   mobileNumber: `${formData.phone}`,
      // });
      // if (response.status === 200) {
      //   setShowCodeBox(true);
      // }
    } catch (error) {
      setSubmitMessage("Error verifying phone number");
    } finally {
      setLoading(false);
    }
  };

  const checkVerificationCode = async () => {
    try {
      // const response = await axios.post("/students/verifyNumber", {
      //   mobileNumber: `${formData.phone}`,
      //   otp: code,
      // });
      // if (response.status === 200) {
      //   setSubmitMessage("Phone number verified successfully!");
      //   setCodeVerified(true);
      //   setShowCodeBox(false);
      // }
      setCodeVerified(true);
        setShowCodeBox(false);
    } catch (error) {
      setSubmitMessage("Error verifying phone number");
    }
  };

  return (
    // <div className="flex">
    //   {loading && <Spinner />}

    <form
      className="flex flex-col gap-3 py-2 pl-20 text-white w-3/4 "
      onSubmit={onSubmit}
    >
      <img className="w-16 h-16" src={ScholarsDenLogo} alt="" />
      <div>
        <h2 className="text-3xl font-bold text-white ">Signup</h2>
        <p className="text-gray-300">Create your account</p>
      </div>

      {/* Name Field */}
      <div className="flex flex-col items-start">
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          className="border-b-2  py-2 focus:outline-none w-full"
          style={{ backgroundColor: "#c61d23" }}
        />
        {errors.name && (
          <p className="text-white text-xs">{errors.name}</p>
        )}
      </div>

      {/* Email Field */}
      <div className="flex flex-col">
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="border-b-2  py-2 focus:outline-none w-full"
          style={{ backgroundColor: "#c61d23" }}
        />
        {errors.email && (
          <p className="text-white text-xs mt-1">{errors.email}</p>
        )}
      </div>

      {/* Phone Field */}
      <div className="flex gap-3 items-start">
        <div className="flex-1 flex flex-col">
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="border-b-2  py-2 focus:outline-none w-full"
            style={{ backgroundColor: "#c61d23" }}
          />
          {errors.phone && (
            <p className="text-white text-xs mt-1">{errors.phone}</p>
          )}
        </div>
      </div>

      {/* Password Field */}
      <div className="flex flex-col">
        <div
          className={`flex ${
            showCodeBox ? "flex-col" : "flex-row"
          } ${showCodeBox ? "justify-between": "" } gap-1`}
        >
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="border-b-2 py-2 focus:outline-none w-2/3 "
            style={{ backgroundColor: "#c61d23" }}
          />
          <div className="">
            {showCodeBox && (
              <div className="absolute flex top-0 bottom-0 left-0 right-0 w-full h-screen justify-center items-center gap-2 py-3 backdrop-blur-sm bg-black bg-opacity-10 ">
                <div className="flex flex-col gap-2 justify-between rounded-xl w-1/3 p-5 bg-white shadow-2xl">
                  <div className="flex justify-end">
                    <button
                      className="text-2xl text-black rounded-full border-4 px-2"
                      onClick={() => setShowCodeBox(false)}
                    >
                      X
                    </button>
                  </div>

                  <input
                    type="text"
                    id="code"
                    name="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter code"
                    className="border-b-2  py-2 focus:outline-none "
                    // style={{ backgroundColor: "#c61d23" }}
                  />
                  <button
                    type="button"
                    onClick={checkVerificationCode}
                    className="px-4 py-2 border-2 text-white bg-blue-500 hover:bg-blue-600 rounded-full"
                    style={{ backgroundColor: "#c61d23" }}
                  >
                    Verify
                  </button>
                </div>
              </div>
            )}
            {!showCodeBox && !codeVerified && (
              <div className="flex">
                <button
                  type="button"
                  onClick={verifyPhoneNo}
                  className="px-4 py-2 border-2 text-white bg-blue-500 hover:bg-blue-600 rounded-full"
                  style={{ backgroundColor: "#c61d23" }}
                >
                  Send Code
                </button>
              </div>
            )}

          </div>
        </div>
            {errors.password && (
              <p className="text-white text-xs">{errors.password}</p>
            )}
      </div>

      {/* Submit Message */}
      {submitMessage && (
        <p
          className={`text-sm text-center ${
            submitMessage.includes("successfully")
              ? "text-green-500"
              : "text-red-500"
          }`}
        >
          {submitMessage}
        </p>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-2 border-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-all mt-3"
        style={{ backgroundColor: "#c61d23" }}
      >
        Sign Up
      </button>

      {/* Login Link */}
      <div className="text-gray-300 mt-20 flex justify-between items-center">
        <p className="text-sm">Already have an account?</p>
        <Link
          to="/"
          className=" border-2 rounded-full py-2 px-5 font-medium hover:underline"
        >
          Log in
        </Link>
      </div>
    </form>
    // </div>
  );
}
