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
  updateUserPassword,
  useAuth,
} from "../../services/contexts/AuthContext/AuthContext";
import { personCircleOutline } from "ionicons/icons";
import { clear } from "console";

const ProfileChangePassword: React.FC = () => {
  const { currentUser } = useAuth();
  const [present, dismiss] = useIonToast();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  async function updatePassword() {
    console.log("Current Password : " + currentPassword);
    console.log("New Password : " + newPassword);
    try {
      let userCredential = await updateUserPassword(
        currentUser,
        currentPassword,
        newPassword
      );
      clear();
      present({
        buttons: [{ text: "dismiss", handler: () => dismiss() }],
        message: "Password updated successfully",
        duration: 3000,
        color: "success",
      });
    } catch (e: any) {
      console.log("Error : " + e);
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
    setNewPassword("");
  }

  return (
    <IonCard className="profile-form-card">
      <IonLabel color="dark" position="floating">
        CurrentPassword:{" "}
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

      <IonLabel color="dark" position="floating">
        NewPassword:{" "}
      </IonLabel>
      <IonInput
        className="login-input profile-form-input-width"
        value={newPassword}
        type="password"
        onIonChange={(val) => {
          const newPassword = val.detail.value;
          if (newPassword) {
            setNewPassword(newPassword);
          }
        }}
      />
      <IonButton
        color="secondary"
        onClick={() => {
          updatePassword();
        }}
      >
        Update
      </IonButton>
    </IonCard>
  );
};

export default ProfileChangePassword;
