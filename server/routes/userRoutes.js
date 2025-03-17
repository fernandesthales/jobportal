import express from 'express';
import { applyForJob, getUserData, getUserJobApplications, updateUserResume } from '../controllers/userController.js';
import upload from '../config/multer.js';


const router = express.Router();

// Get user Data
router.get('/user', getUserData)

//Apply for a job
router.post('/apply', applyForJob)

//Get applied Jobs Data
router.get('/applications', getUserJobApplications)

//Update User Profile (resume)
router.post('/update-resume', upload.single('resume'), updateUserResume)

export default router;