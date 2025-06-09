import express from 'express';
import {
  registerUser,
  loginUser,
  updateUserProfile,
  uploadProfileImage,
  isAuthenticated
} from '../controllers/userController.js';

import { authenticateJWT } from '../middleware/auth.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.get('/authenticated', authenticateJWT('user'), isAuthenticated);

router.put('/edit-profile',authenticateJWT('user'),upload.single('profileImage'), updateUserProfile);
router.post('/imageupload', authenticateJWT('user'), upload.single('profileImage'), uploadProfileImage);

export default router;
