import React, {
  useEffect, useState
} from "react";
import {
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
import {getNewUsers, verifyUser} from '../../services/firestoreService';
import {User} from '../../interfaces/User';

const Profile: React.FC = () => {
  const { currentUser, userDoc } = useAuth();

  const [newUsers, setNewUsers] = useState<User[]>([]);
  /**
   * If user has any other information than email that can be shown then evaluate the userInfo object
   * @returns true, if user has any related info that can be shown otherwise false
   */
  const hasDetail = () => {
    return false;
  };

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
                <h1>{currentUser?.email}</h1>
              </IonText>
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

        {hasDetail() && (
          <IonCard className="profile-detail-card">
            <IonGrid>
              <IonRow>
                <IonLabel>Details</IonLabel>
              </IonRow>
              <IonRow className="detail-label-container">
                <IonLabel>Name : {currentUser?.displayName}</IonLabel>
              </IonRow>
            </IonGrid>
          </IonCard>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Profile;
