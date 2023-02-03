import {initializeApp} from 'firebase/app';

export const firebaseConfig = {
    apiKey: `${process.env.REACT_APP_FIREBASE_API_KEY}`,
    authDomain: "titan-49df0.firebaseapp.com",
    databaseURL: "https://titan-49df0-default-rtdb.firebaseio.com",
    projectId: "titan-49df0",
    storageBucket: "titan-49df0.appspot.com",
    messagingSenderId: "506719603582",
    appId: "1:506719603582:web:129e08c7fe7b7e5d26412f",
    measurementId: "G-HX3HWTZQH5"
};

export const app = initializeApp(firebaseConfig);

