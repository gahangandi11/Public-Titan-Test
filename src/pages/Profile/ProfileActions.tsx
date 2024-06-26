import React from "react";
import {
  IonCard,
  IonItem,
  IonItemDivider,
  IonLabel,
} from "@ionic/react";
import "./Profile.css";
import { ProfileQuickActionsProps, ProfileQuickActionType } from "../../interfaces/ProfileData";
import { getCurrentUser, useAuth } from "../../services/contexts/AuthContext/AuthContext";

const ProfileActions: React.FC<ProfileQuickActionsProps> = (props) => {
  const { currentUser, userDoc } = useAuth();

     function onEmailTapped(){
                props.onActionTapped(ProfileQuickActionType.CHANGE_EMAIL);
    }

     function onPasswordTapped(){
                props.onActionTapped(ProfileQuickActionType.CHANGE_PASSWORD);
    }

     function onProfileDetail(){
                props.onActionTapped(ProfileQuickActionType.PROFILE_DETAIL);
    }
     function onAdminSettingTapped(){
                props.onActionTapped(ProfileQuickActionType.ADMIN_SETTING);
                props.refreshUserList();
    }
    function RefreshUserList(){
      props.refreshUserList();
}
    

  return (
    <IonCard className="profile-card">
      <IonItemDivider
      color="white"
        className="quick-nav-title"
        sticky={true}>
        <IonLabel color="primary">Quick Navigation</IonLabel>
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
      { (userDoc?.admin) && <IonItem onClick={onAdminSettingTapped} button={true}>
        <IonLabel>Verify Users</IonLabel>
      </IonItem>
}
{ (userDoc?.admin) && <IonItem onClick={RefreshUserList} button={true}>
        <IonLabel>Refresh Users List</IonLabel>
      </IonItem>
}
    </IonCard>
  );
};

export default ProfileActions;
