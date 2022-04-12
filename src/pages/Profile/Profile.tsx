import React, { useEffect, useState } from "react";
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
  ProfileQuickActionsProps,
  ProfileQuickActionType,
} from "../../interfaces/ProfileData";
import ProfileActions from "./ProfileActions";
import ProfileInfo from "./ProfileDetail";
import ProfileHeader from "./ProfileHeader";
import ProfileChangeEmailOrPassword from "./ProfileChangeEmailOrPassword";

const Profile: React.FC = () => {
  const [profileAction, setProfileAction] = useState<ProfileQuickActionType>(
    ProfileQuickActionType.PROFILE_DETAIL
  );
  const [refreshSiblingComponents, refreshAllProfileSiblingComponents] =
    useState(false);

  function onRefreshProfileRequestReceived() {
    refreshAllProfileSiblingComponents(!refreshSiblingComponents);
  }

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
              {profileAction == ProfileQuickActionType.PROFILE_DETAIL && (
                <ProfileInfo />
              )}

              {(profileAction == ProfileQuickActionType.CHANGE_EMAIL ||profileAction == ProfileQuickActionType.CHANGE_PASSWORD)  && (
                <ProfileChangeEmailOrPassword
                  actionType={profileAction}
                  onProfileSegmentUpdated={onRefreshProfileRequestReceived}
                />
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
