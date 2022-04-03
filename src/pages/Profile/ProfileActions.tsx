import React from "react";
import {
  IonCard,
  IonItem,
  IonItemDivider,
  IonLabel,
} from "@ionic/react";
import "./Profile.css";
import { ProfileActionsProps, ProfileActionType } from "../../interfaces/ProfileData";

const ProfileActions: React.FC<ProfileActionsProps> = (props) => {

     function onEmailTapped(){
                props.onActionTapped(ProfileActionType.CHANGE_EMAIL);
    }

     function onPasswordTapped(){
                props.onActionTapped(ProfileActionType.CHANGE_PASSWORD);
    }

     function onProfileDetail(){
                props.onActionTapped(ProfileActionType.PROFILE_DETAIL);
    }

  return (
    <IonCard className="profile-card">
      <IonItemDivider
        className="quick-nav-title second-step"
        color="pink"
        sticky={true}>
        <IonLabel>Quick Navigation</IonLabel>
      </IonItemDivider>
      <IonItem onClick={onProfileDetail} button={true}>
        <IonLabel>Profile Details</IonLabel>
      </IonItem>
      <IonItem onClick={onEmailTapped} button={true}>
        <IonLabel>Change Email</IonLabel>
      </IonItem>
      <IonItem onClick={onPasswordTapped} button={true}>
        <IonLabel>Change Password</IonLabel>
      </IonItem>
    </IonCard>
  );
};

export default ProfileActions;
