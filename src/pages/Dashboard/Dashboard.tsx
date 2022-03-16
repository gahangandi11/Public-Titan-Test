import {IonCard, IonCol, IonContent, IonHeader, IonItem, IonList, IonPage, IonRow, IonTitle, IonToolbar} from '@ionic/react';
import './Dashboard.css';
import Header from '../../components/Header/Header';
import Map from '../../components/Map/Map';
import * as React from 'react';
import {
    arrowDownCircleOutline, arrowDownCircleSharp,
    arrowUpCircleOutline, arrowUpCircleSharp,
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

const Dashboard: React.FC = () => {
    const [dataCards, setDataCards] = useState<DataCardContent[]>([]);
    const [graphData, setGraphData] = useState<GraphData[]>([]);
    const [crashes, setCrashes] = useState<CountyData[]>([]);

    useEffect(() => {
        getDashboardContent().then((data: DashboardData) => {
            const dashboardData: DashboardData = data ? data : new DashboardData();
            const updated = new Date(dashboardData.lastUpdated * 1000).toLocaleString();
            setDataCards([
                {
                    title: 'Crash Value',
                    data: dashboardData.crashVal.toString(10),
                    updated: updated,
                    ios: dashboardData.crashTrend === 'green' ? arrowDownCircleOutline : arrowUpCircleOutline,
                    md: dashboardData.crashTrend === 'green' ? arrowDownCircleSharp : arrowUpCircleSharp,
                    color: dashboardData.crashTrend === 'green' ? 'icon__green' : 'icon__red'
                },
                {
                    title: 'Fatality Value',
                    data: dashboardData.fatalVal.toString(10),
                    updated: updated,
                    ios: dashboardData.fatalTrend === 'green' ? arrowDownCircleOutline : arrowUpCircleOutline,
                    md: dashboardData.fatalTrend === 'green' ? arrowDownCircleSharp : arrowUpCircleSharp,
                    color: dashboardData.fatalTrend === 'green' ? 'icon__green' : 'icon__red'
                },
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
                },
                {
                    labels: dashboardData.crashes_monthly,
                    series: dashboardData.crashes_monthly_values,
                    graphType: "Line",
                    title: "Monthly Crashes",
                    subtitle: "Past 30 days",
                    content: "Updated" + updated,
                    color: "green"
                },
                {
                    labels: dashboardData.crashes_quarterly,
                    series: dashboardData.crashes_quarterly_values,
                    graphType: "Bar",
                    title: "Quarterly Crashes",
                    subtitle: "Past 90 days",
                    content: "Updated" + updated,
                    color: "yellow"
                },
                {
                    labels: dashboardData.fatal_monthly,
                    series: dashboardData.fatal_monthly_values,
                    graphType: "Line",
                    title: "Monthly Fatalities",
                    subtitle: "Past 30 days",
                    content: "Updated" + updated,
                    color: "red"
                },
                {
                    labels: dashboardData.fatal_quarterly,
                    series: dashboardData.fatal_quarterly_values,
                    graphType: "Bar",
                    title: "Quarterly Fatalities",
                    subtitle: "Past 90 days",
                    content: "Updated" + updated,
                    color: "blue"
                }
            ]);

            setCrashes(dashboardData.countyCrashes.sort((a, b) => b.crashes - a.crashes));
        });
    }, []);

    return (
        <IonPage>
            <Header title="Dashboard" />
            <IonContent fullscreen color="light">
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Blank</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonRow className="dashboard__row">
                    <div className="dashboard__split">
                        <div className='data-card__container'>
                            {dataCards.map(card => {
                                return (
                                    <IonCol key={card.title} className="data-card__col">
                                        <DataCard content={card} type={card.title === 'Crash Value' || card.title === 'Fatality Value'} />
                                    </IonCol>
                                )
                            })}
                        </div>
                    </div>
                    <div className="dashboard__split">
                        <IonCard color="primary">
                            <IonRow>
                                <IonCol size-lg="3.5">
                                    <IonItem color="primary">
                                        <h1>Crash Rates By County</h1>
                                    </IonItem>
                                    <div className='crash-listing-container'>
                                    {crashes.map(county => {
                                        return (
                                            <IonItem className="ion-padding-top" color="primary" key={county.name}>
                                                {county.name} : {county.crashes}
                                            </IonItem>
                                        );
                                    })}
                                    </div>
                                </IonCol>
                                <IonCol size-lg="8.5">
                                    <div className="map-data--container">
                                        <Map traffic={true} weather={false} transcore={false} incidents={false} jams={false} cameras={[]} showCameras={false} height={550} zoom={5.5} />
                                    </div>
                                </IonCol>
                            </IonRow>
                        </IonCard>
                    </div>
                </IonRow>
                <IonRow className="ion-justify-content-evenly">
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

export default Dashboard;
