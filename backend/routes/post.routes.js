import { Router } from 'express';
import {
  commentOnPost,
  createPost,
  deleteAllSavedPosts,
  deletePost,
  deleteSavedPost,
  getAllPosts,
  getAllSavedPosts,
  getFollowingPosts,
  getLikedPosts,
  getUserPosts,
  likeUnlikePost,
  savePost,
} from '../controllers/post.controller.js';
import { jwtVerify } from '../middlewares/jwtVerify.js';

const router = Router();

router.get('/all', jwtVerify, getAllPosts);
router.get('/following', jwtVerify, getFollowingPosts);
router.get('/likes/:userId', jwtVerify, getLikedPosts);
router.get('/user/:username', jwtVerify, getUserPosts);
router.get('/saved', jwtVerify, getAllSavedPosts);
router.post('/save-post/:postId', jwtVerify, savePost);
router.post('/delete-saved-post/:postId', jwtVerify, deleteSavedPost);
router.post('/delete-all-saved-posts', jwtVerify, deleteAllSavedPosts);
router.post('/create', jwtVerify, createPost);
router.post('/comment/:id', jwtVerify, commentOnPost);
router.post('/like/:id', jwtVerify, likeUnlikePost);
router.delete('/delete/:id', jwtVerify, deletePost);

export default router;
