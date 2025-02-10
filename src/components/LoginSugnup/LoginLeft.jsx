import { useState } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import ScholarsDenLogo from "../../assets/scholarsDenLogo.png";
import Spinner from "../../api/Spinner"; // Adjust the path as needed
import { setLoading } from "../../redux/slices/loadingSlice";
import { useDispatch } from "react-redux";
import ErrorMessage from "../ErrorMessage";

export default function LoginRight() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [showErrorMessage, setShowErrorMessage] = useState(false);

  
  const [submitMessage, setSubmitMessage] = useState("");
  // const [loading, setLoading] = useState(false);

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

    if (!formData.email) {
      formErrors.email = "Email is required";
      isValid = false;
    }

    if (!formData.password) {
      formErrors.password = "Password is required";
      isValid = false;
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      formErrors.email = "Email must be a valid email address";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const onSubmit = async (e) => {

    // dispatch(setLoading(true));
    e.preventDefault();
    if (validateForm()) {
      // setLoading(true);
      try {
        const response = await axios.post("/auth/student_login", formData);
        setSubmitMessage("Login successful!");
        login();
        document.cookie = `token=${response.data.token}`;
        navigate("/dashboard");
      } catch (error) {
                // dispatch(setLoading(false));

        setSubmitMessage(error?.response?.data || "An error occurred");
        setShowErrorMessage(true);

        console.log("Error logging in", error.response.data);
      } finally {
        // dispatch(setLoading(false));

      }
    }
  };

  return (
    <div className="relative">
      
      <form
        className="flex flex-col gap-6 py-10 pl-20 text-white w-3/4"
        onSubmit={onSubmit}
      >
        <img className="w-16 h-16" src={ScholarsDenLogo} alt="" />

        <div>
          <h2 className="text-3xl font-bold text-white ">Login</h2>
          <p className="text-gray-300">Enter your Login Details</p>
        </div>

        <div className="flex flex-col items-start">
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="border-b-2 py-2 focus:outline-none w-full"
            style={{ backgroundColor: "#c61d23" }}
          />
          {errors.email && (
            <p className="text-white text-sm">{errors.email}</p>
          )}
        </div>

        <div className="flex flex-col items-start">
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="border-b-2 border-gray-300 py-2 focus:outline-none w-full"
            style={{ backgroundColor: "#c61d23" }}
          />
          {errors.password && (
            <p className="text-white text-sm">{errors.password}</p>
          )}
        </div>

        {submitMessage && (
          <p
            className={`text-center text-sm ${
              submitMessage.includes("Login successful!")
                ? "text-green-500"
                : "text-white"
            }`}
          >
            {console.log("Submitmessage running")}
            {submitMessage}
          </p>
        )}
        <button
          className="text-start text-gray-300 hover:underline my-2"
          onClick={() => navigate("/forgetPassword")}
          type="button"
        >
          Forgot Password
        </button>
        <button
          type="submit"
          className="w-full py-2 border-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-all"
          style={{ backgroundColor: "#c61d23" }}
        >
          Login
        </button>

        <div className="text-gray-300 mt-20 flex justify-between items-center">
          <p className="text-sm ">Don't have an account? </p>

          <button
            className="border-2 rounded-full py-2 px-5 font-medium hover:underline"
            onClick={() => navigate("/signup")}
            type="button"
          >
            Sign up
          </button>
        </div>
      </form>

      {/* {showErrorMessage && <ErrorMessage message={submitMessage} closeErrorPopup={setShowErrorMessage} /> }  */}

    </div>
  );
}
