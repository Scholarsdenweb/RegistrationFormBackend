import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../api/axios";

export default function ResetPassword() {
  const { token } = useParams(); // Extract token from URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [submitMessage, setSubmitMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const formErrors = {};
    let isValid = true;

    if (!formData.password) {
      formErrors.password = "Password is required";
      isValid = false;
    }

    // if (formData.password && formData.password.length < 8) {
    //   formErrors.password = "Password must be at least 8 characters long";
    //   isValid = false;
    // }

    if (formData.password !== formData.confirmPassword) {
      formErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("formData", formData);
      try {
        const response = await axios.post(`/auth/reset-password/${token}`, {
          newPassword: formData.password,
        });
        setSubmitMessage("Password reset successful!");
        setTimeout(() => navigate("/"), 3000); // Redirect to login after success
      } catch (error) {
        console.error("Error resetting password", error);
        setSubmitMessage("Error resetting password. Please try again.");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 w-1/2 max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg justify-center border border-gray-200"
    >
      <h2 className="text-2xl font-bold text-center"
      style={{ color: "#c61d23" }}
      >
        Reset Password
      </h2>

      <div className="flex flex-col items-start">
        <label htmlFor="password" className="text-gray-600">
          New Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter new password"
          className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password}</p>
        )}
      </div>

      <div className="flex flex-col items-start">
        <label htmlFor="confirmPassword" className="text-gray-600">
          Confirm Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm new password"
          className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
        )}
      </div>

      {submitMessage && (
        <p
          className={`text-center text-sm ${
            submitMessage.includes("successful")
              ? "text-green-500"
              : "text-red-500"
          }`}
        >
          {submitMessage}
        </p>
      )}

      <button
        type="submit"
        className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all"
        style={{
          backgroundColor: "#c61d23",}}
      >
        Reset Password
      </button>
    </form>
  );
}
