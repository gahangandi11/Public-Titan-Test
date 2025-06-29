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
  UserCredential,multiFactor, PhoneAuthProvider, PhoneMultiFactorGenerator,
  MultiFactorResolver,
  getMultiFactorResolver,
  ApplicationVerifier,
  MultiFactorError
} from "firebase/auth";
import { getUserByID, } from "../../firestoreService";
import { sendPasswordResetEmail,getRedirectResult } from "firebase/auth";
import { getRolePermissions } from "../../firestoreService";
import useUpdateLastInActive from "../../../hooks/useUpdateLastActive/useUpdateLastActive";

const auth = getAuth();
const AuthContext = createContext<{
  currentUser: any;
  userDoc: any;
  permissions: string [] | null;
  value: string;
}>({ currentUser: null, userDoc: null, permissions: null, value: "" });

export async function emailLogin(email: string, password:string) :Promise<UserCredential>{
  return signInWithEmailAndPassword(auth, email, password);
}


export function getCurrentUser(): User|null {
    return auth.currentUser;
  }


export function isEmailVerifiedByUser(): boolean {
  if (auth.currentUser == null) return false;
  return auth.currentUser?.emailVerified;
}

export async function emailSignup(email: string, password: string) : Promise<UserCredential> {
  return createUserWithEmailAndPassword(auth, email, password);
}

export async function sendEmailVerfication(redirectURl:string) : Promise<void> {
    
  if (!auth.currentUser) {
    throw new Error('No authenticated user found');
  }
  return sendEmailVerification(auth.currentUser, {
    url: redirectURl,
    handleCodeInApp: false
  });
}

export async function resetPassword(email: string): Promise<void> {
  const redirect = window.location.href.replace("/forgotPassword", "/login");
  return sendPasswordResetEmail(auth, email, { url: redirect });
}

export async function logout() : Promise<void> {
  return auth.signOut();
}

export function checkIfVerificationIsRequired():boolean
{
    return false;
}

export function useAuth()  {
  return useContext(AuthContext);
}

export function watchUser()  {
  return auth;
}

export async function updateUserPassword(
  user: User,
  currentPassword: string,
  newPassword: string
) : Promise<void> {
  
  if (!user.email) {
    throw new Error('User email is required for password update');
  }

  try {
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
}

export async function updateUserEmail(
  user: User,
  newEmail: string,
  currentPassword: string
) : Promise<void> {
  
  if (!user.email) {
    throw new Error('User email is required for email update');
  }

  try {
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    await updateEmail(user, newEmail);
  } catch (error) {
    console.error('Error updating email:', error);
    throw error;
  }
}


export function getReidrectedUrl(
  
):Promise<UserCredential|null> {
    return getRedirectResult(auth);
}


export async function verifyUserMFA (error: MultiFactorError, 
  recaptchaVerifier: ApplicationVerifier, 
  selectedIndex: number) : Promise<false | {verificationId: string, resolver: MultiFactorResolver} | void> {
  const resolver = getMultiFactorResolver(auth, error);
  if(resolver.hints[selectedIndex].factorId === PhoneMultiFactorGenerator.FACTOR_ID) {
    const phoneInfoOptions = {
      multiFactorHint: resolver.hints[selectedIndex],
      session: resolver.session
    };
    const phoneAuthProvider = new PhoneAuthProvider(auth);
    try{
      const verificationId = await phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, recaptchaVerifier);
      return {verificationId, resolver}
    }catch(e)
    {
      console.error("Error verifying user MFA:", e);
      return false;
    }
  }
}

export async function verifyUserEnrolled(verificationMFA :{verificationId: string, resolver: MultiFactorResolver}, 
  verificationCode: string): Promise<boolean> {

   const {verificationId, resolver} = verificationMFA;

   const credential = PhoneAuthProvider.credential(verificationId, verificationCode);

   const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(credential);

   try{
     await resolver.resolveSignIn(multiFactorAssertion);
     return true;
   }catch(e)
   {
     return false;
   }

}

export async function verifyPhoneNumber(phoneNumber:string, 
  recaptchaVerifier:ApplicationVerifier):Promise<false | string> {

  const user= auth.currentUser;

  if (!user) throw new Error("No user logged in");
  
  const session = await multiFactor(user).getSession();
  const phoneInfoOptions = {
    phoneNumber,
    session
  };

  const phoneAuthProvider = new PhoneAuthProvider(auth);
  try{
    return await phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, recaptchaVerifier);
  }catch(e)
  {
    console.error("Error verifying phone number:", e);
    return false;
  }
}


export async function enrollUser(verificationCodeId: string, verificationCode: string): Promise<boolean> {

  const user = auth.currentUser;
  if (!user) {
    console.error("No user logged in");
    return false;
  }
  
  const phoneAuthCredential = PhoneAuthProvider.credential(verificationCodeId, verificationCode);
  const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(phoneAuthCredential);
  
  try {
    await multiFactor(user).enroll(multiFactorAssertion, "Phone Number");
    return true;
  } catch (error) {
    console.error("Error enrolling user:", error);
    return false;
  }

}



const AuthProvider: React.FC = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userDoc, setUserDoc] = useState<any>(null);
  const [permissions, setPermissions] = useState<string [] | null>([]);
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  
  useUpdateLastInActive(1000 * 60 * 1); 

  useEffect(() => {
     const unsubscribe= auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      if (user) {
        localStorage.setItem("authKey", user.uid);
        const doc = await getUserByID(user.uid);
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


  const value = useMemo(() => {
    return {
      currentUser: currentUser,
      userDoc: userDoc,
      permissions: permissions,
      value: "",
    };
  }, [ userDoc,permissions, currentUser])


  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export default AuthProvider;
