import express from 'express';
import { getJobById, getJobs } from '../controllers/jobController.js';

const router = express.Router();

//Route to get a single job by id
router.get('/:id', getJobById);

//Route to get all jobs data
router.get('/', getJobs);

export default router;