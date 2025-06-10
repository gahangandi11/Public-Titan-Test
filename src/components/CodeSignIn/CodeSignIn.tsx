import React from 'react'
import { MultiFactorResolver } from 'firebase/auth';
import SMSLogin from './SMSLogin';
import { verifyUserEnrolled } from '../../services/contexts/AuthContext/AuthContext';
import { useHistory } from 'react-router';
import useToast from '../useToast/useToast';


type CodeSignInProps = {
    verificationId: string;
    resolver: MultiFactorResolver;
    setVerificationId: (verificationId: string) => void;
    setResolver: (resolver: MultiFactorResolver | undefined) => void;
  };


const CodeSignIn : React.FC<CodeSignInProps> = ({verificationId, resolver,setVerificationId, setResolver}) => {

    const history = useHistory();
    const {showError, showSuccess}=useToast();

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