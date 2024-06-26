import {IonContent, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonMenu, IonMenuToggle} from '@ionic/react';
import * as React from 'react';
import {analytics, downloadOutline, downloadSharp, gridOutline, gridSharp, homeOutline, homeSharp, logOut,paperPlaneOutline} from 'ionicons/icons';
import {useLocation} from 'react-router';
import {useEffect, useState} from 'react';
import {getLinks} from '../../services/firestoreService';
import {LinkData} from '../../interfaces/LinkData';
import iconService from '../../services/iconService';
import AuthProvider, {logout, useAuth} from '../../services/contexts/AuthContext/AuthContext';

interface AppPage {
    url: string;
    iosIcon: string;
    mdIcon: string;
    title: string;
    link?: string;
    pageFullAccess?: boolean;
}

const Menu = () => {
    const { currentUser, userDoc } = useAuth();

    const location = useLocation();
    const [appCenter, setAppCenter] = useState<AppPage[]>([]);

    const generalPages: AppPage[] = [
        {
            title: 'HomePage',
            url: '/homepage',
            iosIcon: homeOutline ,
            mdIcon:homeSharp ,
            pageFullAccess: true,
        },
    {
        title: 'Live Data',
        url: '/home',
        iosIcon: iconService.getIcon('analytics', "ios"),
        mdIcon: iconService.getIcon('analytics', "android"),
        pageFullAccess: true,
    },
    {
        title: 'Dashboard',
        url: '/dashboard',
        iosIcon: gridOutline,
        mdIcon: gridSharp,
        pageFullAccess: true,
    }, {
        title: 'Data Download',
        url: '/data',
        iosIcon: downloadOutline,
        mdIcon: downloadSharp,
        pageFullAccess: false,
    },
    {
        title: 'App Center',
        url: '/myapps',
        // iosIcon: downloadOutline,
        // mdIcon: downloadSharp
        iosIcon: iconService.getIcon('apps', "ios"),
        mdIcon: iconService.getIcon('apps', "android"),
        pageFullAccess: false,
    },
    {
        title: 'Tutorials',
        url: '/tutorials',
        // iosIcon: downloadOutline,
        // mdIcon: downloadSharp
        iosIcon: iconService.getIcon('walk', "ios"),
        mdIcon: iconService.getIcon('walk', "android"),
        pageFullAccess: false,
    },
   ];

    useEffect(() => {
        if (currentUser) {
            getLinks().then((links: LinkData[]) => {
                const apps: AppPage[] = [];
                links.sort((a, b) => {
                    return a.order - b.order;
                });
                links.forEach(link => {
                    apps.push({
                        title: link.name,
                        url: "/app-center/" + link.name,
                        iosIcon: iconService.getIcon(link.icon, "ios"),
                        mdIcon: iconService.getIcon(link.icon, "android"),
                        pageFullAccess: false,
                    });
                });
                setAppCenter(apps);
            });
        }
    }, [currentUser]);

    return(
        <AuthProvider>
            <IonMenu color="medium" contentId="main" type="reveal" menuId="main" swipeGesture={false}>
                <IonContent color="medium">
                    <IonList>
                        <IonListHeader color="medium">Welcome to TITAN</IonListHeader>
                        {generalPages.map((page, index) => {
                            return(
                                userDoc?.fullAccess || page.pageFullAccess ? (
                                <IonMenuToggle key={index} autoHide={false}>
                                    <IonItem color="medium" className={location.pathname === page.url ? 'selected' : ''} routerLink={page.url} routerDirection="none" lines="none" detail={false}>
                                        <IonIcon slot="start" ios={page.iosIcon} md={page.mdIcon} />
                                        <IonLabel>{page.title}</IonLabel>
                                    </IonItem>
                                </IonMenuToggle>
                                   ) : null
                            );
                        })}
                    </IonList>
                    {/* <IonList>
                        <IonListHeader color="medium">App Center</IonListHeader>
                        {appCenter.map((page, index) => {
                            return(
                                <IonMenuToggle key={index} autoHide={false}>
                                    <IonItem color="medium" className={location.pathname === page.url ? 'selected' : ''} routerLink={page.url} routerDirection="none" lines="none" detail={false}>
                                        <IonIcon slot="start" ios={page.iosIcon} md={page.mdIcon} />
                                        <IonLabel>{page.title}</IonLabel>
                                    </IonItem>
                                </IonMenuToggle>
                            );
                        })}
                    </IonList> */}
                    <IonList>{currentUser &&
                    <IonMenuToggle  autoHide={false}>
                    <IonItem color="medium"  routerLink={"support"} routerDirection="none" lines="none" detail={false}>
                                        <IonIcon slot="start" ios={paperPlaneOutline} md={paperPlaneOutline} />
                                        <IonLabel>{"Support"}</IonLabel>
                                    </IonItem>
                        </IonMenuToggle>
}   
                        <IonMenuToggle style={{cursor: "pointer"}} autoHide={false} onClick={logout}>
                            <IonItem color="medium" routerLink={'/login'} routerDirection="none">
                                <IonIcon slot="start" icon={logOut} />
                                <IonLabel>Log Out</IonLabel>
                            </IonItem>
                           
                        </IonMenuToggle>
                    </IonList>
                </IonContent>
            </IonMenu>
        </AuthProvider>
    );
};

export default Menu;
