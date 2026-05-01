import React, { useState } from "react";
import AuthLayout from "../../components/AuthLayout";
import { FaEyeSlash, FaPeopleGroup } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import ProfilePhotoSelector from "../../components/ProfilePhotoSelector";
import axiosInstance from "../../utils/axioInstance";
import uploadImage from "../../utils/uploadImage";

const SignUp = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [adminInviteToken, setAdminInviteToken] = useState("");
  const [showAdminInviteToken, setShowAdminInviteToken] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let profileImageUrl = "";

    if (!fullName) {
      setError("Please enter the name");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setError("Please enter the password");
      return;
    }

    setError(null);

    try {
      // Upload profile image
      if (profilePic) {
        const imageUploadRes = await uploadImage(profilePic);
        profileImageUrl = imageUploadRes.imageUrl || "";
      }

      // Signup API
     const response = await axiosInstance.post("/auth/sign-up", {
  name: fullName,
  email,
  password,
  profileImageUrl,
  adminJoinCode: adminInviteToken,
});

      if (response.data) {
        navigate("/login");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again!");
      }
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          
          <div className="h-2 bg-gradient-to-r from-blue-600 to-blue-400"></div>

          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center">
                <div className="bg-blue-100 p-3 rounded-full">
                  <FaPeopleGroup className="text-4xl text-blue-600" />
                </div>
              </div>

              <h1 className="text-2xl font-bold text-gray-800 mt-4 uppercase">
                Join Project Flow
              </h1>

              <p className="text-gray-600 mt-1">
                Start managing your projects efficiently
              </p>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-6">

              <ProfilePhotoSelector
                image={profilePic}
                setImage={setProfilePic}
              />

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>

                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                  placeholder="Your Full Name"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                  placeholder="your@email.com"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 pr-12"
                    placeholder="•••••••"
                    required
                  />

                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Admin Token (OPTIONAL) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Invite Token (Optional)
                </label>

                <div className="relative">
                  <input
                    type={showAdminInviteToken ? "text" : "password"}
                    value={adminInviteToken}
                    onChange={(e) => setAdminInviteToken(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 pr-12"
                    placeholder="Only needed for admin"
                  />

                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() =>
                      setShowAdminInviteToken(!showAdminInviteToken)
                    }
                  >
                    {showAdminInviteToken ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}

              {/* Button */}
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Sign Up
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center text-sm">
              <p>
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignUp;