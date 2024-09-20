import * as React from "react";
import { createContext, useContext, useEffect, useState, useMemo } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updatePassword,
  updateEmail,
  User,
  reauthenticateWithCredential,
  EmailAuthProvider,
  sendEmailVerification,
  UserCredential,
} from "firebase/auth";
import { getUserByID, } from "../../firestoreService";
import { sendPasswordResetEmail,getRedirectResult } from "firebase/auth";

import { getRolePermissions } from "../../firestoreService";

const auth = getAuth();
const AuthContext = createContext<{
  currentUser: any;
  userDoc: any;
  permissions: string [] | null;
  value: string;
}>({ currentUser: null, userDoc: null, permissions: null, value: "" });

export function emailLogin(email: string, password:string) {
  return signInWithEmailAndPassword(auth, email, password);
}


export function getCurrentUser(): User|null {
    return auth.currentUser;
  }


export function isEmailVerifiedByUser(): boolean {
  if (auth.currentUser == null) return false;
  return auth.currentUser?.emailVerified;
}

export function emailSignup(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export function sendEmailVerfication(redirectURl:string) {
    
  return sendEmailVerification(auth.currentUser!,{
    url: redirectURl,
    handleCodeInApp: false
  });
}

export function resetPassword(email: string): Promise<void> {
  const redirect = window.location.href.replace("/forgotPassword", "/login");
  return sendPasswordResetEmail(auth, email, { url: redirect });
}

export function logout() {
  return auth.signOut();
}

export function checkIfVerificationIsRequired():boolean
{
    return false;
}

export function useAuth() {
  return useContext(AuthContext);
}

export function watchUser() {
  return auth;
}

export function updateUserPassword(
  user: User,
  currentPassword: string,
  newPassword: string
) {
  const credential = EmailAuthProvider.credential(user.email!, currentPassword);
  return reauthenticateWithCredential(user, credential).then(
    (userCredential) => {
      return updatePassword(user, newPassword);
    }
  );
}

export function updateUserEmail(
  user: User,
  newEmail: string,
  currentPassword: string
) {
  const credential = EmailAuthProvider.credential(user.email!, currentPassword);
  return reauthenticateWithCredential(user, credential).then(
    (userCredential) => {
      return updateEmail(user, newEmail);
    }
  );
}
export function getReidrectedUrl(
  
):Promise<UserCredential|null> {
    return getRedirectResult(auth);
}



const AuthProvider: React.FC = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userDoc, setUserDoc] = useState<any>(null);
  const [permissions, setPermissions] = useState<string [] | null>([]);
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  useEffect(() => {
     const unsubscribe= auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      if (user) {
        localStorage.setItem("authKey", user.uid);
        const doc = await getUserByID(user.uid);
        console.log('printing doc......',doc)
        setUserDoc(doc);       
        if(doc && doc?.role!='')
          {
            const data = await getRolePermissions(doc.role);
            setPermissions(data?.permissions || []);
          }
          setLoading(false);
      } 
      else {
        localStorage.removeItem("authKey"); 
        setLoading(false);
      }
    });
    return () => {
      unsubscribe(); // Clean up the listener when the component unmounts
    };
  }, []);

  // const value = {
  //   currentUser: currentUser,
  //   userDoc: userDoc,
  //   permissions: permissions,
  //   loading: loading,
  //   value: "",
  // };

  const value = useMemo(() => {
    return {
      currentUser: currentUser,
      userDoc: userDoc,
      permissions: permissions,
      value: "",
    };
  }, [ userDoc,permissions, currentUser])

  // if (loading) {
  //   return <div>Loading...</div>; // You can replace this with a spinner or your custom loader
  // }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export default AuthProvider;
