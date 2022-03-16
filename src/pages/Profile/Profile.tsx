import React, {
  KeyboardEventHandler,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  IonAvatar,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonImg,
  IonInput,
  IonLabel,
  IonPage,
  IonRow,
  IonText,
  IonTitle,
  useIonToast,
} from "@ionic/react";
import { useHistory } from "react-router";
import "./Profile.css";
import Header from "../../components/Header/Header";
import { User } from "../../interfaces/User";
import { getUserByID } from "../../services/firestoreService";
import { useAuth } from "../../services/contexts/AuthContext/AuthContext";
import user_icon from "../../assets/user_icon.png";

const Profile: React.FC = () => {
  const [userInfo, setUserInfo] = useState<User>();

  const user = useAuth();

  useEffect(() => {
    if (user.userDoc)
      getUserByID(user.userDoc.uid).then((user: User) => {
        setUserInfo(user);
      });
  }, []);

  
  /**
   * If user has any other information than email that can be shown then evaluate the userInfo object
   * @returns true, if user has any related info that can be shown otherwise false
   */
  const hasDetail = () => {
    return false;
  };

  return (
    <IonPage color="light">
      <Header title="Profile"
       hideProfileButton={true} 
      />
      <IonContent>
        <IonGrid className="profile-header">
          <IonRow>
            <IonCol>
              <IonAvatar className="profile-image-container">
                <img src={user_icon} />
              </IonAvatar>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol className="center-text">
              <IonText mode="ios" color="primary">
                <h1>{userInfo?.email}</h1>
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
                <IonLabel>Name : {userInfo?.displayName}</IonLabel>
              </IonRow>
            </IonGrid>
          </IonCard>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Profile;
