import {IonContent, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonMenu, IonMenuToggle} from '@ionic/react';
import * as React from 'react';
import {gridOutline, gridSharp} from 'ionicons/icons';
import {useLocation} from 'react-router';

interface AppPage {
    url: string;
    iosIcon: string;
    mdIcon: string;
    title: string;
    link?: string;
}

const Menu = () => {
    const location = useLocation();
    const generalPages: AppPage[] = [{
        title: 'Dashboard',
        url: '/home',
        iosIcon: gridOutline,
        mdIcon: gridSharp
    }];

    return(
        <IonMenu color="medium" contentId="main" type="reveal" menuId="main" swipeGesture={false}>
            <IonContent color="medium">
                <IonList>
                    <IonListHeader color="medium">Welcome to TITAN</IonListHeader>
                    {generalPages.map((page, index) => {
                        return(
                            <IonMenuToggle key={index} autoHide={false}>
                                <IonItem color="medium" className={location.pathname === page.url ? 'selected' : ''} routerLink={page.url} routerDirection="none" lines="none" detail={false}>
                                    <IonIcon slot="start" ios={page.iosIcon} md={page.mdIcon} />
                                    <IonLabel>{page.title}</IonLabel>
                                </IonItem>
                            </IonMenuToggle>
                        );
                    })}
                </IonList>
            </IonContent>
        </IonMenu>
    );
};

export default Menu;
