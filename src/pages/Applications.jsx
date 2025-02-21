import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import { assets, jobsApplied } from '../assets/assets'
import moment from 'moment'

const Applications = () => {

  const [isEdit, setIsEdit] = useState(false)
  const [resume, setResume] = useState(null)

  return (
    <>
    <Navbar />
    <div className='container px-4 min-h-[65vh] 2xl:px-20 mx-auto my-10'>
      <h2 className='text-xl font-semibold'>Your Resume</h2>
      <div className='flex gap-2 mb-6 mt-3'>
        {
          isEdit 
          ? <>
          <label htmlFor="resumeUpload" className='flex items-center'>
            <p className='bg-blue-100 text-blue-600 px-4 py-2 rounded-lg mr-2'>Select Resume</p>
            <input id='resumeUpload' onChange={e => setResume(e.target.files[0])} accept='application/pdf' type="file" hidden />
            <img src={assets.profile_upload_icon} alt="" />
          </label>
          <button onClick={e => setIsEdit(false)} className='bg-green-100 border border-green-400 rounded-lg px-4 py-2'>Save</button>

          </>
          : <div className='flex gap-2'>
            <a href="" className='bg-blue-100 text-blue-600 px-4 py-2 rounded-lg'>
              Resume
            </a>
            <button onClick={() => setIsEdit(true)} className='text-gray-500 border border-gray-300 rounded-lg px-4 py-2'>Edit</button>
          </div>
        }
      </div>
      <h2 className='text-xl font-semibold mb-4'>Jobs Applied</h2>
      <table className='min-w-full bg-white border rounded-lg'>
        <thead>
          <tr>
            <th>Company</th>
            <th>Job Title</th>
            <th>Location</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {jobsApplied.map((job, index) => true ? (
            <tr>
              <td>
                <img src={job.logo} alt="" />
                {job.company}
              </td>
              <td>
                {job.title}
              </td>
              <td>
                {job.location}
              </td>
              <td>
                {moment(job.date).format('ll')}
              </td>
              <td>{job.status}</td>
            </tr>
          ) : (null))}
        </tbody>
      </table>
    </div>
    </>
  )
}

export default Applications
