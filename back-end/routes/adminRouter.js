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

import { authenticateJWT } from '../middleware/auth.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/login', adminLogin);
router.get('/authenticated', authenticateJWT('admin'), isAuthenticated);
router.get('/users', authenticateJWT('admin'), getUsers);
router.delete('/user/:id', authenticateJWT('admin'), deleteUser);
router.post('/add-user', authenticateJWT('admin'), upload.single('profileImage'), addUser);
router.put('/edit-user/:id', authenticateJWT('admin'), upload.single('profileImage'), editUser);
router.post('/upload-image', authenticateJWT('admin'), upload.single('profileImage'), imageUpload);

export default router;
