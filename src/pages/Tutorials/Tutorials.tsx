import {IonContent, IonGrid, IonPage, IonRow} from '@ionic/react';
import * as React from 'react';
import Header from '../../components/Header/Header';
import TutorialCard from "../../components/TutorialCards/TutorialCard";



export interface TutorialData {
    title: string;
    color: string;
    iosIcon: string,
    mdIcon: string,
    playTour: boolean;
    tourLink: string;
    description: string;
    pageFullAccess?: boolean;
}


import {
    appsOutline,
    appsSharp,
    gridOutline,
    gridSharp,
    notifications,
    personCircleOutline,
    personCircleSharp,
    podiumOutline,
    podiumSharp,
    statsChartOutline,
    statsChartSharp,
    subwayOutline,
    subwaySharp,
    videocamOutline,
    videocamSharp,
} from 'ionicons/icons';
const Tutorials: React.FC = () => {
    // const{userDoc}=useAuth();

    const cards: TutorialData[] = [
        {
            title: 'Database',
            color: 'card-orange',
            iosIcon: statsChartOutline,
            mdIcon: statsChartSharp,
            playTour: true,
            tourLink: '/data/?tour=\'data-true\'',
            // tourLink: '/data/?tour=\'true\'',
            description: 'The Database Querying page provides you with the ability to query ' +
                'historical data of traffic incidents, jams, detectors, and probe analysis.',
                pageFullAccess: false,
        },
        {
            title: 'App Center',
            color: 'card-dark',
            iosIcon: appsOutline,
            mdIcon: appsSharp,
            playTour: true,
            tourLink: '/myapps/?tour=\'app-true\'',
            // tourLink: '/myapps/?tour=\'true\'',
            description: 'The app center gives you direct access to all other pages in the applications, where you can find insights from the data ',
            pageFullAccess: false,
        },
        {
            title: 'Dashboard',
            color: 'card-blue',
            iosIcon: gridOutline,
            mdIcon: gridSharp,
            playTour: true,
            tourLink: '/dashboard/?tour=\'dash-true\'',
            // tourLink: '/dashboard/?tour=\'true\'',
            description: 'The Dashboard is the one-stop location for all the up-to-date collections ' +
                'of traffic data across the state of Missouri. Take a look for a live map of the state and ' +
                'current crash data charts.',
            pageFullAccess: false,
        },
    ];

    return (
        <IonPage>
            <Header title={"Tutorials"} />
            <IonContent class='first-step'>
                <IonGrid className="main-grid">
                    <IonRow>
                    {cards.map((card, index) => {
                            return (
                                <TutorialCard key={index} cardData={card} />
                            );
                        })}
                        </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

export default Tutorials;
