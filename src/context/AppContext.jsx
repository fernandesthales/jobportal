import { createContext, useState } from "react";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

    const [searchFilter, setSearchFilter] = useState({
        title:'',
        location:''
    })

    const [isSearched, setIsSearched] = useState(false); // Fixed typo
    const [state, setState] = useState(null); // Example state

    const value = {
        state, setState,
        setSearchFilter, searchFilter,
        isSearched, setIsSearched // Fixed typo
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};
