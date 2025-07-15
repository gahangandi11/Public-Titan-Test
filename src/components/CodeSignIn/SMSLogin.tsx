import * as React from 'react';
import { useState } from 'react';
import TitanT from "../../assets/icon/favicon.png";
import {
  IonButton,IonCardHeader,IonFooter, IonImg, IonLabel,
} from '@ionic/react';
import Code from '../Code/Code';
import '../../pages/Login/Login.css';

type CodeProps = {
  getCode: (code: string) => void;
};

const SMSLogin: React.FC<CodeProps> = ({ getCode }) => {
  const [code, setCode] = useState('');
  return (
    <>
      <IonCardHeader className="titan-container">
        <IonImg className="titan-t" src={TitanT} />
        <IonLabel color="light">Enter OTP sent to your mobile</IonLabel>
      </IonCardHeader>
      <div className='sms-login'>
        <Code code={code} setCode={setCode} />
      </div>
      <IonFooter className="buttons-footer">
        <IonButton
          color="secondary"
          onClick={() => { getCode(code) }}
        >
          Submit
        </IonButton>
        <IonButton color="secondary" href="/login">Back to Login</IonButton>
      </IonFooter>
    </>
  );
};

export default SMSLogin;
