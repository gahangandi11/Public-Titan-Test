import {IonCol, IonContent, IonHeader, IonPage, IonRow, IonTitle, IonToolbar} from '@ionic/react';
import './Home.css';
import Header from '../../components/Header/Header';
import Map from '../../components/Map/Map';
import * as React from 'react';
import {
    calendarOutline,
    calendarSharp, carSportOutline, carSportSharp, informationCircleOutline, informationCircleSharp,
    statsChartOutline,
    statsChartSharp,
    warningOutline,
    warningSharp
} from 'ionicons/icons';
import DataCard from '../../components/DataCard/DataCard';
import {DataCardContent} from '../../interfaces/DataCardContent';
import {useEffect, useState} from 'react';
import {DashboardData} from '../../interfaces/DashboardData';
import {getDashboardContent} from '../../services/firestoreService';

const Home: React.FC = () => {
    const [dataCards, setDataCards] = useState<DataCardContent[]>([]);

    useEffect(() => {
        getDashboardContent().then((data: DashboardData) => {
            const dashboardData: DashboardData = data ? data : new DashboardData();
            const updated = new Date(dashboardData.lastUpdated * 1000).toLocaleString();
            setDataCards([
                {
                    title: 'Crashes This Week',
                    data: dashboardData.weeklyCrashes.toString(10),
                    updated: updated,
                    ios: warningOutline,
                    md: warningSharp,
                    color: 'icon__green'
                },
                {
                    title: 'Clearance Time',
                    data: dashboardData.clearanceTime + ' min.',
                    updated: updated,
                    ios: informationCircleOutline,
                    md: informationCircleSharp,
                    color: 'icon__yellow'
                },
                {
                    title: 'Freeway Counts',
                    data: dashboardData.freewayCounts.toFixed(2).toString(),
                    updated: updated,
                    ios: carSportOutline,
                    md: carSportSharp,
                    color: 'icon__red'
                },
                {
                    title: 'PTI',
                    data: '3.8',
                    updated: updated,
                    ios: statsChartOutline,
                    md: statsChartSharp,
                    color: 'icon__blue'
                }
            ]);
        })
    }, []);

    return (
        <IonPage>
            <Header title="Dashboard" />
            <IonContent fullscreen color="dark">
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Blank</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonRow>
                    {dataCards.map(card => {
                        return (
                            <IonCol className="data-card__col">
                                <DataCard content={card} />
                            </IonCol>
                        )
                    })}
                </IonRow>
                <IonRow className="dashboard__row">
                    <Map />
                </IonRow>
            </IonContent>
        </IonPage>
    );
};

export default Home;
