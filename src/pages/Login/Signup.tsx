import React, { useState } from "react";
import { IonButton, IonCard, IonCardHeader, IonContent, IonFooter, IonImg, IonInput, IonLabel, IonPage } from "@ionic/react";
import { useHistory } from "react-router";
import "./Login.css";
import TitanT from "../../assets/icon/favicon.png";
import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'firebase/functions';
import { app } from "../../firebaseConfig"
import Phone from "../../components/PhoneInput/Phone";
import useToast from "../../hooks/useToast/useToast";


const Signup: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [checkPassword, setCheckPassword] = useState("");
    const [firstName, setfirstName] = useState("");
    const [middleName, setmiddleName] = useState("");
    const [lastName, setlastName] = useState("");
    const [phoneNumber, setphoneNumber] = useState("");
    const [companyName, setcompanyName] = useState("");
    const [shortDescription, setShortDescription] = useState("");
  
  
    const [emailValid, setEmailValid] = useState<boolean>(true);
    const [passwordValid, setPasswordValid] = useState<boolean>(true);
    const [checkPasswordValid, setCheckPasswordValid] = useState<boolean>(true);
    const [firstNameValid, setfirstNameValid] = useState<boolean>(true);
    const [lastNameValid, setlastNameValid] = useState<boolean>(true);
    const [phoneNumberValid, setphoneNumberValid] = useState<boolean>(true);
    const [companyNameValid, setcompanyNameValid] = useState<boolean>(true);
    const [shortDescriptionValid, setShortDescriptionValid] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState(false);
    const { showError, showSuccess } = useToast();

    const history = useHistory();

    async function onSignup() {
        //when developers working locally, you can comment out the below if condition to create accounts 
        //using gmail for development purposes.
        // if (email.toLowerCase().endsWith("@gmail.com")) {
        //   present({
        //     buttons: [{ text: "dismiss", handler: () => dismiss() }],
        //     message: "sign up with gmail is not allowed. Please use your work email",
        //     duration: 7000,
        //     color: "danger",
        //   });
        //   return;
        // }
        setIsLoading(true);
        let valid = true;
    
        if (!email.trim()) {
          setEmailValid(false);
          valid = false;
        }
        else {
          setEmailValid(true);
        }
    
        if (!password.trim()) {
          setPasswordValid(false);
          valid = false;
        }
        else {
          setPasswordValid(true);
        }
    
        if (!checkPassword.trim()) {
          setCheckPasswordValid(false);
          valid = false;
        }
        else {
          setCheckPasswordValid(true);
        }
    
    
        if (!firstName.trim()) {
          setfirstNameValid(false);
          valid = false;
        }
        else {
          setfirstNameValid(true);
        }
    
    
        if (!lastName.trim()) {
          setlastNameValid(false);
          valid = false;
        }
        else {
          setlastNameValid(true);
        }
    
    
        if (!phoneNumber.trim()) {
          setphoneNumberValid(false);
          valid = false;
        }
        else {
          setphoneNumberValid(true);
        }
    
        if (!companyName.trim()) {
          setcompanyNameValid(false);
          valid = false;
        }
        else {
          setcompanyNameValid(true);
        }
    
        if (!shortDescription.trim()) {
          setShortDescriptionValid(false);
          valid = false;
        }
        else {
          setShortDescriptionValid(true);
        }
    
    
        if (!valid) {
          showError("Please fill out all required fields.");
          return;
        }
    
        if (password === checkPassword) {
          try {
    
            const functions = getFunctions(app);

            if (process.env.NODE_ENV === 'development') {
                connectFunctionsEmulator(functions, "127.0.0.1", 5001);
              }
    
    
            const userSignUpFn = httpsCallable(functions, 'userSignUpFn');
            const result = await userSignUpFn({
              email,
              password,
              checkPassword,
              firstName,
              middleName,
              lastName,
              phoneNumber,
              companyName,
              shortDescription,
            });
    
            setIsLoading(false);
    
            const successMessage = (result.data as { message: string }).message;
            showSuccess(successMessage || "Sign up successful! Please check your email for verification.");
            history.push("/login");
          }
          catch (error) {
            console.error("Error calling deleteUserFn:", error);
    
            let errorMessage = "An error occurred during sign up."; // Default message
            if (error instanceof Error) {
              errorMessage = error.message;
            } else if (typeof error === 'object' && error !== null && 'message' in error) {
              errorMessage = (error as { message: string }).message;
            }
    
            showError(errorMessage);
          }
        }
        else {
          showError("Passwords do not match.");
          return;
        }
      }
    
    return (

        <IonPage>
            <IonContent color="light">
                <div className="background" />
                <div className="card--container">
                    <IonCard
                        className={`card--login ion-padding ion-margin card--signup`}
                        color="primary">
                        <IonCardHeader className="titan-container">
                            <IonImg className="titan-t" src={TitanT} />
                            <IonLabel color="light">Sign Up</IonLabel>
                        </IonCardHeader>
                        <div className="signup-fields">
                            <div className="email-password">
                                <div>
                                    <IonLabel color="light" position="floating">
                                        Email<span className="mandatory-asterisk">*</span>
                                    </IonLabel>
                                    <IonInput
                                        className={`signup-input ${!emailValid ? "invalid" : ""}`}
                                        value={email}
                                        onIonChange={(val) => {
                                            const inputEmail = val.detail.value;
                                            if (inputEmail) {
                                                setEmail(inputEmail);
                                            }
                                        }}
                                    />
                                </div>
                                <div>
                                    <IonLabel color="light" position="floating">
                                        Password<span className="mandatory-asterisk">*</span>
                                    </IonLabel>
                                    <IonInput
                                       
                                        className={`signup-input ${!passwordValid ? "invalid" : ""}`}
                                        type="password"
                                        value={password}
                                        onIonChange={(val) => {
                                            const inputPassword = val.detail.value;
                                            if (inputPassword) {
                                                setPassword(inputPassword);
                                            }
                                        }}
                                    />
                                </div>
                                <div>
                                    <IonLabel color="light" position="floating">
                                        Confirm Password<span className="mandatory-asterisk">*</span>
                                    </IonLabel>
                                    <IonInput
                                        className={`signup-input ${!checkPasswordValid ? "invalid" : ""}`}
                                        type="password"
                                        value={checkPassword}
                                        onIonChange={(val) => {
                                            const inputCheck = val.detail.value;
                                            if (inputCheck) {
                                                setCheckPassword(inputCheck);
                                            }
                                        }}
                                    />
                                </div>
                                <div>
                                    <IonLabel color="light" position="floating">
                                        Company Name<span className="mandatory-asterisk">*</span>
                                    </IonLabel>
                                    <IonInput
                                        className={`signup-input ${!companyNameValid ? "invalid" : ""}`}
                                        type="text"
                                        value={companyName}
                                        onIonChange={(val) => {
                                            const companyName = val.detail.value;
                                            if (companyName) {
                                                setcompanyName(companyName);
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="name-phone">
                                <div>
                                    <IonLabel color="light" position="floating">
                                        First Name<span className="mandatory-asterisk">*</span>
                                    </IonLabel>
                                    <IonInput
                                        className={`signup-input ${!firstNameValid ? "invalid" : ""}`}
                                        type="text"
                                        value={firstName}
                                        onIonChange={(val) => {
                                            const firstName = val.detail.value;
                                            if (firstName) {
                                                setfirstName(firstName);
                                            }
                                        }}
                                    />
                                </div>
                                <div>
                                    <IonLabel color="light" position="floating">
                                        Middle Name:
                                    </IonLabel>
                                    <IonInput
                                        className="signup-input"
                                        type="text"
                                        value={middleName}
                                        onIonChange={(val) => {
                                            const middleName = val.detail.value;
                                            if (middleName) {
                                                setmiddleName(middleName);
                                            }
                                        }}
                                    />
                                </div>
                                <div>
                                    <IonLabel color="light" position="floating">
                                        Last Name<span className="mandatory-asterisk">*</span>
                                    </IonLabel>
                                    <IonInput
                                        className={`signup-input ${!lastNameValid ? "invalid" : ""}`}
                                        type="text"
                                        value={lastName}
                                        onIonChange={(val) => {
                                            const lastName = val.detail.value;
                                            if (lastName) {
                                                setlastName(lastName);
                                            }
                                        }}
                                    />
                                </div>
                                <div>
                                    <IonLabel color="light" position="floating">
                                        Phone Number<span className="mandatory-asterisk">*</span>
                                    </IonLabel>
                                    <Phone phone={phoneNumber} setPhone={setphoneNumber} />
                                </div>
                            </div>
                        </div>
                        <div>
                            <IonLabel color="light" position="floating">
                                Why do you want to access Titan? (Please explain shortly)<span className="mandatory-asterisk">*</span>
                            </IonLabel>
                            <IonInput
                                className={`login-input ${!shortDescriptionValid ? "invalid" : ""}`}
                                type="text"
                                value={shortDescription}
                                onIonChange={(val) => {
                                    const inputShortDescription = val.detail.value;
                                    if (inputShortDescription) {
                                        setShortDescription(inputShortDescription);
                                    }
                                }}
                            />
                        </div>
                        <IonFooter className="buttons-footer">
                            <IonButton color="secondary" onClick={onSignup}>
                                {isLoading ? "Signing Up..." : "Sign Up"}
                            </IonButton>
                            <IonButton
                                color="secondary"
                                onClick={() => {
                                    history.push("/login");
                                }}
                            >
                                <span>Back to Login</span>
                            </IonButton>
                        </IonFooter>
                    </IonCard>
                </div>
                <div id='recaptcha-verifier'></div>
            </IonContent>
        </IonPage>
    )
}

export default Signup;