import * as React from "react";
import {
  IonButtons,
  IonButton,
  IonIcon,
  IonHeader,
  IonMenuButton,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { personCircleOutline } from "ionicons/icons";
import { useHistory } from "react-router-dom";


interface HeaderProps {
  title: string;
  hideProfileButton?:boolean;
}

const Header: React.FC<HeaderProps> = (props: HeaderProps) => {

    let history = useHistory()

  let onProfileBtnTapped=()=>{
    history.push('/profile')
  }  
  return (
    <IonHeader>
      <IonToolbar color="medium">
        <IonButtons slot="start">
          <IonMenuButton menu="main" />
        </IonButtons>
        <IonTitle>{props.title}</IonTitle>
        {
            (props.hideProfileButton===undefined||!props.hideProfileButton)&&
        <IonButtons slot="end">
          <IonButton onClick={onProfileBtnTapped}>
            <IonIcon slot="icon-only" icon={personCircleOutline} />
          </IonButton>
        </IonButtons>
}
      </IonToolbar>
    </IonHeader>
  );
};

export default Header;
