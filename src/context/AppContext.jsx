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

      const fetchUserData = async () => {
            try {
                if (!isLoaded || !user) {
                    console.log("⚠️ Usuário não está pronto ainda");
                    return;
                }
        
                const token = await getToken();
        
                if (!token) {
                    console.log("❌ Token não obtido");
                    toast.error("Falha na autenticação");
                    return;
                }
        
                console.log("🔑 Token:", token);
        
                try {
                    const response = await axios.get(`${backendUrl}/api/users/user`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });
        
                    if (response.data.success) {
                        console.log("✅ Dados do usuário:", response.data.user);
                        setUserData(response.data.user);
                    } else {
                        throw new Error(response.data.message || "Erro na resposta do servidor");
                    }
                } catch (error) {
                    if (error.response?.status === 401) {
                        console.log("❌ Token inválido ou expirado");
                        toast.error("Sessão expirada. Faça login novamente.");
                    } else {
                        console.error("❌ Erro na requisição:", error);
                        toast.error("Erro ao buscar dados do usuário");
                    }
                }
            } catch (error) {
                console.error("❌ Erro geral:", error);
                toast.error("Erro ao processar requisição");
            }
        };

        //Function to fetch user applications
        const fetchUserApplications = async () => {
            try {
                const token = await getToken()
                const {data} = await axios.get(backendUrl + '/api/users/applications', 
                    {headers: {Authorization: `Bearer ${token}`}}
                )
                if (data.success) {
                    setUserApplications(data.applications)
                } else {
                    toast.error(data.message)
                }
            } catch (error) {
                toast.error(error.message)
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
            fetchUserApplications();
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
        userApplications, setUserApplications,
        fetchUserData,
        fetchUserApplications
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};
