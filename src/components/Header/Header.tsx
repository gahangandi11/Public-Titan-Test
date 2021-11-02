import * as React from 'react';
import {IonButtons, IonHeader, IonMenuButton, IonTitle, IonToolbar} from '@ionic/react';

interface HeaderProps {
    title: string;
}

const Header: React.FC<HeaderProps> = (props: HeaderProps) => {
    return(
        <IonHeader>
            <IonToolbar color="medium">
                <IonButtons slot="start"><IonMenuButton menu="main"/></IonButtons><IonTitle>{props.title}</IonTitle>
            </IonToolbar>
        </IonHeader>
    );
};

export default Header;
