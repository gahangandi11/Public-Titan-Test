import { useEffect, useState } from "react";
import { ApplicationVerifier, RecaptchaVerifier } from "firebase/auth";
import { getAuth } from "firebase/auth";


const useRecaptcha = (componentId:string) :ApplicationVerifier | undefined => {

    const [recaptcha, setRecaptcha] = useState<ApplicationVerifier>();

    useEffect(() => { 
        const recaptchaVerifier = new RecaptchaVerifier(componentId, {"size": "invisible"}, getAuth());

        setRecaptcha(recaptchaVerifier);

        return () => {recaptchaVerifier.clear();} // Cleanup function to clear the recaptcha verifier
    }, [componentId]);

    return recaptcha ;

}

export default useRecaptcha;