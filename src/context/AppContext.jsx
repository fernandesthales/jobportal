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
    /*
    const fetchUserData = async () => {
        try {
            const token = await getToken()

            const {data} = await axios.get(backendUrl + '/api/users/user', 
                {headers: {Authorization: `Bearer ${token}`}});

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
    } */

    const fetchUserData = async () => {
            try {
                
                const token = await getToken();
                console.log("Token received from getToken():", token);
                if (!user) {
                    console.log("Usuário não autenticado");
                    return;
                }
                    
                if (!token) {
                    console.log("Token não encontrado");
                    toast.error("Token de autorização não encontrado");
                    return;
                } else {
                    console.log("Token encontrado:", token);
                }
        
                const response = await axios.get(`${backendUrl}/api/users/user`, {
                    headers: { Authorization: `Bearer ${token}` }, // Include the session token as a Bearer token in the Authorization header
                  });
        
                const { data } = response;
                
                if (data.success) {
                    console.log("Dados do usuário recebidos:", data.user);
                    setUserData(data.user);
                } else {
                    console.log("Erro na resposta:", data);
                    toast.error(data.message || "Erro ao buscar dados do usuário");
                }
            } catch (error) {
                console.error("Erro completo:", error);
                
                if (error.response) {
                    console.log("Erro do servidor:", error.response.data);
                    toast.error(error.response.data?.message || "Erro do servidor");
                } else if (error.request) {
                    console.log("Sem resposta do servidor");
                    toast.error("Servidor não respondeu");
                } else {
                    console.log("Erro na configuração:", error.message);
                    toast.error("Erro na configuração da requisição");
                }
            }
        };
        

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

    useEffect(() => {
        if (isLoaded && user && !userData) {
            console.log("Tentando buscar dados do usuário...");
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
