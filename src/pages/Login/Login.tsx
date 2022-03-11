import React, {useState} from 'react';
import {
    IonButton,
    IonCard,
    IonCardHeader,
    IonContent,
    IonFooter,
    IonImg,
    IonInput,
    IonLabel,
    IonPage, useIonToast
} from '@ionic/react';
import {useHistory} from 'react-router';
import './Login.css'
import TitanT from '../../assets/icon/favicon.png';
import AuthProvider, {emailSignup, emailLogin, useAuth} from '../../services/contexts/AuthContext/AuthContext';
import {createUser} from '../../services/firestoreService';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [checkPassword, setCheckPassword] = useState('');
    const history = useHistory();
    const [signup, setSignup] = useState(false);
    const [present, dismiss] = useIonToast();
    const { currentUser } = useAuth();

    if (currentUser) {
        history.push("/home");
    } else {
        history.push("/login");
    }

    async function login() {
        try {
            await emailLogin(email, password);
            clear();
            history.push('/home');
        } catch(e: any) {
            present({
                buttons: [{text: 'dismiss', handler: () => dismiss()}],
                message: e,
                duration: 5000,
                color: 'danger'
            });
        }
    }

    async function signupClick() {
        if (password === checkPassword) {
            try {
                const userCredential = await emailSignup(email, password);
                await createUser(userCredential);
                clear();
                history.push('/home');
            } catch(e: any) {
                present({
                    buttons: [{text: 'dismiss', handler: () => dismiss()}],
                    message: e,
                    duration: 5000,
                    color: 'danger'
                });
            }
        } else {
            present({
                buttons: [{text: 'dismiss', handler: () => dismiss()}],
                message: 'Passwords do not match.',
                duration: 5000,
                color: 'danger'
            })
        }
    }

    function clear() {
        setEmail('');
        setPassword('');
        setCheckPassword('');
    }

    return (
        <AuthProvider>
            <IonPage>
                <IonContent color="light">
                    <div className="background" />
                    <div className="card--container">
                        <IonCard className="card--login ion-padding ion-margin" color="primary">
                            <IonCardHeader className="titan-container">
                                <IonImg className="titan-t" src={TitanT} />
                                {!signup && <IonLabel color="light">Login</IonLabel>}
                                {signup && <IonLabel color="light">Sign Up</IonLabel>}
                            </IonCardHeader>
                            <IonLabel color="light" position="floating">Email: </IonLabel>
                            <IonInput className="login-input" value={email} onIonChange={(val) => {
                                const inputEmail = val.detail.value;
                                if (inputEmail) {
                                    setEmail(inputEmail);
                                }
                            }} />
                            <IonLabel color="light"  position="floating">Password: </IonLabel>
                            <IonInput className="login-input" type="password" value={password} onIonChange={(val) => {
                                const inputPassword = val.detail.value;
                                if (inputPassword) {
                                    setPassword(inputPassword);
                                }
                            }} />
                            {signup && <IonLabel color="light"  position="floating">Confirm Password: </IonLabel>}
                            {signup && <IonInput className="login-input" type="password" value={checkPassword} onIonChange={(val) => {
                                const inputCheck = val.detail.value;
                                if (inputCheck) {
                                    setCheckPassword(inputCheck);
                                }
                            }} />}
                            <IonFooter className="buttons-footer">
                                {!signup && <IonButton color="secondary" onClick={login}>Login</IonButton>}
                                {signup && <IonButton color="secondary" onClick={signupClick}>
                                    Sign Up
                                </IonButton>}
                                <IonButton color="secondary" onClick={() => {
                                    setSignup(!signup);
                                    clear();
                                }}>
                                    {!signup && <span>Sign Up</span>}
                                    {signup && <span>Back to Login</span>}
                                </IonButton>
                            </IonFooter>
                        </IonCard>
                    </div>
                </IonContent>
            </IonPage>
        </AuthProvider>
    );
};

export default Login;
