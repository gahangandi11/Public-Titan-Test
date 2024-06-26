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

const ProfileHeader: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <IonGrid className="profile-header">
      <IonRow>
        <IonCol>
          <IonIcon
            icon={personCircleOutline}
            color="secondary"
            className="profile-image"
          />
        </IonCol>
        
      </IonRow>
      <IonRow>
        <IonCol className="center-text">
          <IonText mode="ios" color="primary">
            <h2>{currentUser?.email}</h2>
          </IonText>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default ProfileHeader;
