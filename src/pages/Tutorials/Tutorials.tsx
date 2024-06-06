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
    videocamSharp
} from 'ionicons/icons';
const Tutorials: React.FC = () => {

    const cards: TutorialData[] = [
        // {
        //     title: 'Database Querying',
        //     color: 'card-orange',
        //     iosIcon: statsChartOutline,
        //     mdIcon: statsChartSharp,
        //     playTour: true,
        //     tourLink: '/data/?tour=\'true\'',
        //     description: 'The Database Querying page provides you with the ability to query ' +
        //         'historical data of traffic incidents, jams, detectors, and probe analysis.'
        // },
        // {
        //     title: 'App Center',
        //     color: 'card-dark',
        //     iosIcon: videocamOutline,
        //     mdIcon: videocamSharp,
        //     playTour: true,
        //     tourLink: '/myapps/?tour=\'true\'',
        //     description: 'The Live CCTV page provides you with the ability to monitor traffic ' +
        //         'cameras around the state of Missouri in real-time.'
        // },
        {
            title: 'Dashboard',
            color: 'card-blue',
            iosIcon: gridOutline,
            mdIcon: gridSharp,
            playTour: true,
            tourLink: './Dashboard/?tour=\'true\'',
            description: 'The Dashboard is the one-stop location for all the up-to-date collections ' +
                'of traffic data across the state of Missouri. Take a look for a live map of the state and ' +
                'current crash data charts.'
        },
        // {
        //     title: 'Notifications',
        //     color: 'card-purple',
        //     iosIcon: notifications,
        //     mdIcon: notifications,
        //     playTour: true,
        //     tourLink: './Notifications/?tour=\'true\'',
        //     description: 'The Notifications page provides a list of all received notifications for your account. ' +
        //         'Here you can view all of the events you are subscribed to around Missouri and manage your list.'
        // },
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
