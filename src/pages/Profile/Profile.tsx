
import React, {
  useEffect, useState
} from "react";
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
  IonText, IonToggle,
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
import { getNewUsers, verifyUser } from "../../services/firestoreService";
import { User } from "../../interfaces/User";

const Profile: React.FC = () => {
  const [profileAction, setProfileAction] = useState<ProfileQuickActionType>(
    ProfileQuickActionType.PROFILE_DETAIL
  );
  const [refreshSiblingComponents, refreshAllProfileSiblingComponents] =
    useState(false);

    const { currentUser, userDoc } = useAuth();

  const [newUsers, setNewUsers] = useState<User[]>([]);

  function onRefreshProfileRequestReceived() {
    refreshAllProfileSiblingComponents(!refreshSiblingComponents);
  }


  function changeUserStatus(user: User) {
    verifyUser(user);
  }

  useEffect(() => {
    getNewUsers().then(docs => {
      setNewUsers(docs);
    })
  }, []);

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
            { userDoc?.admin && <IonCol>
              <IonText>Users awaiting verification: </IonText><br /><br />
              {newUsers.map((user, index) => {
                return(
                    <div className="user-status" key={index}>
                      <IonText>
                        {user.email}
                      </IonText>

                      <IonToggle checked={user.verified} onIonChange={() => changeUserStatus(user)} />

                      <br /><br />
                    </div>
                );
              })}
            </IonCol>}
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
