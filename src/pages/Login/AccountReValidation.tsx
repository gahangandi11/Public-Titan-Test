import * as React from "react";
import { useEffect, useState } from "react";

import {
  IonFooter,
  IonCard,
  IonCardContent,
  IonContent,
  IonLabel,
  IonPage,
  IonToolbar,
  IonButton,
  IonIcon,
} from "@ionic/react";
// import { getFireUser } from '../../firebaseConfig';
// import './Registration.css';
import {arrowBackOutline,arrowBackSharp,} from "ionicons/icons";
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

const ReValidation: React.FC = () => {
  const userAuth = getCurrentUser();

  const [error, setError] = useState<string>("");
  const [renewalRequires, setRenewalRequires] =useState<boolean>(false);
  const [verfieid, setVerified] = useState<boolean>(false);

  const history = useHistory();

  const back = () => {
    history.push("/login");
  };


  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    async function fetchUserData() {
      if (userAuth) {
        // console.log("Getting user document");
        const doc = await getDoc(getUserDocumentRef(userAuth.uid));
        if (doc.exists()) {
          const document = doc.data() as User;
          setRenewalRequires(document.requiresRenewal ?? false);
          // setVerified(document.verified ?? false);
          if (!document.requiresRenewal) {
            // history.push("/home");
            history.push("/homepage");
            return;
          }
        }

        // console.log("Listening to user docs");
        unsubscribe = onSnapshot(getUserDocumentRef(userAuth!.uid), (doc) => {
          const data = doc.data();
          if (data) {
            const document = data as User;
            setRenewalRequires(document.requiresRenewal ?? false);
            // setVerified(document.verified ?? false);
            if (!document.requiresRenewal) {
              // history.push("/home");
              history.push("/homepage");
            }
            // if (document.verified && !document.requiresRenewal) {
            //   // history.push("/home");
            //   history.push("/homepage");
            // }
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

  function getErrorMessage(): string {
    if (renewalRequires)
      return "Your account has been disabled temporarily and requires renewal. Please contact support.";
    // else if (!renewalRequires && verfieid)
    //   return "Your account has been renewed.";
    else return "Your account doesn't requires renewal at the moment.";
  }

  return (
    <IonPage>
      <IonContent color="dark" className="content">
        <IonToolbar className="login-container" color="dark">
          <div className="card-container-registration">
            <IonCard className="card-registration">
              <IonCardContent className="ion-text-center">
                  <IonLabel>{getErrorMessage()}</IonLabel>
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
                </div>
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

export default ReValidation;
