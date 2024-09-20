import React, { useEffect } from 'react';
import { Redirect, Route, useHistory } from "react-router-dom";
import PropTypes from 'prop-types';
import { getCurrentUser } from '../../services/contexts/AuthContext/AuthContext';
import { getUserDocumentRef} from '../../services/firestoreService';
import { onSnapshot } from 'firebase/firestore';
import { User } from '../../interfaces/User';
import { useAuth } from '../../services/contexts/AuthContext/AuthContext';


const RouteGuard: React.FC<any> = ({ children, ...rest }) => {
  const userExists = localStorage.getItem("authKey");
  const userAuth = getCurrentUser();
  const history = useHistory();
  const { userDoc, permissions} = useAuth();

  const UrlTitleMap = {
    '/homepage': 'HomePage',
    '/home': 'Live Data',
    '/dashboard': 'Dashboard',
    '/data': 'Data Download',
    '/myapps': 'App Center',
    '/profile': 'Profile',
    '/support': 'Support',
  }
  
  const getTitleForPath = (path: string) => {
    if (path.startsWith('/app-center/')) {
      return 'App Center';  // Dynamic match for any path starting with '/myapps/'
    }
    return UrlTitleMap[path as keyof typeof UrlTitleMap] || '';  // Return the mapped title or an empty string if not found
  };

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    async function fetchUserData() {
      console.log('inside fetch.........')
      if (userAuth && userDoc) {
            console.log('inside userAuth...')
            if (!userDoc.admin && userDoc.requiresRenewal) {
              console.log('inside renew account')
                history.push("/renewaccount");
            }            
            unsubscribe = onSnapshot(getUserDocumentRef(userAuth!.uid), (doc) => {
              const data = doc.data();
              if (data) {
                const document = data as User;
                if (document.requiresRenewal) {
                  history.push("/renewaccount");
                }
              }
            });
        }
    }

    fetchUserData();

    return()=>{
      if(unsubscribe)
        {
          unsubscribe();
        }
    };
   

    
  }, [userAuth, history]);


  return (
    <Route {...rest}>
      {
        userExists ?
          permissions ?
            permissions.includes(getTitleForPath(rest.path)) ? 
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
