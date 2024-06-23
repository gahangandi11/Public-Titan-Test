import React, { useEffect, useState } from 'react';
import {Redirect, Route, useHistory} from "react-router-dom";
import PropTypes from 'prop-types';
import { getCurrentUser } from '../../services/contexts/AuthContext/AuthContext';
import { getUserDocumentRef, updateRenewalStatus } from '../../services/firestoreService';
import { getDoc, onSnapshot } from 'firebase/firestore';
import { User } from '../../interfaces/User';
import { useAuth } from '../../services/contexts/AuthContext/AuthContext';
import { set } from 'date-fns';

const RoleRouteGuard: React.FC<any> = ({ children, ...rest }) => {
    const userExists = localStorage.getItem("authKey");
    const userAuth = getCurrentUser();
    const history = useHistory();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [userRole, setUserRole] = useState<boolean>(false);

    useEffect(() => {
        let unsubscribe: (() => void) | undefined;
        async function fetchUserData() {
          if (userAuth) {    
            const doc = await getDoc(getUserDocumentRef(userAuth.uid));
            if (doc.exists()) {
              const document = doc.data() as User;
              
            const currentDate = new Date();
            const renewalDate = document.renewalDate ? new Date(document.renewalDate) : new Date();
            const isAdmin=document.admin;
            const Role=document.fullAccess ?? false;
            setUserRole(Role);
            setIsLoading(false);
              if(!isAdmin && currentDate > renewalDate){
                updateRenewalStatus(document.uid,true);
                history.push("/renewaccount");
              }
            }

            unsubscribe = onSnapshot(getUserDocumentRef(userAuth!.uid), (doc) => {
              const data = doc.data();
              if (data) {
                const document = data as User;
                if (document.requiresRenewal ) {
                  history.push("/renewaccount");
                }
              }
            });
          }
        }
        fetchUserData();
        return () => {
          if (unsubscribe) {
            unsubscribe();
          }
        };
      }, [userAuth, history]);

    if(isLoading){ 
        return null;
    }


    return (
        <Route {...rest}>
            {userExists ? (userRole ? children : <Redirect to="/homepage"/>) : <Redirect to="/login" />}
        </Route>
    );
};

RoleRouteGuard.propTypes = {
    children: PropTypes.node.isRequired
};

export default RoleRouteGuard;
