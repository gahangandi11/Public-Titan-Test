import React, { useEffect, useState } from "react";
import {IonCol,IonContent,IonGrid,IonPage,IonRow} from "@ionic/react";
import { useAuth } from "../../services/contexts/AuthContext/AuthContext";
import {ProfileQuickActionType,} from "../../interfaces/ProfileData";
import ProfileActions from "./ProfileActions";
import ProfileInfo from "./ProfileDetail";
import ProfileHeader from "./ProfileHeader";
import ProfileChangeEmailOrPassword from "./ProfileChangeEmailOrPassword";
import { getNewUsers, verifyUser, reverifyUser, setNewrenewalDate, deleteDocument, getreverifyUsers, 
  setUserRole, sendApprovalEmail, sendRejectionEmail} from "../../services/firestoreService";
import { User } from "../../interfaces/User";
import UserList from "../../components/UserList/UserList";
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Notification from "../../components/notifications/notification";
import CreateRoles from "../../components/CreateRoles/CreateRoles";
import { DeleteUserFromAuth } from "../../services/firestoreService";
import Header from "../../components/Header/Header";
import "./Profile.css";

interface NotificationProps {
  message: string;
  color: string;
}


const Profile: React.FC = () => {

  const {userDoc } = useAuth();

  const [profileAction, setProfileAction] = useState<ProfileQuickActionType>(ProfileQuickActionType.PROFILE_DETAIL);
  const [refreshSiblingComponents, refreshAllProfileSiblingComponents] =useState(false);

  const [newUsers, setNewUsers] = useState<User[]>([]);
  const [reverifyUsers, setreverifyUsers] = useState<User[]>([]);

  const [access, setAccess] = useState('');
  const [value, setValue] = React.useState('1');

  const [showNotification, setShowNotification] = useState(false);
  const [NotificationProperties, setNotificationProperties] = useState<NotificationProps>({'message':'','color': ''});
  const [userDeleteMessae,setUserDeleteMessage] = useState<string>('');
  const [operation_loading,setOperation_Loading]=useState<boolean>(false);

  useEffect(() => {
    refreshUserList();
    refreshReVerifyUserList();
  }, []);

 
  function onRefreshProfileRequestReceived() {
    refreshAllProfileSiblingComponents(!refreshSiblingComponents);
  }

  async function changeUserStatus(user: User) {
    setNotificationProperties({'message':'User Approved Successfully','color':'green'})
    setOperation_Loading(true);
    await verifyUser(user);
    await setUserRole(user, access);
    await sendApprovalEmail(user);
    await refreshUserList();
    setOperation_Loading(false);
    setShowNotification(true);
  }


  async function reverifyUserStatus(user: User) {
    const renewalstatus = false;
    await reverifyUser(user, renewalstatus);
    await setNewrenewalDate(user);
    await refreshReVerifyUserList();
    setNotificationProperties({'message':'User Re-Verified Successfully','color':'green'})
    setShowNotification(true);
  }


  async function removeUser(user: User) {
    setNotificationProperties({'message':'User Deleted Successfully','color':'red'})
    setOperation_Loading(true);
    await sendRejectionEmail(user, userDeleteMessae);
    await DeleteUserFromAuth(user.uid);
    await deleteDocument(user);
    await refreshUserList();
    await refreshReVerifyUserList();
    setOperation_Loading(false);
    setShowNotification(true);
    }


  async function refreshUserList() {
    await getNewUsers().then((docs) => {
      setNewUsers(docs);
    });
  }

  async function refreshReVerifyUserList() {
    await getreverifyUsers().then((docs) => {
      setreverifyUsers(docs);
    });
  }

  
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <IonPage color="light">
      <Header title="Profile" hideProfileButton={true} />
      {(showNotification || operation_loading) && (<Notification setShowNotification={setShowNotification} NotificationProperties={NotificationProperties} operation_loading={operation_loading}/>)}
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
                              <UserList newUsers={newUsers}  setAccess={setAccess} changeUserStatus={changeUserStatus} removeUser={removeUser} setUserDeleteMessage={setUserDeleteMessage} value={value}/>
                            </TabPanel>
                            <TabPanel value="2">
                              <UserList newUsers={reverifyUsers}  setAccess={setAccess} changeUserStatus={reverifyUserStatus} removeUser={removeUser} setUserDeleteMessage={setUserDeleteMessage} value={value}/>
                            </TabPanel>
                          </TabContext>
                        </Box>
                  
                 
                </div>
              )}
              {userDoc?.admin && profileAction == ProfileQuickActionType.CREATE_ROLES && (
                  <CreateRoles/>
              )}
            </IonCol>
      
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Profile;

