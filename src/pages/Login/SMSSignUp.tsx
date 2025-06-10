import * as React from 'react';
import { useState } from 'react';
import TitanT from "../../assets/icon/favicon.png";
import {
    IonButton,IonCardHeader,IonCardSubtitle,IonFooter, IonImg, IonLabel} from '@ionic/react';
import Phone from '../../components/PhoneInput/Phone';
import CodeSignUp from '../../components/CodeSignUp/CodeSignUp';
import { verifyPhoneNumber } from '../../services/contexts/AuthContext/AuthContext';
import './Login.css';
import useToast from '../../components/useToast/useToast';


type SMSSignUpProps = {
    recaptcha: any;
    setMfaSignup: (value: boolean) => void;
};


const SMSSignUp: React.FC<SMSSignUpProps> = ({ recaptcha, setMfaSignup }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    // const recaptcha = useRecaptcha('recaptcha-verifier');
    const [verificationId, setVerificationId] = useState<string | null>(null);
    const { showError, showSuccess } = useToast();

    const handleClick = async () => {


        if (!recaptcha) {
            showError('Recaptcha not initialized,please try again');
            return;
        }

        const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;

        try {

            const verificationId = await verifyPhoneNumber(formattedPhone, recaptcha);

            if (!verificationId) {
                showError('Something went wrong, please try again');
                console.error('Verification ID not returned');
                return;
            }
            else {
                showSuccess('Verification code sent successfully');
                setVerificationId(verificationId);
            }
        }
        catch (error: any) {
            showError(error.message || 'Error sending verification code');
            console.error('Error sending verification code:', error);
        }
    }

    return (

        <>

            {!verificationId &&
                (
                    <>
                        <IonCardHeader className="titan-container">
                            <IonImg className="titan-t" src={TitanT} />
                            <IonLabel color="light">Enable Multi Factor Authentication</IonLabel>
                        </IonCardHeader>
                        <IonCardSubtitle className="centered-subtitle">
                            <IonLabel color="light">It is now mandatory to enroll in MFA to access TITAN</IonLabel>
                        </IonCardSubtitle>
                        <IonLabel style={{ color: 'white' }}>Enter your phone number<span className='mandatory-asterisk'>*</span></IonLabel>
                        <div className='sms-login'>
                            <Phone phone={phoneNumber} setPhone={setPhoneNumber} />
                        </div>
                        <IonFooter className="buttons-footer">
                            <IonButton
                                color="secondary"
                                onClick={() => { handleClick() }}
                            >
                                Enable MFA
                            </IonButton>
                            <IonButton color="secondary" href="/login">Back to Login</IonButton>
                        </IonFooter>
                    </>
                )

            }
            {
                verificationId && <CodeSignUp verificationId={verificationId} setMfaSignup={setMfaSignup} />

            }
            {/* <div id='recaptcha-verifier'></div> */}
        </>
    );


};

export default SMSSignUp;
