import Company from '../models/Company.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cloudinary from 'cloudinary';
import generateToken from '../utils/generateToken.js';
import { config } from 'dotenv';
import Job from '../models/Job.js';
// Register a new company

export const registerCompany = async (req, res) => {
    const { name, email, password } = req.body;

    const imageFile = req.file;

    if (!name || !email || !password || !imageFile) {
        return res.json({ success: false, message: 'Missing Detalis' });
        
    }

    try {
        const companyExists = await Company.findOne({ email });

        if (companyExists) {
            return res.json({ success: false, message: 'Company Already Exist' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const imageUpload = await cloudinary.uploader.upload(imageFile.path);

        const company = await Company.create({
            name,
            email,
            password: hashPassword,
            image: imageUpload.secure_url
        });

        res.json({ success: true, 
                    company: {
                    _id: company._id,
                    name: company.name,
                    email: company.email,
                    image: company.image
                    },
                    token: generateToken(company._id)
                 });


    } catch (error) {
        res.json({ success: false, message: error.message });
        console.log('JWT_SECRET:', process.env.JWT_SECRET);
    }

}

// Company Login
export const loginCompany = async (req, res) => {

    const { email, password } = req.body;
    try {

        const company = await Company
            .findOne({ email });
        if (bcrypt.compare(password, company.password)) {

            res.json({ success: true, 
                        company: {
                        _id: company._id,
                        name: company.name,
                        email: company.email,
                        image: company.image
                        },
                        token: generateToken(company._id)
                    });
        } else {
            res.json({ success: false, message: 'Invalid Email or Password' });
        }
    } catch (error) {
        res.json({ success: false, 
            message: error
        });
    }

}

//Get company data
export const getCompanyData = async (req, res) => {

}

//Post a new job
export const postJob = async (req, res) => {

    const { title, description, location, salary, level, category} = req.body;
    const companyId = req.company._id;
    
    try {
        const newJob = new Job({
            title,
            description,
            location,
            salary,
            companyId,
            date: Date.now(),
            level,
            category
        });

        await newJob.save();
        res.json({ success: true, newJob});
    } catch (error) {
        res.json({ success: false, message: error.message });
    }


}

//Get Company Jobs Applicants  
export const getCompanyJobsApplicants = async (req, res) => {

}

//Get Company Posted Jobs
export const getCompanyPostedJobs = async (req, res) => {

}

//Change Job Application Status
export const changeJobApplicationStatus = async (req, res) => {

}

//Change Job visibility
export const changeVisibility = async (req, res) => {

}