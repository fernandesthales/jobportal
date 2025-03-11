import express from 'express';
import { registerCompany, loginCompany, getCompanyData, postJob, getCompanyJobsApplicants, getCompanyPostedJobs, changeJobApplicationStatus, changeVisibility } from '../controllers/companyControoler.js';
import upload from '../config/multer.js';
import { protectCompany } from '../middleware/authMiddleware.js';

const router = express.Router();

//Register a new company
router.post('/register', upload.single('image'), registerCompany);

//Company Login
router.post('/login', loginCompany);

//Get company data
router.get('/company', protectCompany, getCompanyData);

//Post a new job
router.post('/post-job', protectCompany, postJob);

//Get Company Jobs Applicants
router.get('/applicants', protectCompany, getCompanyJobsApplicants);

//Get Company Posted Jobs
router.get('/list-jobs', protectCompany, getCompanyPostedJobs);

//Change Job Application Status
router.post('/change-status', protectCompany, changeJobApplicationStatus);

//Change Applications Visibility
router.post('/change-visibility', protectCompany, changeVisibility);

export default router;
