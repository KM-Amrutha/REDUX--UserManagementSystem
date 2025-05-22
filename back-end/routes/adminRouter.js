
import express from 'express';
import {
  adminLogin,
  isAuthenticated,
  getUsers,
  deleteUser,
  addUser,
  editUser,
  imageUpload
} from '../controllers/adminController.js';

import { adminAuthenticateJWT } from '../middleware/auth.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/login', adminLogin);
router.get('/authenticated', adminAuthenticateJWT, isAuthenticated);
router.get('/users', adminAuthenticateJWT, getUsers);
router.delete('/user/:id', adminAuthenticateJWT, deleteUser);
router.post('/add-user', adminAuthenticateJWT, upload.single('profileImage'), addUser);
router.put('/edit-user/:id', adminAuthenticateJWT,upload.single('profileImage'), editUser);
router.post('/upload-image', upload.single('profileImage'), adminAuthenticateJWT, imageUpload);

export default router;
