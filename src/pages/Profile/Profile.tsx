import React, {
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
  IonText,
} from "@ionic/react";
import "./Profile.css";
import Header from "../../components/Header/Header";
import { useAuth } from "../../services/contexts/AuthContext/AuthContext";
import { personCircleOutline } from "ionicons/icons";

const Profile: React.FC = () => {
  const { currentUser } = useAuth();

  /**
   * If user has any other information than email that can be shown then evaluate the userInfo object
   * @returns true, if user has any related info that can be shown otherwise false
   */
  const hasDetail = () => {
    return false;
  };

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
