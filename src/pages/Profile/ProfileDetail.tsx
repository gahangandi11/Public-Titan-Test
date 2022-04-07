import React, { useState } from "react";
import {
  IonButton,
  IonCard,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonLabel,
  IonPage,
  IonRow,
  IonText,
} from "@ionic/react";
import "./Profile.css";
import { useAuth } from "../../services/contexts/AuthContext/AuthContext";
import { personCircleOutline } from "ionicons/icons";


const ProfileInfo: React.FC = () => {

  const { currentUser } = useAuth();

  /**
   * If user has any other information than email that can be shown then evaluate the userInfo object
   * @returns true, if user has any related info that can be shown otherwise false
   */
  const hasDetail = () => {
    return false;
  };

  return (
    <div>
      {hasDetail() && (
     
              <IonCard className="profile-card" >
                <IonGrid >
                  <IonRow >
                    <IonLabel>Details</IonLabel>
                  </IonRow>
                  <IonRow className="detail-label-container">
                    <IonLabel>Name : {currentUser?.displayName}</IonLabel>
                  </IonRow>
                </IonGrid>
              </IonCard>
           
      )}
    </div>
  );
};

export default ProfileInfo;
