import { Router } from 'express';
import { jwtVerify } from '../middlewares/jwtVerify.js';
import {
  followUnfollowUser,
  getAllUsers,
  getSuggestedUsers,
  getUserProfile,
  updateUserProfile,
} from '../controllers/user.controller.js';

const router = Router();

router.get('/profile/:username', jwtVerify, getUserProfile);
router.get('/suggested', jwtVerify, getSuggestedUsers);
router.get('/all', jwtVerify, getAllUsers);
router.post('/follow/:id', jwtVerify, followUnfollowUser);
router.post('/update', jwtVerify, updateUserProfile);

export default router;
