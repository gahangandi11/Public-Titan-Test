import React, { useEffect } from 'react';
import { Redirect, Route, useHistory } from "react-router-dom";
import PropTypes from 'prop-types';
import { getCurrentUser } from '../../services/contexts/AuthContext/AuthContext';
import { getUserDocumentRef, updateRenewalStatus } from '../../services/firestoreService';
import { getDoc, onSnapshot } from 'firebase/firestore';
import { User } from '../../interfaces/User';
import { useAuth } from '../../services/contexts/AuthContext/AuthContext';


const RouteGuard: React.FC<any> = ({ children, ...rest }) => {
  const userExists = localStorage.getItem("authKey");
  const userAuth = getCurrentUser();
  const history = useHistory();
  const { userDoc, permissions, loading } = useAuth();

  const UrlTitleMap = {
    '/homepage': 'HomePage',
    '/home': 'Live Data',
    '/dashboard': 'Dashboard',
    '/data': 'Data Download',
    '/myapps': 'App Center',
    '/profile': 'Profile',
    '/support': 'Support',
  }


  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    // async function fetchUserData() {
    //   if (userAuth) {
    //     const doc = await getDoc(getUserDocumentRef(userAuth.uid));
    //     if (doc.exists()) {
    //       const document = doc.data() as User;

    //       const currentDate = new Date();
    //       const renewalDate = document.renewalDate ? new Date(document.renewalDate) : new Date();
    //       const isAdmin = document.admin;
    //       if (!isAdmin && currentDate > renewalDate) {
    //         updateRenewalStatus(document.uid, true);

    //         history.push("/renewaccount");
    //       }
    //     }

    //     unsubscribe = onSnapshot(getUserDocumentRef(userAuth!.uid), (doc) => {
    //       const data = doc.data();
    //       if (data) {
    //         const document = data as User;
    //         if (document.requiresRenewal) {
    //           history.push("/renewaccount");
    //         }
    //       }
    //     });
    //   }
    // }
    // fetchUserData();
    if (userAuth) {

      if (userDoc) {
        const currentDate = new Date();
        const renewalDate = userDoc.renewalDate ? new Date(userDoc.renewalDate) : new Date();
        const isAdmin = userDoc.admin;
        if(userDoc?.requiresRenewal)
          {
          history.push("/renewaccount");
          return
            
          }
        if (!isAdmin && currentDate > renewalDate) {
          updateRenewalStatus(userDoc.uid, true);
          history.push("/renewaccount");
          return
        }
      }

      // unsubscribe = onSnapshot(getUserDocumentRef(userAuth!.uid), (doc) => {
      //   const data = doc.data();
      //   if (data) {
      //     const document = data as User;
      //     if (document.requiresRenewal) {
      //       history.push("/renewaccount");
      //     }
      //   }
      // });
    }
    // return () => {
    //   if (unsubscribe) {
    //     unsubscribe();
    //   }
    // };
  }, [userAuth, history]);


  return (
    <Route {...rest}>
      {/* {userExists ? (children) : <Redirect to="/login" />} */}
      {
        userExists ?
          permissions ?
            permissions.includes(UrlTitleMap[rest.path as keyof typeof UrlTitleMap]) ? 
              (children) 
              : <Redirect to="/homepage" />
          :<div>loading</div>
        : <Redirect to="/login" />
      }
    </Route>
  );
};

RouteGuard.propTypes = {
  children: PropTypes.node.isRequired
};

export default RouteGuard;
