import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "./Dashboard.css";
import Header from "../../components/Header/Header";
import * as React from "react";
import {
  carSportOutline,
  carSportSharp,
  informationCircleOutline,
  informationCircleSharp,
  statsChartOutline,
  statsChartSharp,
  warningOutline,
  warningSharp,
} from "ionicons/icons";

import { DataCardContent } from "../../interfaces/DataCardContent";
import { useEffect, useState } from "react";
import { DashboardData } from "../../interfaces/DashboardData";
import { getDashboardContent, getDashboardCurrent, getDashboardContentCurrent } from "../../services/firestoreService";
import { GraphData } from "../../interfaces/GraphData";
import Graph from "../../components/Graph/Graph";
import { CountyData } from "../../interfaces/CountyData";


import GraphDataCard from "../../components/DataCard/CrashesDataCard";
import ClearanceDataCard from "../../components/DataCard/ClearanceDataCard";
import FreewayDataCard from "../../components/DataCard/FreewayDataCard"
import CongestionDataCard from "../../components/DataCard/CongestionDataCard"
import WorkZoneDataCard from "../../components/DataCard/WorkZoneDataCard";



const Dashboard: React.FC = () => {


  const [dataCards, setDataCards] = useState<any[]>([]);
  const [graphData, setGraphData] = useState<GraphData[]>([]);
  const [crashes, setCrashes] = useState<CountyData[]>([]);


  useEffect(() => {
    getDashboardContentCurrent().then((data: DashboardData) => {
      const dashboardData: any = data ? data : new DashboardData();

      console.log(dashboardData);
      const updated = new Date(
        dashboardData.lastUpdated.value * 1000
      ).toLocaleString();

      setDataCards([
        {
          title: "Crashes This Week",
          data: dashboardData.weeklyCrashes.value.toString(),
          updated: updated,
          ios: warningOutline,
          md: warningSharp,
          color: "icon__green",
          source: dashboardData.weeklyCrashes.notes.source.toString(),
          description: dashboardData.weeklyCrashes.notes.Description.toString(),
        },
        {
          title: "Clearance Time",
          data: dashboardData.clearanceTime.value.toString() + " min.",
          updated: updated,
          ios: informationCircleOutline,
          md: informationCircleSharp,
          color: "icon__yellow",
          source: dashboardData.clearanceTime.notes.source.toString(),
          description: dashboardData.clearanceTime.notes.Description.toString(),
          weekdayClearance: dashboardData.weekdayClearance,
          countyClearance: dashboardData.countyClearance,
          clearance_time: dashboardData.clearance_time,
        },
        {
          title: "Freeway Counts",
          data: parseInt(
            dashboardData.freewayCounts.value.toString()
          ).toString(),
          updated: updated,
          ios: carSportOutline,
          md: carSportSharp,
          color: "icon__red",
          source: dashboardData.freewayCounts.notes.source.toString(),
          description: dashboardData.freewayCounts.notes.Description.toString(),
          Active: dashboardData.Active,
          roadAadt: dashboardData.roadAadt,
        },
        {
          title: "PTIV",
          data: "3.8",
          updated: updated,
          ios: statsChartOutline,
          md: statsChartSharp,
          color: "icon__blue",
          source: "N/A",
          description: "N/A",
          congested_miles: dashboardData.congested_miles,
          pti: dashboardData.pti,
          tti: dashboardData.tti,
          countyCongestion: dashboardData.countyCongestion,
        },
        {
          updated: updated,
          ios: warningOutline,
          md: warningSharp,
          Workzones: dashboardData.Workzones,
          roadWzCongestion: dashboardData.roadWzCongestion,
          dowWzCongestion: dashboardData.dowWzCongestion,
          QueueLengths: dashboardData['Queue Lengths'],
          CongestedHours: dashboardData['Congested Hours'],
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
          color: "green",
        },
        {
          labels: dashboardData.incidentTypeName,
          series: dashboardData.incidentTypeCount,
          graphType: "Bar",
          title: "Incident Types",
          subtitle: "Past Week",
          content: "Updated " + updated,
          color: "yellow",
        },dashboardData
      ]);
      setCrashes(
        dashboardData.countyCrashes.sort((a: any, b: any) => b.crashes - a.crashes)
      );
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


        <div className="graph-data-card">
          <div className="graph-data-card-item">
            {dataCards && dataCards.length > 0 && (<GraphDataCard key={dataCards[0].title} content={dataCards[0]} crashList={crashes} />)}
          </div>
          <div className="graph-data-card-item">
            {dataCards && dataCards.length > 0 && (<ClearanceDataCard key={dataCards[0].title} content={dataCards[1]} />)}
          </div>
          <div className="graph-data-card-item">
            {dataCards && dataCards.length > 0 && (<FreewayDataCard key={dataCards[0].title} content={dataCards[2]} />)}
          </div>
          <div className="graph-data-card-item">
            {dataCards && dataCards.length > 0 && (<CongestionDataCard key={dataCards[0].title} content={dataCards[3]} />)}
          </div>
        </div>

        <div className="middle-data-card-item">
          {dataCards && dataCards.length > 0 && (<WorkZoneDataCard key={dataCards[0].title} content={dataCards[4]} />)}
        </div>
        
        <div className="graph-cards">
          <div className="graph1" >
            {graphData.length > 0 && <Graph
              labels={graphData[0].labels}
              series={graphData[0].series}
              title={graphData[0].title}
              subtitle={graphData[0].subtitle}
              graphType={graphData[0].graphType}
              content={graphData[0].content}
              color={graphData[0].color}
            />}
          </div>

          <div className="graph2" >
            {graphData.length > 0 && <Graph
              labels={graphData[1].labels}
              series={graphData[1].series}
              title={graphData[1].title}
              subtitle={graphData[1].subtitle}
              graphType={graphData[1].graphType}
              content={graphData[1].content}
              color={graphData[1].color}
            />}
          </div>
        </div>

      </IonContent>
    </IonPage>
  );
};

export default Dashboard;
