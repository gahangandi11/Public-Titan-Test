import React, { useEffect } from 'react';
import {Redirect, Route, useHistory} from "react-router-dom";
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
    // const { userDoc } = useAuth();
    // console.log("User doc: "); 
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


    return (
        <Route {...rest}>
            {userExists ? (children) : <Redirect to="/login" />}
        </Route>
    );
};

RouteGuard.propTypes = {
    children: PropTypes.node.isRequired
};

export default RouteGuard;
