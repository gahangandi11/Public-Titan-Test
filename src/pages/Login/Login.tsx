import React, { useState } from "react";
import {
  IonButton,
  IonCard,
  IonCardHeader,
  IonContent,
  IonFooter,
  IonImg,
  IonInput,
  IonLabel,
  IonPage,
  IonRouterLink,
  useIonToast,
} from "@ionic/react";
import { useHistory } from "react-router";
import "./Login.css";
import TitanT from "../../assets/icon/favicon.png";
import {
  emailSignup,
  emailLogin,
  sendEmailVerfication,
  isEmailVerifiedByUser,
} from "../../services/contexts/AuthContext/AuthContext";
import {
  createUser,
  getUserByID,
} from "../../services/firestoreService";



const Login: React.FC = () => {
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


  const history = useHistory();
  const [signup, setSignup] = useState(false);
  const [present, dismiss] = useIonToast();


  const registrationRedirect = window.location.href;

  async function login() {
    emailLogin(email, password).then(
      (usercredential) => {
        if (isEmailVerifiedByUser()) {
          //Check if user requires admin verification.
          getUserByID(usercredential.user.uid).then((userData) => {
            if (userData.verified == true) {
              clear();
              // history.push("/home");

              history.push("/homepage")
            } else {
              history.push("/verification");
            }
          });
        } else {
          present({
            buttons: [{ text: "dismiss", handler: () => dismiss() }],
            message: "Email verification pending for " + email,
            duration: 5000,
            color: "danger",
          });
          history.push("/verification");
        }
      },
      (error) => {
        present({
          buttons: [{ text: "dismiss", handler: () => dismiss() }],
          message: error,
          duration: 5000,
          color: "danger",
        });
      }
    );
  }
// adding comment here
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
      present({
        buttons: [{ text: "dismiss", handler: () => dismiss() }],
        message: "Please fill out all required fields.",
        duration: 5000,
        color: "danger",
      });
      return;
    }


    if (password === checkPassword) {
      try {
        const userCredential = await emailSignup(email, password);
        await emailLogin(email, password);
        await sendEmailVerfication(
          registrationRedirect +
          "?verificationId=" +
          userCredential.user.uid +
          "&email=" +
          userCredential.user.email
        );
        setSignup(!signup);
        clear();
        setEmail(email);
        await createUser(userCredential, firstName, middleName, lastName, phoneNumber, companyName, shortDescription);
        history.push("/verification");
        present({
          buttons: [{ text: "dismiss", handler: () => dismiss() }],
          message: "A verification email is sent to " + email,
          duration: 5000,
          color: "success",
        });
      } catch (error: any) {
        present({
          buttons: [{ text: "dismiss", handler: () => dismiss() }],
          message: error.message || "Something went wrong",
          duration: 5000,
          color: "danger",
        });
      }
    } else {
      present({
        buttons: [{ text: "dismiss", handler: () => dismiss() }],
        message: "Passwords do not match.",
        duration: 5000,
        color: "danger",
      });
    }
  }

  function clear() {
    setEmail("");
    setPassword("");
    setCheckPassword("");
  }

  const onEnterKeyPressedOnPasswordField = (event: any) => {
    if (event.key.toLowerCase() === "enter") {
      if (!signup) {
        login();
      }
    }
  };

  return (

    <IonPage>
      <IonContent color="light">
        <div className="background" />
        <div className="card--container">
          <IonCard
            className={`card--login ion-padding ion-margin ${signup ? 'card--signup' : ''}`}
            color="primary">
            <IonCardHeader className="titan-container">
              <IonImg className="titan-t" src={TitanT} />
              {!signup && <IonLabel color="light">Login</IonLabel>}
              {signup && <IonLabel color="light">Sign Up</IonLabel>}
            </IonCardHeader>


            {!signup && (
              <>
                <IonLabel color="light" position="floating">
                  Email:{" "}
                </IonLabel>
                <IonInput
                  className="login-input"
                  value={email}
                  onIonChange={(val) => {
                    const inputEmail = val.detail.value;
                    if (inputEmail) {
                      setEmail(inputEmail);
                    }
                  }}
                />
              </>
            )
            }


            {!signup && (
              <>
                <IonLabel color="light" position="floating">
                  Password:{" "}
                </IonLabel>
                <IonInput
                  onKeyDown={onEnterKeyPressedOnPasswordField}
                  className="login-input"
                  type="password"
                  value={password}
                  onIonChange={(val) => {
                    const inputPassword = val.detail.value;
                    if (inputPassword) {
                      setPassword(inputPassword);
                    }
                  }}
                />
              </>
            )
            }


            {
              signup && (
                <>
                  <div className="signup-fields">

                    <div className="email-password">
                      <div>
                        <IonLabel color="light" position="floating">
                          Email:{" "}
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
                          Password:{" "}
                        </IonLabel>
                        <IonInput
                          onKeyDown={onEnterKeyPressedOnPasswordField}
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
                          Confirm Password:{" "}
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
                          Company Name:
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
                          First Name:
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
                          Last Name:
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
                          Phone Number:
                        </IonLabel>
                        <IonInput
                          className={`signup-input ${!phoneNumberValid ? "invalid" : ""}`}
                          type="text"
                          value={phoneNumber}
                          onIonChange={(val) => {
                            const phoneNumber = val.detail.value;
                            if (phoneNumber) {
                              setphoneNumber(phoneNumber);
                            }
                          }}
                        />
                      </div>


                    </div>

                  </div>

                  <div>
                    <IonLabel color="light" position="floating">
                      Why do you want to access Titan? (Please explain shortly):
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
                </>
              )
            }




            {!signup && (
              <div className="links">
                <IonRouterLink className="link" routerLink="/forgotPassword">
                  <IonLabel>Forgot your password?</IonLabel>
                  <br />
                </IonRouterLink>
              </div>
            )}
            <IonFooter className="buttons-footer">
              {!signup && (
                <IonButton color="secondary" onClick={login}>
                  Login
                </IonButton>
              )}
              {signup && (
                <IonButton color="secondary" onClick={onSignup}>
                  Sign Up
                </IonButton>
              )}
              <IonButton
                color="secondary"
                onClick={() => {
                  setSignup(!signup);
                  clear();
                }}
              >
                {!signup && <span>Sign Up</span>}
                {signup && <span>Back to Login</span>}
              </IonButton>
            </IonFooter>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>

  );
};

export default Login;
