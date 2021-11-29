import {IonCard, IonCol, IonContent, IonHeader, IonItem, IonPage, IonRow, IonTitle, IonToolbar} from '@ionic/react';
import './Home.css';
import Header from '../../components/Header/Header';
import Map from '../../components/Map/Map';
import * as React from 'react';
import {
    carSportOutline,
    carSportSharp,
    informationCircleOutline,
    informationCircleSharp,
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
import {GraphData} from '../../interfaces/GraphData';
import Graph from '../../components/Graph/Graph';
import {CountyData} from '../../interfaces/CountyData';

const Home: React.FC = () => {
    const [dataCards, setDataCards] = useState<DataCardContent[]>([]);
    const [graphData, setGraphData] = useState<GraphData[]>([]);
    const [crashes, setCrashes] = useState<CountyData[]>([]);

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

            setGraphData([
                {
                    labels: dashboardData.dailyCrashDay,
                    series: dashboardData.dailyCrashCount,
                    graphType: "Line",
                    title: "Daily Crashes",
                    subtitle: "Past Week",
                    content: "Updated " + updated,
                    color: "green"
                },
                {
                    labels: dashboardData.incidentTypeName,
                    series: dashboardData.incidentTypeCount,
                    graphType: "Bar",
                    title: "Incident Types",
                    subtitle: "Last incident report",
                    content: "Updated " + updated,
                    color: "yellow"

                },
                {
                    labels: [
                        "12am",
                        "1am",
                        "2am",
                        "3am",
                        "4am",
                        "5am",
                        "6am",
                        "7am",
                        "8am",
                        "9am",
                        "10am",
                        "11am",
                        "12pm",
                        "1pm",
                        "2pm",
                        "3pm",
                        "4pm",
                        "5pm",
                        "6pm",
                        "7pm",
                        "8pm",
                        "9pm",
                        "10pm",
                        "11pm"],
                    series: dashboardData.trafficCount,
                    graphType: "Line",
                    title: "Traffic Counts",
                    subtitle: "Past 24 hours",
                    content: "Updated " + updated,
                    color: "red"
                }
            ]);

            setCrashes(dashboardData.countyCrashes.sort((a, b) => b.crashes - a.crashes));
        });
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
                <IonRow className="dashboard__row">
                    <div className="dashboard__split">
                    {dataCards.map(card => {
                        return (
                            <IonCol key={card.title} className="data-card__col">
                                <DataCard content={card} />
                            </IonCol>
                        )
                    })}
                    </div>
                    <div className="dashboard__split">
                        <IonCard color="primary">
                            <IonRow>
                                <IonCol size-lg="3">
                                    <IonItem color="primary">
                                        <h1>Crash Rates By County</h1>
                                    </IonItem>
                                    {crashes.map(county => {
                                        return (
                                            <IonItem className="ion-padding-top" color="primary" key={county.name}>
                                                {county.name} : {county.crashes}
                                            </IonItem>
                                        );
                                    })}
                                </IonCol>
                                <IonCol size-lg="9">
                                    <Map />
                                </IonCol>
                            </IonRow>
                        </IonCard>
                    </div>
                </IonRow>
                <IonRow className="char__row ion-justify-content-evenly">
                    {graphData.map((value: GraphData, index: number) => {
                        return (
                            <IonCol key={index} size-lg="3.5" size="10">
                                <Graph labels={value.labels} series={value.series} title={value.title} subtitle={value.subtitle} graphType={value.graphType} content={value.content} color={value.color} />
                            </IonCol>
                        )
                    })}
                </IonRow>
            </IonContent>
        </IonPage>
    );
};

export default Home;
