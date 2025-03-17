import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const {user, isLoaded} = useUser()
    const { getToken } = useAuth()
    

    const [searchFilter, setSearchFilter] = useState({
        title:'',
        location:''
    })

    const [isSearched, setIsSearched] = useState(false); // Fixed typo
    const [state, setState] = useState(null); // Example state
    const [jobs, setJobs] = useState([])

    const [showRecruiterLogin, setShowRecruiterLogin] = useState(false)

    const [companyToken, setCompanyToken] = useState(null)
    const [companyData, setCompanyData] = useState(null)

    const [userData, setUserData] = useState(null)
    const [userApplications, setUserApplications] = useState([])

    //Function to fetch jobs
    const fetchJobs = async () => {
        try {
            const {data} = await axios.get(backendUrl + '/api/jobs')

            if (data.success) {
                setJobs(data.jobs)
                console.log(data.jobs)
            } else {
                toast.error(data.message)
            }       
        } catch (error) {
            toast.error(error.message)
        }
    }

    //Function to fetch company data
    const fetchCompanyData = async () => { 

        const companyToken = localStorage.getItem('companyToken');
        if (!companyToken) return;
        try {
            const {data} = await axios.get(backendUrl + '/api/company/company', {headers: {token: companyToken}})
            if (data.success) {
                setCompanyData(data.company)
                console.log(data)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    //Function to fetch user data

    const fetchUserData = async () => {
        try {
            const token = await getToken()

            const {data} = await axios.get(backendUrl + '/api/users/user', 
                
                {
                    method: 'GET',
                    headers: {Authorization: `Bearer ${token}`}});

            if (data.success) {
                setUserData(data.user)
                } else {
                toast.error(data.message) 
                console.log(error)
                }
        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }
    }

        
        

    useEffect(() => {
        fetchJobs()

        const storedCompanyToken = localStorage.getItem('companyToken')
        if(storedCompanyToken){
            setCompanyToken(storedCompanyToken)
        }
    },[])

    useEffect(() => {
        if (companyToken) {
            fetchCompanyData()
        }
    }, [companyToken])

    /*
    useEffect(() => {
        if (user) {
            fetchUserData()
        }
    }, [user]) */

   // Atualize o useEffect para melhor controle
useEffect(() => {
    if (isLoaded && user && !userData) {
        console.log("Iniciando busca de dados do usuário...");
        console.log("Status do usuário:", {
            isLoaded,
            userId: user?.id,
            hasUserData: !!userData
        });
        fetchUserData();
    }
}, [isLoaded, user]);

    const value = {
        state, setState,
        setSearchFilter, searchFilter,
        isSearched, setIsSearched,
        jobs, setJobs, // Fixed typo
        showRecruiterLogin, setShowRecruiterLogin,
        companyToken, setCompanyToken,
        companyData, setCompanyData,
        backendUrl,
        userData, setUserData,
        userApplications, setUserApplications
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};
