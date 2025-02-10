import { useState } from "react";
import axios from "../api/axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setMessage("");
    setError("");
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    try {
      await axios.post("/auth/forget_password", { email });
      setMessage("Password reset link has been sent to your email.");
      setEmail("");
    } catch (err) {
      setError("Error sending password reset link. Please try again.");
      console.error("Forgot password error:", err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
        onSubmit={handleForgotPassword}
      >
        <h2
          className="text-2xl font-bold text-indigo-600 text-center mb-4"
          style={{ color: "#c61d23" }}
        >
          Forgot Password
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Enter your email address to receive a password reset link.
        </p>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-600 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter your email"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        {message && <p className="text-green-500 text-sm mb-4">{message}</p>}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all"
          style={{ backgroundColor: "#c61d23" }}
        >
          Send Reset Link
        </button>
      </form>
    </div>
  );
}
