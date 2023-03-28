import React, { KeyboardEventHandler, useState, useEffect } from "react";
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
import AuthProvider, {
  emailSignup,
  emailLogin,
  sendEmailVerfication,
  isEmailVerifiedByUser,
} from "../../services/contexts/AuthContext/AuthContext";
import {
  checkIfUserWithSameEmailAlreadyExists,
  createUser,
  getUserByID,
} from "../../services/firestoreService";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
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
              history.push("/home");
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

  async function signupClickv2() {
    if (password === checkPassword) {
      emailSignup(email, password).then(
        (userCredential) => {
          sendEmailVerfication(
            registrationRedirect +
              "?verificationId=" +
              userCredential.user.uid +
              "&email=" +
              userCredential.user.email
          ).then(
            (result) => {
              setSignup(!signup);
              clear();
              setEmail(email);
              createUser(userCredential).then(() => {
                history.push("/verification");
                present({
                  buttons: [{ text: "dismiss", handler: () => dismiss() }],
                  message: "A verification email is sent to " + email,
                  duration: 5000,
                  color: "success",
                });
              });
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
    } else {
      present({
        buttons: [{ text: "dismiss", handler: () => dismiss() }],
        message: "Passwords do not match.",
        duration: 5000,
        color: "danger",
      });
    }
  }

  async function signupClickv3() {
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
        await createUser(userCredential);
        history.push("/verification");
        present({
          buttons: [{ text: "dismiss", handler: () => dismiss() }],
          message: "A verification email is sent to " + email,
          duration: 5000,
          color: "success",
        });
      } catch (error:any) {
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
    <AuthProvider>
      <IonPage>
        <IonContent color="light">
          <div className="background" />
          <div className="card--container">
            <IonCard
              className="card--login ion-padding ion-margin"
              color="primary"
            >
              <IonCardHeader className="titan-container">
                <IonImg className="titan-t" src={TitanT} />
                {!signup && <IonLabel color="light">Login</IonLabel>}
                {signup && <IonLabel color="light">Sign Up</IonLabel>}
              </IonCardHeader>
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
              {signup && (
                <IonLabel color="light" position="floating">
                  Confirm Password:{" "}
                </IonLabel>
              )}
              {signup && (
                <IonInput
                  className="login-input"
                  type="password"
                  value={checkPassword}
                  onIonChange={(val) => {
                    const inputCheck = val.detail.value;
                    if (inputCheck) {
                      setCheckPassword(inputCheck);
                    }
                  }}
                />
              )}
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
                  <IonButton color="secondary" onClick={signupClickv3}>
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
    </AuthProvider>
  );
};

export default Login;
