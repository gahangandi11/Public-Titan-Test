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
  const [approvalStatus, setApprovalStatus] = useState("Awaiting Approval");
  const [approvalColor, setApprovalColor] = useState("danger");
  const [user, setUser] = useState<User | null>(null);


  const resend = () => {
    if (userAuth)
    {
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
    if (userAuth) {
      console.log("Getting user document");
      setApprovalStatus(userAuth.emailVerified?"Verified":"Pending")
      getDoc(getUserDocumentRef(userAuth.uid))
        .then((doc) => {
          if (doc.exists()) {
            const document = doc.data() as User;
            setUser(document);
          }
        });
      }

    if (userAuth) {
      console.log("Listening to user docs");
      unsubscribe = onSnapshot(getUserDocumentRef(userAuth!.uid), (doc) => {
        const document = doc.data() as User;
        setUser(document)
        if (document.verified && isEmailVerifiedByUser()) {
          history.push("/home");
        }
      });
    }

   

    return () => {
      if (unsubscribe) {
        unsubscribe();
        console.log("Unsubscribed from user docs");
      }
    };
  }, [userAuth]);

  function getMessageBeforeVerifying(): string {
    if (userAuth) {
      if (/@modot.mo.gov\s*$/.test(userAuth.email!))
        return "Please follow the link in the email to verify your email address.";
      else
        return "Please follow the link in the email to verify your email address. It will take 24 - 48 hours for administrator approval after verifying your email.";
    }
    return "Please follow the link in the email to verify your email address. It will take 24 - 48 hours for administrator approval after verifying your email.";
  }

  getMessageBeforeVerifying
  function getMessageAfterEmailVerifying():string
  {
    if(userAuth)
    {
      if(/@modot.mo.gov\s*$/.test(userAuth.email!))
       return "Thank you for verifying your email."
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
              <IonCardHeader className="verification-container">
                Email Verification{" "}
                <IonIcon
                  color="success"
                  md={checkmarkCircleSharp}
                  ios={checkmarkCircleOutline}
                />
              </IonCardHeader>
              <IonCardContent className="ion-text-center">
                {!user?.verified && approvalStatus !== "Verified" && (

                  <IonLabel>
                    {getMessageBeforeVerifying()}
                  </IonLabel>
                )}
                <br />
                <br />
                <IonLabel color={approvalColor}>
                  Approval Status: {approvalStatus}
                </IonLabel>
                {!resent && (
                  <div className="button-container">
                    {(!user?.verified ||
                      approvalStatus !== "Verified") && (
                      <div>
                        {!user?.verified && (
                          <IonLabel>Can&apos;t find the email?</IonLabel>
                        )}
                      </div>
                    )}
                    {!user?.verified && approvalStatus === "Verified" && (
                      <IonLabel>
                       {getMessageAfterEmailVerifying()}
                      </IonLabel>
                    )}
                    {user?.verified && approvalStatus === "Verified" && (
                      <IonLabel>
                        You&apos;ve been approved, click to go to the home!
                      </IonLabel>
                    )}
                    {!user?.verified && (
                      <div style={{ display: "block" }}>
                      <IonButton color="secondary" onClick={resend}>
                        Resend
                      </IonButton>
                      </div>
                    )}
                    <br />
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
                      {user?.verified && approvalStatus === "Verified" && (
                        <IonButton
                          color="secondary"
                          className="route-button"
                          onClick={toDashboard}
                        >
                          Go to the Dashboard&nbsp;
                          <IonIcon
                            md={arrowForwardSharp}
                            ios={arrowForwardOutline}
                          />
                        </IonButton>
                      )}
                    </div>
                  </div>
                )}
                {resent && (
                  <div className="button-container">
                    <IonLabel>The email has been resent.</IonLabel>
                    
                  </div>
                )}
                {error.length>0 &&(
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

interface EmailDTO {
  userId: string | null;
  email: string | null;
}
