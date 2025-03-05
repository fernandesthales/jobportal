import { createContext, useEffect, useState } from "react";
import { jobsData } from "../assets/assets";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

    const [searchFilter, setSearchFilter] = useState({
        title:'',
        location:''
    })

    const [isSearched, setIsSearched] = useState(false); // Fixed typo
    const [state, setState] = useState(null); // Example state
    const [jobs, setJobs] = useState([])

    const [showRecruiterLogin, setShowRecruiterLogin] = useState(false)

    //Function to fetch jobs
    const fetchJobs = async () => {
        setJobs(jobsData)
    }

    useEffect(() => {
        fetchJobs()
    },[])

    const value = {
        state, setState,
        setSearchFilter, searchFilter,
        isSearched, setIsSearched,
        jobs, setJobs, // Fixed typo
        showRecruiterLogin, setShowRecruiterLogin
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};
