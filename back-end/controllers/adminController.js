import User from '../model/userModel.js';  
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {uploadImage} from '../cloudinaryConfig.js';

const generateToken = (id, role = 'admin') => {
  return jwt.sign({ id, role }, process.env.JWT, { expiresIn: '30d' });
};

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    
    const admin = await User.findOne({ email, role: 'admin' });
    if (admin && await bcrypt.compare(password, admin.password)) {
      res.json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        token: generateToken(admin._id, 'admin'),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials or not an admin' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const isAuthenticated = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ status: false, message: 'Unauthorized access' });
    }

    const adminData = await User.findById(req.user._id).select('-password');

    return res.status(200).json({
      status: true,
      message: 'Authenticated',
      data: adminData,
    });
  } catch (error) {
    console.error('Authentication Error:', error);
    return res.status(500).json({ status: false, message: 'Server error', error });
  }
};

export const getUsers = async (req, res) => {
  try {
    const searchQuery = req.query.search || "";

    const users = await User.find({
      role: "user",
      $or: [
        { name: { $regex: searchQuery, $options: "i" } },
        { email: { $regex: searchQuery, $options: "i" } },
      ],
    }).select("-password");

    return res.status(200).json({ status: true, users });
  } catch (error) {
    console.error("Get Users Error:", error);
    return res.status(500).json({ status: false, message: "Failed to fetch users", error });
  }
};


export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!req.file) return res.status(400).json({ message: 'Image is required' });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ message: 'Email already exists' });

    const imageUrl = await uploadImage(req.file.buffer); 
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      profileImage: imageUrl,
    });
    await newUser.save();
    res.status(201).json({ message: 'User added successfully', user: newUser });
  } catch (error) {
    console.error('Add User Error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const editUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    let profileImage;

    if (req.file) {
      profileImage = await uploadImage(req.file.buffer);
    }
    const updateData = { name, email };
    if (profileImage) updateData.profileImage = profileImage;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    res.status(200).json({ message: 'User updated', user: updatedUser });
  } catch (error) {
    console.error("Edit User Error:", error);
    res.status(500).json({ message: error.message });
  }
};


export const imageUpload = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image uploaded' });

    const imageUrl = await uploadImage(req.file.buffer);
    const user = await User.findById(req.body.userId);

    if (!user) return res.status(404).json({ message: 'User not found' });

    user.profileImage = imageUrl;
    await user.save();

    res.status(200).json({ message: 'Image uploaded successfully', imageUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
