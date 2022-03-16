import * as React from 'react';
import {createContext, useContext, useEffect, useState} from 'react';
import {getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword} from 'firebase/auth';
import {getUserByID} from '../../firestoreService';

const auth = getAuth();
const AuthContext = createContext<{currentUser: any, userDoc: any, value: string}>({currentUser: null, userDoc: null, value: ""});

export function emailLogin(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
}

export function emailSignup(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password);
}

export function logout() {
    return auth.signOut();
}

export function useAuth() {
    return useContext(AuthContext);
}

export function watchUser() {
    return auth;
}


const AuthProvider: React.FC = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [userDoc, setUserDoc] = useState<any>(null);

    useEffect(() => {
        return auth.onAuthStateChanged(user => {
            setCurrentUser(user);
            if (user) {
                localStorage.setItem("authKey", user.uid);
                getUserByID(user.uid).then(doc => {
                    setUserDoc(doc);
                });
            } else {
                localStorage.removeItem("authKey");
            }
        });
    }, []);

    const value = {
        currentUser: currentUser,
        userDoc: userDoc,
        value: ""
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
};

export default AuthProvider;
