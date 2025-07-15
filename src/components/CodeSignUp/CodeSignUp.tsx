import React from 'react'
import SMSLogin from '../CodeSignIn/SMSLogin';
import { enrollUser } from '../../services/contexts/AuthContext/AuthContext';
import { useHistory } from 'react-router';
import useToast from '../../hooks/useToast/useToast';


type CodeSignUpProps = {
    verificationId: string ;
    setMfaSignup: (value: boolean) => void;
  };


const CodeSignUp : React.FC<CodeSignUpProps> = ({ verificationId, setMfaSignup}) => {

    const history = useHistory();
    const {showError, showSuccess}=useToast();

    async function getCode(code: string) {

        const response = await enrollUser( verificationId, code);

        if(response) {
            showSuccess("OPT verified successfully");
            setMfaSignup(false);
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

export default CodeSignUp;