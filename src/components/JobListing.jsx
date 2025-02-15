import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { assets, JobCategories, JobLocations } from '../assets/assets'
import JobCard from './JobCard'

const JobListing = () => {

    const {isSearched, searchFilter, setSearchFilter, jobs} = useContext(AppContext)

    const [showFilter, setShowFilter] = useState(true)

    const [currentPage, setCurrentPage] = useState(1)
    const [selectedCategories, setSelectedCategories] = useState([])

  return (
    <div className='container 2xl:px-20 mx-auto flex flex-col lg:flex-row max-lg:space-y-8 py-8'>
      {/*SideBar */}
      <div className='w-full lg:w-1/4 bg-white px-4'>
        {/*Search Filter from Hero Component*/}
        {
            isSearched && (searchFilter.title !== "" || searchFilter.location !== "") && (
                <>
                <h3 className='font-medium text-lg mb-4'>Current Search</h3>
                <div className='mb-4 text-gray-600'>
                  {searchFilter.title && (
                    <span className='inline-flex items-center gap-2.5 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded'>
                      {searchFilter.title}
                      <img onClick={e => setSearchFilter(prev => ({...prev, title: ""})) } className='cursor-pointer' src={assets.cross_icon} alt="" />
                    </span>
                  )}
                  {searchFilter.location && (
                    <span className='ml-2 inline-flex items-center gap-2.5 bg-red-50 border border-red-200 px-4 py-1.5 rounded'>
                      {searchFilter.location}
                      <img onClick={e => setSearchFilter(prev => ({...prev, location: ""})) } className='cursor-pointer' src={assets.cross_icon} alt="" />                      
                    </span>
                  )}

                  <button onClick={e => setShowFilter(prev => !prev)} className='px-6 py-1.5 rounder border border-gray-400 lg:hidden'>
                    {showFilter ? "Close" : "Filters"}
                  </button>

                  
                </div>
                
                </>
            )
        }
        {/*Category Filter */}
        <div className={showFilter ? "" : "max-lg:hidden"}>
                    <h4 className='font-medium text-lg py-4'> Search by Categories </h4>
                    <ul className='space-y-4 text-gray-600'>
                      {
                        JobCategories.map((category, index) => (
                          <li key={index} className='flex gap-3 items-center'>
                            <input type="checkbox" className='scale-125'/>
                            {category}
                          </li>
                        ))
                      }
                    </ul>
                  </div>

                   {/*Location Filter */}
                   <div className={showFilter ? "" : "max-lg:hidden"}>
                    <h4 className='font-medium text-lg py-4 pt-14'> Search by Location </h4>
                    <ul className='space-y-4 text-gray-600'>
                      {
                        JobLocations.map((location, index) => (
                          <li key={index} className='flex gap-3 items-center'>
                            <input type="checkbox" className='scale-125'/>
                            {location}
                          </li>
                        ))
                      }
                    </ul>
                  </div>
      </div>
        {/* Job Listings */}
      <section className='w-full lg:w-3/4 text-gray-800 max-lg:px-4'>
                  <h3 className='font-medium text-3xl py-2' id='job-list'>Latest Jobs</h3>
                  <p className='mb-8'>Get your desired job from companies</p>
                  <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'>
                    {jobs.slice((currentPage - 1) * 6, currentPage * 6).map((job, index) => (
                      <JobCard key={index} job={job}/>
                    ))}

                  </div>
                  {/* Pagination */}
                  {jobs.length > 0 && (
                    <div className='flex items-center justify-center space-x-2 mt-10'>
                      <a href="">
                        <img onClick={() => setCurrentPage(Math.max(currentPage - 1), 1)} src={assets.left_arrow_icon} alt="" />
                      </a>
                      {Array.from({length:Math.ceil(jobs.length/6)}).map((_, index) => (
                        <a href="#job-list">
                          <button onClick={() => setCurrentPage(index + 1)} className={`w-10 h-10 flex items-center justify-center border border-gray-300 rounded ${currentPage === index + 1 ? 'bg-blue-100 text-blue-500' : 'text-gray-500'}`}>{index + 1}</button>
                        </a>
                      ))}
                      <a href="#job-list">
                        <img onClick={() => setCurrentPage(Math.min(currentPage+ 1, Math.ceil(jobs.length / 6)))} src={assets.right_arrow_icon} alt="" />
                      </a>
                    </div>
                  )}
                </section>

    </div>
  )
}

export default JobListing
