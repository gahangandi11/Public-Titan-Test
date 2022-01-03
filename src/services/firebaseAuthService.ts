import {getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword} from 'firebase/auth';

const auth = getAuth();

export function emailLogin(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
}

export function emailSignup(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password);
}

export function logout() {
    sessionStorage.removeItem('Auth Token');
    return auth.signOut();
}
