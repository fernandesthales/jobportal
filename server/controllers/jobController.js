import Job from "../models/Job.js"
import mongoose from 'mongoose';


// Get all jobs
export const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find({visible: true})
        .populate({path: 'companyId', select: '-password'})

        res.json({success:true, jobs})

    } catch (error) {

        res.json({success:false, message: error.message})
    }
}

// Get a single job by ID
export const getJobById = async (req, res) => {

      try {
        const { id } = req.params;

        // ✅ Check for valid MongoDB ObjectId format
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ success: false, message: 'Invalid job ID format' });
        }

        // ✅ Use `.findById()` instead of `.find()` for single documents
        const job = await Job.findById(id)
            .populate({ path: 'companyId', select: '-password' });

        // ✅ Return 404 if no job is found
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        // ✅ Return the job only if it's found
        res.json({ success: true, job });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};