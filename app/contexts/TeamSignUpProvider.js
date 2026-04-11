import React, { createContext, useContext, useState } from 'react';

const TeamSignUpContext = createContext();

export const useTeamSignUpContext = () => {
    const context = useContext(TeamSignUpContext);
    if (!context) {
        throw new Error("useSignUpContext must be used within SignUpProvider");
    }
    return context;
};

export const TeamSignUpProvider = ({ children }) => {
    const [teamRegistrantInfo, setTeamRegistrantInfo] = useState({ emailAddress: '', phoneNumber: '', fullName:'',isValidNum:null, dateOfBirth:null,password:"",signUpMethod:"",teamName:""});
    const [hasEmail,setHasEmail] = useState(null)
    const [hasNumber, setHasNumber] = useState(null)
    const [errorMessage,setErrorMessage] = useState('')

    const handleTeamRegistrantInfo = ({field, value}) => {
        setTeamRegistrantInfo(prevState => ({
            ...prevState,
            [field]: value,
          }));
    }

    return (
        <TeamSignUpContext.Provider value={{ teamRegistrantInfo, setTeamRegistrantInfo,errorMessage,setErrorMessage, hasEmail, setHasEmail, setHasNumber, hasNumber, handleTeamRegistrantInfo}}>
            {children}
        </TeamSignUpContext.Provider>
    );
};
