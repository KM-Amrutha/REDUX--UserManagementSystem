import { useState } from "react";
import { axiosInstance } from "../redux/axiosInterceptor";
import { useNavigate } from "react-router-dom";
import "./Signup.css";
import {toast} from 'react-hot-toast'

const Signup = () => {
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    profileImage: null,
    profileImagePreview: null,
  });

  const [error, setError] = useState({});
  const navigate = useNavigate();

  const onChangeData = (field, value) => {
    setSignupData((prev) => ({ ...prev, [field]: value }));
    setError((prev) => ({ ...prev, [field]: "" }));
  };

  
  const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  const maxSizeMB = 2;

  if (!allowedTypes.includes(file.type)) {
    setError((prev) => ({ ...prev, profileImage: "Only JPG, PNG, or WEBP images are allowed" }));
    return;
  }

  if (file.size > maxSizeMB * 1024 * 1024) {
    setError((prev) => ({ ...prev, profileImage: `Image must be less than ${maxSizeMB}MB` }));
    return;
  }

  setSignupData((prev) => ({
    ...prev,
    profileImage: file,
    profileImagePreview: URL.createObjectURL(file),
  }));

  setError((prev) => ({ ...prev, profileImage: "" }));
};


  const validate = () => {
    const errors = {};
    const nameRegex = /^[A-Za-z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!signupData.name.trim()) errors.name = "Name is required";
    else if (!nameRegex.test(signupData.name)) errors.name = "Only letters and spaces allowed";

    if (!signupData.email.trim()) errors.email = "Email is required";
    else if (!emailRegex.test(signupData.email)) errors.email = "Invalid email format";

    if (!signupData.password.trim()) errors.password = "Password is required";
    else if (signupData.password.length < 6) errors.password = "Password must be 6+ characters";

    setError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (!signupData.profileImage) {
    setError((prev) => ({ ...prev, profileImage: "Please select a profile image" }));
    toast.error("Profile image is required");
    return;
  }

    try {
      const { name, email, password } = signupData;

     

      // 1. Signup API call
      const res = await axiosInstance.post("/user/signup", { name, email, password });
     
      const { _id, token } = res.data;

      if (_id && token) {
        // 2. Prepare FormData for image upload
        const formData = new FormData();
        formData.append("profileImage", signupData.profileImage);
        formData.append("userId", _id);

     
        // 3. Upload image with token in headers
        try {
          const imageUploadRes = await axiosInstance.post("/user/imageupload", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          });

          console.log("Image upload success:", imageUploadRes.data)
        } catch (imgErr) {
                const message = imgErr?.response?.data?.message || "Image upload failed";
                  setError((prev) => ({ ...prev, profileImage: message }));
                  toast.error("Please select a profile image");
                    return;

        }
        navigate("/login");
      } else {
        toast.warn("Signup response missing _id or token");
        
      }
    } catch (error) {
      const message = error?.response?.data?.message || "Signup failed. Try again.";
       toast.error(message)
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        {["name", "email", "password"].map((field) => (
          <div className="form-group" key={field}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <input
              type={field === "password" ? "password" : "text"}
              value={signupData[field]}
              onChange={(e) => onChangeData(field, e.target.value)}
            />
            {error[field] && <p className="error-text">{error[field]}</p>}
          </div>
        ))}

       <div className="form-group">
  <label>Profile Image</label>
  <input type="file" accept="image/*" onChange={handleFileChange} />
  {signupData.profileImagePreview && (
    <img src={signupData.profileImagePreview} alt="preview" className="preview-img" />
  )}
  {error.profileImage && <p className="error-text">{error.profileImage}</p>}
</div>

       
        <button type="submit">Signup</button>
        <p className="redirect-text">
          Already registered? <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
};

export default Signup;