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
import {
  ProfileUpdateAction,
  ProfileQuickActionType,
} from "../../interfaces/ProfileData";

const ProfileChangeEmailOrPassword: React.FC<ProfileUpdateAction> = (props) => {
  const { currentUser } = useAuth();
  const [present, dismiss] = useIonToast();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

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
    setNewEmail("");
    setNewPassword("");
  }

  return (
    <IonCard className="profile-form-card">
      {props.actionType == ProfileQuickActionType.CHANGE_EMAIL && (
        <div>
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
        </div>
      )}

      {props.actionType == ProfileQuickActionType.CHANGE_PASSWORD && (
        <div>
          <IonLabel color="dark" position="floating">
            New Password:{" "}
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
        </div>
      )}

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
          if (props.actionType == ProfileQuickActionType.CHANGE_EMAIL)
            updateEmail();
          else if (props.actionType == ProfileQuickActionType.CHANGE_PASSWORD)
            updatePassword();
        }}>
        Update
      </IonButton>
    </IonCard>
  );
};

export default ProfileChangeEmailOrPassword;
