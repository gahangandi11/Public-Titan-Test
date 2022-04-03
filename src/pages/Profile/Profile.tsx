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
import Header from "../../components/Header/Header";
import { useAuth } from "../../services/contexts/AuthContext/AuthContext";
import { personCircleOutline } from "ionicons/icons";
import {
  ProfileActionsProps,
  ProfileActionType,
} from "../../interfaces/ProfileData";
import ProfileActions from "./ProfileActions";
import ProfileInfo from "./ProfileDetail";
import ProfileHeader from "./ProfileHeader";
import ProfileChangeEmail from "./ProfileChangeEmail";
import ProfileChangePassword from "./ProfileChangePassword";

const Profile: React.FC = () => {
  const [profileAction, setProfileAction] = useState<ProfileActionType>(
    ProfileActionType.PROFILE_DETAIL
  );

  return (
    <IonPage color="light">
      <Header title="Profile" hideProfileButton={true} />
      <IonContent>
        <IonGrid>
          <IonRow>
            <ProfileHeader />
          </IonRow>
          <IonRow>
            <IonCol>
              {profileAction == ProfileActionType.PROFILE_DETAIL && (
                <ProfileInfo />
              )}

              {profileAction == ProfileActionType.CHANGE_EMAIL && (
                <ProfileChangeEmail />
              )}
              {profileAction == ProfileActionType.CHANGE_PASSWORD && (
                <ProfileChangePassword />
              )}
            </IonCol>

            <IonCol size="auto">
              <ProfileActions onActionTapped={setProfileAction} />
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
