import * as React from "react";
import { useEffect, useState } from "react";

import {
  IonFooter,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonContent,
  IonLabel,
  IonPage,
  IonToolbar,
  IonButton,
  IonIcon,
} from "@ionic/react";
// import { getFireUser } from '../../firebaseConfig';
// import './Registration.css';
import {
  arrowBackOutline,
  arrowBackSharp,
  arrowForwardOutline,
  arrowForwardSharp,
  checkmarkCircleOutline,
  checkmarkCircleSharp,
} from "ionicons/icons";
import { useHistory } from "react-router";
// import firebaseService from '../../services/firebaseService';
import { User } from "../../interfaces/User";
import AuthProvider, {
  watchUser,
  emailSignup,
  emailLogin,
  sendEmailVerfication,
  isEmailVerifiedByUser,
  getReidrectedUrl,
  getCurrentUser,
} from "../../services/contexts/AuthContext/AuthContext";
import { getUserDocumentRef } from "../../services/firestoreService";
import { getDoc, onSnapshot } from "firebase/firestore";

const EmailVerification: React.FC = () => {
  const userAuth = getCurrentUser();

  const registrationRedirect = window.location.href.replace(
    "/verification",
    "/login"
  );
  const [error, setError] = useState<string>("");
  const [resent, setResent] = useState<boolean>(false);
  const [emailVerified, setEmailVerified] = useState<boolean>(false);
  const [adminVerfied, setAdminVerified] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  const resend = () => {
    if (userAuth) {
      sendEmailVerfication(
        registrationRedirect +
          "?verificationId=" +
          userAuth!.uid +
          "&email=" +
          userAuth!.email
      ).then(
        (resp) => {
          setError("");
          setResent(true);
        },
        (error) => {
          setError(error.message);
          setResent(false);
        }
      );
    }
  };

  const history = useHistory();

  const back = () => {
    history.push("/login");
  };

  const toDashboard = () => {
    history.push("/home");
  };



  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    async function fetchUserData() {
      if (userAuth) {
        console.log("Getting user document");
        setEmailVerified(isEmailVerifiedByUser());
        const doc = await getDoc(getUserDocumentRef(userAuth.uid));
        if (doc.exists()) {
          const document = doc.data() as User;
          setUser(document);
          setAdminVerified(document.verified);
        }
      }
      if (userAuth) {
        console.log("Listening to user docs");
        unsubscribe = onSnapshot(getUserDocumentRef(userAuth!.uid), (doc) => {
          const data = doc.data();
          if (data) {
            const document = data as User;
            setUser(document);
            if (document.verified && isEmailVerifiedByUser()) {
              history.push("/home");
            }
          }
        });
      }
    }
    fetchUserData();
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [userAuth, history]);

  function getMessageWhenEmailIsNotVerified(): string {
    if (userAuth) {
      if (/@modot.mo.gov\s*$/.test(userAuth.email!))
        return "Please follow the link in the email to verify your email address.";
      else
        return "Please follow the link in the email to verify your email address. It will take 24 - 48 hours for administrator approval after verifying your email.";
    }
    return "Please follow the link in the email to verify your email address. It will take 24 - 48 hours for administrator approval after verifying your email.";
  }

  function getMessageWhenNotAdminVerified(): string {
    if (userAuth) {
      if (/@modot.mo.gov\s*$/.test(userAuth.email!))
        return "Thank you for verifying your email. You may proceed to login.";
      else
        return "Thank you for verifying your email. Please allow 24 - 48hours for administrator approval.";
    }
    return "Thank you for verifying your email. Please allow 24 - 48hours for administrator approval.";
  }

  return (
    <IonPage>
      <IonContent color="dark" className="content">
        <IonToolbar className="login-container" color="dark">
          <div className="card-container-registration">
            <IonCard className="card-registration">
              <IonCardContent className="ion-text-center">
                {!emailVerified && !adminVerfied && (
                  <IonLabel>{getMessageWhenEmailIsNotVerified()}</IonLabel>
                )}
                <br />
                {emailVerified && !adminVerfied && (
                  <IonLabel>{getMessageWhenNotAdminVerified()}</IonLabel>
                )}
                {!emailVerified && adminVerfied && (
                  <IonLabel>
                    Please follow the link in the email to verify your email
                    address.
                  </IonLabel>
                )}
                {!resent && !emailVerified && (
                  <div>
                    <IonLabel>Can&apos;t find the email?</IonLabel>
                    <IonButton color="secondary" onClick={resend}>
                      Resend
                    </IonButton>
                  </div>
                )}
                {emailVerified && adminVerfied && (
                  <IonLabel>
                    You&apos;ve been approved, click to go to the home!
                  </IonLabel>
                )}
                <br />
                <div className="route-buttons">
                  <IonButton
                    color="secondary"
                    className="route-button"
                    onClick={back}
                  >
                    <IonIcon md={arrowBackSharp} ios={arrowBackOutline} />
                    &nbsp;Back to Login
                  </IonButton>
                  
                  {emailVerified && adminVerfied && (
                    <IonButton
                      color="secondary"
                      className="route-button"
                      onClick={toDashboard}
                    >
                      Proceed to Home &nbsp;
                      <IonIcon
                        md={arrowForwardSharp}
                        ios={arrowForwardOutline}
                      />
                    </IonButton>
                  )}
                </div>

                {resent && (
                  <div className="button-container">
                    <IonLabel>The email has been resent.</IonLabel>
                  </div>
                )}
                {error.length > 0 && (
                  <div className="error-message">{error}</div>
                )}
              </IonCardContent>
            </IonCard>
          </div>
        </IonToolbar>
      </IonContent>

      <IonFooter className="ion-no-border">
        <IonToolbar color="dark">
          <IonLabel slot="end">@TITAN 2021 All rights reserved.</IonLabel>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default EmailVerification;
