import {getAuth, User} from 'firebase/auth';
import {initializeApp} from 'firebase/app';

export const firebaseConfig = {
    apiKey: `${process.env.REACT_APP_FIREBASE_API_KEY}`,
    authDomain: "ridsi-13389.firebaseapp.com",
    databaseURL: "https://ridsi-13389-default-rtdb.firebaseio.com",
    projectId: "ridsi-13389",
    storageBucket: "ridsi-13389.appspot.com",
    messagingSenderId: "1077534661299",
    appId: "1:1077534661299:web:a9445d356ef5022b4aeec6",
    measurementId: "G-LP7RW6V2BM"
};

export const app = initializeApp(firebaseConfig);

let fireUser: User | null = null;
const auth = getAuth();
auth.onAuthStateChanged(user => {
    fireUser = user;
});

export function watchUser() {
    return auth;
}

export function getUser() {
    return fireUser;
}
