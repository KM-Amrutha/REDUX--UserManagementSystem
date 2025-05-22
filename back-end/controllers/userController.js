import User from '../model/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { uploadImage } from '../cloudinaryConfig.js';
import multer from 'multer'
const storage = multer.memoryStorage();
const upload = multer({ storage });

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT, {
    expiresIn: '30d',
  });
};

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please fill all fields' });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const  isAuthenticated = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ status: false, message: 'User not authenticated' });
    }

    const userData = await User.findById(req.user.id);
    if (!userData) {
      return res
        .status(404)
        .json({ status: false, message: 'User not found' });
    }

    return res
      .status(200)
      .json({ status: true, message: 'User authenticated', userData });
  } catch (error) {
    console.error('Authentication Check Error:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }
    const imageUrl = await uploadImage(req.file.buffer);
    const { userId } = req.body;
    if (!imageUrl) {
      return res.status(500).json({ message: "Image upload to Cloudinary failed" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.profileImage = imageUrl;
    await user.save();

    res.status(200).json({ message: "Image uploaded successfully", imageUrl });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


