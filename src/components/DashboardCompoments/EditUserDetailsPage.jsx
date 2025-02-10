import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { submitUserDetails } from "../../redux/slices/userDeailsSlice";

const EditUserDetailsPage = ({ setEditUserDetailsShow }) => {
  const { userData: userDetails } = useSelector((state) => state.userDetails);

  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: userDetails?.name || "",
    email: userDetails?.email || "",
    profilePicture: userDetails?.profilePicture || null,
  });

  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "ProfilePictures");
        formData.append("cloud_name", "dtytgoj3f");

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/dtytgoj3f/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        console.log("response", response);

        const data = await response.json();
        console.log("data", data);
        if (data.secure_url) {
          setFormData((prev) => ({
            ...prev,
            profilePicture: data.secure_url,
          }));
        }
      } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(formData);
    }
    setEditUserDetailsShow(false);
  };

  const handleClose = () => {
    setEditUserDetailsShow(false);
  };

  const onSave = (formData) => {
    console.log("formData from onSave", formData);
    dispatch(submitUserDetails(formData));
  };

  const getInitials = (name) => {
    if (!name) return "NA";
    return name
      .trim()
      .split(/\s+/)
      .filter((part, index) => index === 0)
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-sm overflow-hidden">
      <div className="relative flex flex-col overflow-auto bg-white rounded-lg w-full max-w-lg">
        {/* Header */}
        <div className="flex justify-between items-center bg-[#c61d23] text-white px-6 py-3">
          <h2 className="text-lg font-bold">Edit User Details</h2>
          <button
            className="bg-white text-[#c61d23] px-3 py-1 text-sm font-medium rounded hover:bg-black hover:text-white transition"
            onClick={handleClose}
          >
            Close
          </button>
        </div>

        {/* Form */}
        <div className="p-6 text-black">
          <form className="space-y-4">
            <div className="flex flex-wrap justify-between items-center">
              <label className="font-semibold w-1/3">Profile Picture:</label>
              <div className="w-2/3 flex items-center space-x-4">
                {formData.profilePicture ? (
                  <img
                    src={
                      typeof formData.profilePicture === "string"
                        ? formData.profilePicture
                        : URL.createObjectURL(formData.profilePicture)
                    }
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 p-4 rounded-full flex items-center justify-center text-black border-2 border-[#c61d23] font-bold text-xl bg-gray-100">
                    {getInitials(formData.name || "NA")}
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="text-sm w-2/3"
                  disabled={uploading}
                />
                {uploading && (
                  <p className="text-xs text-gray-500">Uploading...</p>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <label className="font-semibold w-1/3">Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-2/3 p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="flex justify-between items-center">
              <label className="font-semibold w-1/3">Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-2/3 p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="flex justify-between items-center">
              <label className="font-semibold w-1/3">Phone:</label>
              <input
                type="text"
                value={userDetails?.phone || ""}
                readOnly
                className="w-2/3 p-2 border border-gray-300 rounded bg-gray-100"
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 bg-gray-100">
          <button
            className="bg-[#c61d23] text-white px-4 py-2 rounded hover:bg-red-700 transition"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserDetailsPage;
