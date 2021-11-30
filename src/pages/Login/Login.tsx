import React, {useState} from 'react';
import {IonButton, IonCard, IonContent, IonInput, IonLabel, IonPage} from '@ionic/react';
import {emailLogin} from '../../services/firebaseAuthService';
import {useHistory} from 'react-router';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();

    return (
        <IonPage>
            <IonContent color="dark">
                <IonCard className="ion-padding ion-margin" color="primary">
                    <IonLabel position="floating">Email: </IonLabel>
                    <IonInput onIonChange={(val) => {
                        const inputEmail = val.detail.value;
                        if (inputEmail) {
                            setEmail(inputEmail);
                        }
                    }} />
                    <IonLabel position="floating">Password: </IonLabel>
                    <IonInput onIonChange={(val) => {
                        const inputPassword = val.detail.value;
                        if (inputPassword) {
                            setPassword(inputPassword);
                        }
                    }} />
                    <IonButton color="secondary" onClick={() => {
                        emailLogin(email, password).then(() => {
                            history.push('/home');
                        })
                    }}>Login</IonButton>
                </IonCard>
            </IonContent>
        </IonPage>
    );
};

export default Login;