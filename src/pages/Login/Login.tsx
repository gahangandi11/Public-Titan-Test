import React, { useState } from "react";
import { IonButton, IonCard, IonCardHeader, IonContent, IonFooter, IonImg, IonInput, IonLabel, IonPage, IonRouterLink, useIonToast } from "@ionic/react";
import { useHistory } from "react-router";
import "./Login.css";
import TitanT from "../../assets/icon/favicon.png";
import { emailLogin, verifyUserMFA } from "../../services/contexts/AuthContext/AuthContext";
import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'firebase/functions';
import { app } from "../../firebaseConfig"
import useRecaptcha from "../../components/Recaptcha/useRecaptcha";
import { MultiFactorResolver } from "firebase/auth";
import CodeSignIn from "../../components/CodeSignIn/CodeSignIn";
import SMSSignUp from "./SMSSignUp";
import useToast from "../../hooks/useToast/useToast";
import { ResendEmailVerification } from "../../services/firestoreService";
import { is } from "date-fns/locale";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { showError, showWarning, showSuccess } = useToast();
  const [mfasignup, setMfaSignup] = useState(false);

  const history = useHistory();

  const [present, dismiss] = useIonToast();



  const recaptcha = useRecaptcha('recaptcha-verifier');

  const [verificationId, setVerificationId] = useState<string>();
  const [resolver, setResolver] = useState<MultiFactorResolver | undefined>();


  async function login() {
    try {
      setIsLoading(true);
      const functions = getFunctions(app);

      if (process.env.NODE_ENV === 'development') {
        connectFunctionsEmulator(functions, "127.0.0.1", 5001);
      }

      const getUserStatus = httpsCallable(functions, 'getUserStatus');





      const statusResult = await getUserStatus({ email });
      const statusData = statusResult.data as { userExists: boolean, emailVerified: boolean, isAdminVerified: boolean, isMFAEnabled: boolean };


      if (!statusData.userExists) {
        showError("No account found with this email.");
        setIsLoading(false);
        return;
      }

      if (!statusData.emailVerified) {
        // showWarning("Your email address has not been verified. Please check your inbox.", "top");
        present({
          buttons: [{
            text: "Resend", handler: async () => {

              try {
                await ResendEmailVerification(email);
                showSuccess("Verification email re-sent successfully.");
              }
              catch (error: any) {
                showError(`Failed to resend verification email`);
              }

            }
          }],
          message: "Your email address has not been verified. Please check your inbox.",
          duration: 6000,
          color: "warning",
          position: "top",
        });
        setIsLoading(false);
        return;
      }

      if (!statusData.isAdminVerified) {
        showWarning("Your account is awaiting approval from an administrator.Please allow 24-48 hours for approval.", "top");
        setIsLoading(false);
        return;
      }

      await emailLogin(email, password);
      if (!statusData.isMFAEnabled) {
        setIsLoading(false);
        setMfaSignup(true);
        return;
      }

    } catch (error: any) {
      // This will catch errors from both getUserStatus and emailLogin     

      if (error.code === 'auth/multi-factor-auth-required' && recaptcha) {

        // const functions = getFunctions(app);

        // if (process.env.NODE_ENV === 'development') {
        //   connectFunctionsEmulator(functions, "127.0.0.1", 5001);
        // }

        // const isLastMfaVerifiedMoreThanThirtyDays = httpsCallable(functions, 'isLastMfaVerifiedMoreThanThirtyDays');
        // const isLastMfaVerifiedMoreThanThirtyDaysResult = await isLastMfaVerifiedMoreThanThirtyDays({ email });

        // console.log("isLastMfaVerifiedMoreThanThirtyDaysResult", isLastMfaVerifiedMoreThanThirtyDaysResult);

        // if (isLastMfaVerifiedMoreThanThirtyDaysResult.data) {

          try {
            const data = await verifyUserMFA(error, recaptcha, 0);
            if (!data) {
              showError("Something went wrong. Please refresh the page and try again.");
            }
            else {
              showSuccess("OTP sent to your phone");
              const { verificationId, resolver } = data;
              //by setting the verificationId and resolver, the login page will show the OTP input field
              setVerificationId(verificationId);
              setResolver(resolver);
            }
          } catch (smsError) {
            if (typeof smsError === 'object' && smsError !== null && 'message' in smsError) {
              showError(`Failed to send verification code: ${(smsError as { message: string }).message}`);
            } else {
              showError("Failed to send verification code.");
            }
          }

        // }
        // else {
        //   console.log("Last MFA verification was less than 30 days ago, redirecting to homepage");
        //   history.push('/homepage');
        // }


      }
      else {
        console.error("Login process failed:", error);
        showError(error.message || "An unexpected error occurred. Please try again.")
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (

    <IonPage>
      <IonContent color="light">
        <div className="background" />
        <div className="card--container">
          <IonCard
            className={`card--login ion-padding ion-margin`}
            color="primary">

            {
              !verificationId && !resolver && !mfasignup && (
                <>
                  <IonCardHeader className="titan-container">
                    <IonImg className="titan-t" src={TitanT} />
                    <IonLabel color="light">Login</IonLabel>
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
                  <div className="links">
                    <IonRouterLink className="link" routerLink="/forgotPassword">
                      <IonLabel>Forgot your password?</IonLabel>
                      <br />
                    </IonRouterLink>
                  </div>
                  <IonFooter className="buttons-footer">
                    <IonButton
                      color="secondary"
                      onClick={() => {
                        history.push("/signup");
                      }}
                    >
                      <span>Sign Up</span>
                    </IonButton>

                    <IonButton color="secondary" onClick={login} >
                      {isLoading ? "Logging in..." : "Login"}
                    </IonButton>

                  </IonFooter>
                </>
              )
            }
            {
              !verificationId && !resolver && mfasignup && (
                <SMSSignUp recaptcha={recaptcha} setMfaSignup={setMfaSignup} />
              )
            }
            {
              verificationId && resolver && (
                <CodeSignIn verificationId={verificationId}
                  resolver={resolver}
                  email={email}
                  setVerificationId={setVerificationId}
                  setResolver={setResolver} />
              )
            }
          </IonCard>
        </div>
        <div id='recaptcha-verifier'></div>
      </IonContent>
    </IonPage>
  );
};

export default Login;





