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

const ProfileChangeEmail: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <IonCard className="profile-card">
      <IonGrid>
        <IonRow>
          <IonLabel>Change Password</IonLabel>{" "}
        </IonRow>
      </IonGrid>
    </IonCard>
  );
};

export default ProfileChangeEmail;
