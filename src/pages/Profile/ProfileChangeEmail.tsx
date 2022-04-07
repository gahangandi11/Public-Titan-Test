import React, { useState } from "react";
import {
  IonButton,
  IonCard,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonInput,
  IonLabel,
  IonPage,
  IonRow,
  IonText,
  useIonToast,
} from "@ionic/react";
import "./Profile.css";
import {
  updateUserEmail,
  updateUserPassword,
  useAuth,
} from "../../services/contexts/AuthContext/AuthContext";
import { ProfileUpdateAction } from "../../interfaces/ProfileData";

const ProfileChangeEmail: React.FC<ProfileUpdateAction> = (props) => {
  const { currentUser } = useAuth();
  const [present, dismiss] = useIonToast();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");

  async function updateEmail() {
    console.log("Current Password : " + currentPassword);
    console.log("New Email : " + newEmail);
    try {
      let userCredential = await updateUserEmail(
        currentUser,
        newEmail,
        currentPassword
      );
      clear();
      present({
        buttons: [{ text: "dismiss", handler: () => dismiss() }],
        message: "Email updated successfully",
        duration: 3000,
        color: "success",
      });
      props.onProfileSegmentUpdated();
    } catch (e: any) {
      present({
        buttons: [{ text: "dismiss", handler: () => dismiss() }],
        message: e,
        duration: 5000,
        color: "danger",
      });
    }
  }

  function clear() {
    setCurrentPassword("");
    setNewEmail("");
  }

  return (
    <IonCard className="profile-form-card">
      <IonLabel color="dark" position="floating">
        New Email:{" "}
      </IonLabel>
      <IonInput
        className="login-input profile-form-input-width"
        value={newEmail}
        type="email"
        onIonChange={(val) => {
          const newEmail = val.detail.value;
          if (newEmail) {
            setNewEmail(newEmail);
          }
        }}
      />

      <IonLabel color="dark" position="floating">
        Current Password:{" "}
      </IonLabel>
      <IonInput
        className="login-input profile-form-input-width"
        value={currentPassword}
        type="password"
        onIonChange={(val) => {
          const currentPassword = val.detail.value;
          if (currentPassword) {
            setCurrentPassword(currentPassword);
          }
        }}
      />

      <IonButton
        color="secondary"
        onClick={() => {
          updateEmail();
        }}
      >
        Update
      </IonButton>
    </IonCard>
  );
};

export default ProfileChangeEmail;
