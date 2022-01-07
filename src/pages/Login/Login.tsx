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
import {emailLogin, emailSignup} from '../../services/firebaseAuthService';
import {useHistory} from 'react-router';
import './Login.css'
import TitanT from '../../assets/icon/favicon.png';
import {getUser, watchUser} from '../../firebaseConfig';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [checkPassword, setCheckPassword] = useState('');
    const history = useHistory();
    const [signup, setSignup] = useState(false);
    const [present, dismiss] = useIonToast();

    function clear() {
        setEmail('');
        setPassword('');
        setCheckPassword('');
    }

    return (
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
                            {!signup && <IonButton color="secondary" onClick={() => {
                                emailLogin(email, password).then((res) => {
                                    clear();
                                    // @ts-ignore
                                    sessionStorage.setItem('Auth Token', res._tokenResponse.refreshToken);
                                    getUser().then(() => {
                                        history.push('/home');
                                    });
                                }).catch((e) => {
                                    present({
                                        buttons: [{text: 'dismiss', handler: () => dismiss()}],
                                        message: e,
                                        duration: 5000,
                                        color: 'danger'
                                    })
                                });
                            }}>Login</IonButton>}
                            {signup && <IonButton color="secondary" onClick={() => {
                                if (password === checkPassword) {
                                    emailSignup(email, password).then((res) => {
                                        clear();
                                        //@ts-ignore
                                        sessionStorage.setItem('Auth Token', res._tokenResponse.refreshToken);
                                        getUser().then(() => {
                                            history.push('/home');
                                        });
                                    }).catch((e) => {
                                        present({
                                            buttons: [{text: 'dismiss', handler: () => dismiss()}],
                                            message: e,
                                            duration: 5000,
                                            color: 'danger'
                                        })
                                    });
                                } else {
                                    present({
                                        buttons: [{text: 'dismiss', handler: () => dismiss()}],
                                        message: 'Passwords do not match.',
                                        duration: 5000,
                                        color: 'danger'
                                    })
                                }
                            }}>
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
    );
};

export default Login;
