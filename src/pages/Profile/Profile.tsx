import React, { useEffect, useState } from "react";
import {
  IonButton,
  IonCard,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonItem,
  IonLabel,
  IonPage,
  IonRow,
  IonText,
  IonToggle,
} from "@ionic/react";

import { Button } from "@material-ui/core";
import "./Profile.css";
import Header from "../../components/Header/Header";
import { useAuth } from "../../services/contexts/AuthContext/AuthContext";
import { personCircleOutline, send } from "ionicons/icons";
import {
  ProfileQuickActionsProps,
  ProfileQuickActionType,
} from "../../interfaces/ProfileData";
import ProfileActions from "./ProfileActions";
import ProfileInfo from "./ProfileDetail";
import ProfileHeader from "./ProfileHeader";
import ProfileChangeEmailOrPassword from "./ProfileChangeEmailOrPassword";
import { getNewUsers, verifyUser, reverifyUser, setNewrenewalDate, deleteDocument, getreverifyUsers, setUserRole, sendApprovalEmail} from "../../services/firestoreService";
import { User } from "../../interfaces/User";
import UserList from "./UserList";
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import Notification from "../../components/notifications/notification";
import CreateRoles from "./CreateRoles";


const Profile: React.FC = () => {
  const [profileAction, setProfileAction] = useState<ProfileQuickActionType>(
    ProfileQuickActionType.PROFILE_DETAIL
  );
  const [refreshSiblingComponents, refreshAllProfileSiblingComponents] =
    useState(false);

  const { currentUser, userDoc } = useAuth();

  const [newUsers, setNewUsers] = useState<User[]>([]);

  const [reverifyUsers, setreverifyUsers] = useState<User[]>([]);
  const [access, setAccess] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  console.log('access', access);
  function onRefreshProfileRequestReceived() {
    refreshAllProfileSiblingComponents(!refreshSiblingComponents);
  }

  async function changeUserStatus(user: User) {

    setShowNotification(true);
    verifyUser(user);
    setUserRole(user, access);
    sendApprovalEmail(user);
    setTimeout(function () {
      refreshUserList();
      // window.alert('User is approved');
    }, 1000);
   
  }


  function reverifyUserStatus(user: User) {
    const renewalstatus = false;
    reverifyUser(user, renewalstatus);
    setNewrenewalDate(user);
    setTimeout(function () {
      refreshReVerifyUserList();
    }, 1000);
  }


  function removeUser(user: User) {
    deleteDocument(user);
    setTimeout(function () {
      refreshUserList();
    }, 1000);

   }

  useEffect(() => {
    refreshUserList();
    refreshReVerifyUserList();
    console.log('component called');
  }, []);

  function refreshUserList() {
    getNewUsers().then((docs) => {
      setNewUsers(docs);
    });
  }

  function refreshReVerifyUserList() {
    getreverifyUsers().then((docs) => {
      setreverifyUsers(docs);
    });
  }

  const [value, setValue] = React.useState('1');
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <IonPage color="light">
      <Header title="Profile" hideProfileButton={true} />
      {showNotification && <Notification setShowNotification={setShowNotification}/>}
      <IonContent>
        <IonGrid>
          <IonRow>
            <ProfileHeader />
            <IonCol size="auto">
               <ProfileActions refreshUserList={refreshUserList} onActionTapped={setProfileAction} />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              {profileAction == ProfileQuickActionType.PROFILE_DETAIL && (
                <ProfileInfo />
              )}

              {(profileAction == ProfileQuickActionType.CHANGE_EMAIL ||
                profileAction == ProfileQuickActionType.CHANGE_PASSWORD) && (
                <ProfileChangeEmailOrPassword
                  actionType={profileAction}
                  onProfileSegmentUpdated={onRefreshProfileRequestReceived}
                />
              )}
                {userDoc?.admin && profileAction == ProfileQuickActionType.ADMIN_SETTING && (
                <div>
                  <Box sx={{ width: '100%', typography: 'body1' }}>
                          <TabContext value={value}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor:'aliceblue', margin:'1em', marginBottom:'0em' }}>
                              <TabList onChange={handleChange} aria-label="lab API tabs example">
                                <Tab label="Users Awaiting Verification" value="1" />
                                <Tab label="Users Awaiting Re-verification" value="2" />
                              </TabList>
                              
                            </Box>
                            <TabPanel value="1">
                              <UserList newUsers={newUsers} access={access} setAccess={setAccess} changeUserStatus={changeUserStatus} removeUser={removeUser}/>
                            </TabPanel>
                            <TabPanel value="2">
                              <UserList newUsers={reverifyUsers} access={access} setAccess={setAccess} changeUserStatus={reverifyUserStatus} removeUser={removeUser}/>
                            </TabPanel>
                          </TabContext>
                        </Box>
                  
                 
                </div>
              )}
              {userDoc?.admin && profileAction == ProfileQuickActionType.CREATE_ROLES && (
                  <CreateRoles/>
              )}
            </IonCol>
          
            {/* <IonCol size="auto">
              <ProfileActions onActionTapped={setProfileAction} />
            </IonCol> */}
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Profile;







            {/* { userDoc?.admin && <IonCol>
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
            </IonCol>} */}