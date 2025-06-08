import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  useMediaQuery,
  FormControl,
  FormHelperText,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { axiosInstance } from "../redux/axiosInterceptor";
import { toast } from "react-hot-toast";

export default function AddUser({ SetaddUser, addUserTolist }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    profileImage: null,
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!data.name) newErrors.name = "Name is required";
    if (!data.email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      newErrors.email = "Invalid email format";
    if (!data.password || data.password.length < 6)
      newErrors.password = "Min 6 chars password";
    if (!data.profileImage) newErrors.profileImage = "Image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClose = () => SetaddUser(false);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSizeMB = 1;

    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        profileImage: "Only JPG, PNG, or WEBP images allowed",
      }));
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        profileImage: `Image must be under ${maxSizeMB}MB`,
      }));
      return;
    }

    setData({ ...data, profileImage: file });
    setErrors((prev) => ({ ...prev, profileImage: "" }));
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const res = await axiosInstance.get("/admin/authenticated");
      const userId = res.data?.data?._id;
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("profileImage", data.profileImage);
      formData.append("userId", userId);

      const uploadRes = await axiosInstance.post("/admin/add-user", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      addUserTolist(uploadRes.data.user);
      SetaddUser(false);
    } catch (err) {
  const message =
    err?.response?.data?.message || "Something went wrong. Please try again.";
  console.error("Add User Error:", message);
  toast.error(message);
}
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={true}
      onClose={handleClose}
      maxWidth="sm"
      PaperProps={{
        sx: {
          background:
            "linear-gradient(180deg, rgb(235, 131, 4) 0%, rgb(204, 0, 146) 100%)",
          color: "#fff",
        },
      }}
    >
      <DialogTitle>Add User Details</DialogTitle>

      <DialogContent>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Name"
            name="name"
            value={data.name}
            onChange={handleChange}
            sx={{ input: { color: "#fff" }, label: { color: "#ccc" } }}
            error={!!errors.name}
          />
          <FormHelperText sx={{ color: "black" }}>
            {errors.name || " "}
          </FormHelperText>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <TextField
            label="Email"
            name="email"
            type="email"
            value={data.email}
            onChange={handleChange}
            sx={{ input: { color: "#fff" }, label: { color: "#ccc" } }}
            error={!!errors.email}
          />
          <FormHelperText sx={{ color: "black" }}>
            {errors.email || " "}
          </FormHelperText>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <TextField
            label="Password"
            name="password"
            type="password"
            value={data.password}
            onChange={handleChange}
            sx={{ input: { color: "#fff" }, label: { color: "#ccc" } }}
            error={!!errors.password}
          />
          <FormHelperText sx={{ color: "black" }}>
            {errors.password || " "}
          </FormHelperText>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <input
            type="file"
            name="profileImage"
            onChange={handleFileChange}
            accept="image/*"
            style={{ color: "#fff" }}
          />
          <FormHelperText sx={{ color: "black" }}>
            {errors.profileImage || " "}
          </FormHelperText>
        </FormControl>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={handleClose}
          sx={{ bgcolor: "red", color: "#fff", ":hover": { bgcolor: "#c00" } }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          sx={{
            bgcolor: "#1976d2",
            color: "#fff",
            ":hover": { bgcolor: "#115293" },
          }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
