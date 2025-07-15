import React from 'react'
import { MultiFactorResolver } from 'firebase/auth';
import SMSLogin from './SMSLogin';
import { verifyUserEnrolled , getCurrentUser } from '../../services/contexts/AuthContext/AuthContext';
import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'firebase/functions';
import { useHistory } from 'react-router';
import useToast from '../../hooks/useToast/useToast';
import { app } from "../../firebaseConfig"


type CodeSignInProps = {
    verificationId: string;
    resolver: MultiFactorResolver;
    email: string;
    setVerificationId: (verificationId: string) => void;
    setResolver: (resolver: MultiFactorResolver | undefined) => void;
  };


const CodeSignIn : React.FC<CodeSignInProps> = ({verificationId, resolver,email,setVerificationId, setResolver}) => {

    const history = useHistory();
    const {showError, showSuccess}=useToast();

    const functions = getFunctions(app);

    if (process.env.NODE_ENV === 'development') {
      connectFunctionsEmulator(functions, "127.0.0.1", 5001);
    }


    async function getCode(code: string) {
        const response = await verifyUserEnrolled({verificationId,resolver},code);
        if(response) {
            setVerificationId("");
            setResolver(undefined);
            showSuccess("OPT verified successfully");

            history.push('/homepage');
        }
        else{
          showError("Something went wrong, please try again");
        }
    }

    return (
        <SMSLogin getCode={getCode}/>
    )
}

export default CodeSignIn;