import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';

const auth = getAuth();

export async function emailLogin(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password);
}

export function logout() {
    return auth.signOut();
}