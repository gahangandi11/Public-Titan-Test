import {
  IonCard,
  IonCol,
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,

} from "@ionic/react";
import "./Dashboard.css";
import Header from "../../components/Header/Header";
import Map from "../../components/Map/Map";
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
import DataCard from "../../components/DataCard/DataCard";
import { DataCardContent } from "../../interfaces/DataCardContent";
import { useEffect, useState } from "react";
import { DashboardData } from "../../interfaces/DashboardData";
import { getDashboardContent } from "../../services/firestoreService";
import { GraphData } from "../../interfaces/GraphData";
import Graph from "../../components/Graph/Graph";
import { CountyData } from "../../interfaces/CountyData";
import CountySearch from "./CountySearch"; // Adjust the path accordingly

import GraphDataCard from "../../components/DataCard/GraphDataCard";

const Dashboard: React.FC = () => {
  const [selectedCounty, setSelectedCounty] = useState({
    name: "Select County",
    value: "",
  });

  const [dataCards, setDataCards] = useState<DataCardContent[]>([]);
  const [graphData, setGraphData] = useState<GraphData[]>([]);
  const [crashes, setCrashes] = useState<CountyData[]>([]);

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const [counties, setCounties] = useState<{ name: string; value: string[] }>({
    name: "",
    value: [],
  });

  const handleCountySelected = (selectedCounty: {
    name: string;
    value: string[];
  }) => {
    setSelectedCounty({
      name: selectedCounty.name,
      value: selectedCounty.value[0],
    });
  };

  const openSearchModal = () => {
    setIsSearchModalOpen(true);
  };

  const closeSearchModal = () => {
    setIsSearchModalOpen(false);
  };

  const calculateColor = (crashCount: number, index: number, size: number) => {
    // Set the base color to red
    const baseColor = "#FF0000";

    // Calculate the opacity based on the index
    const opacity = 1 - index / size; // Assuming a range of 10 for the index

    // Combine the base color with adjusted opacity to simulate shades of grey
    const color = `${baseColor}${Math.round(opacity * 255)
      .toString(16)
      .padStart(2, "0")}`;

    return color;
  };

  useEffect(() => {
    getDashboardContent().then((data: DashboardData) => {
      const dashboardData: DashboardData = data ? data : new DashboardData();
      const updated = new Date(
        dashboardData.lastUpdated.value * 1000
      ).toLocaleString();
      setDataCards([
        // {
        //   title: "Crash Value",
        //   data: dashboardData.crashVal.toString(10),
        //   updated: updated,
        //   ios:
        //     dashboardData.crashTrend === "green"
        //       ? arrowDownCircleOutline
        //       : arrowUpCircleOutline,
        //   md:
        //     dashboardData.crashTrend === "green"
        //       ? arrowDownCircleSharp
        //       : arrowUpCircleSharp,
        //   color:
        //     dashboardData.crashTrend === "green" ? "icon__green" : "icon__red",
        // //   source: dashboardData.crashVal.notes.source,
        //   source: "N/A",
        //   description:"N/A"
        // },
        // {
        //   title: "Fatality Value",
        //   data: dashboardData.fatalVal.toString(10),
        //   updated: updated,
        //   ios:
        //     dashboardData.fatalTrend === "green"
        //       ? arrowDownCircleOutline
        //       : arrowUpCircleOutline,
        //   md:
        //     dashboardData.fatalTrend === "green"
        //       ? arrowDownCircleSharp
        //       : arrowUpCircleSharp,
        //   color:
        //     dashboardData.fatalTrend === "green" ? "icon__green" : "icon__red",
        // //   source: dashboardData.fatalVal.notes.source,
        //   source: "N/A",
        //   description:"N/A"
        // },
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
        },
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
            "11pm",
          ],
          series: dashboardData.trafficCount,
          graphType: "Line",
          title: "Traffic Counts",
          subtitle: "Past 24 hours",
          content: "Updated " + updated,
          color: "red",
        },
        {
          labels: dashboardData.crashes_monthly,
          series: dashboardData.crashes_monthly_values,
          graphType: "Line",
          title: "Monthly Crashes",
          subtitle: "Past 30 days",
          content: "Updated" + updated,
          color: "green",
        },
        {
          labels: dashboardData.crashes_quarterly,
          series: dashboardData.crashes_quarterly_values,
          graphType: "Bar",
          title: "Quarterly Crashes",
          subtitle: "Past 90 days",
          content: "Updated" + updated,
          color: "yellow",
        },
        {
          labels: dashboardData.fatal_monthly,
          series: dashboardData.fatal_monthly_values,
          graphType: "Line",
          title: "Monthly Fatalities",
          subtitle: "Past 30 days",
          content: "Updated" + updated,
          color: "red",
        },
        {
          labels: dashboardData.fatal_quarterly,
          series: dashboardData.fatal_quarterly_values,
          graphType: "Bar",
          title: "Quarterly Fatalities",
          subtitle: "Past 90 days",
          content: "Updated" + updated,
          color: "blue",
        },
      ]);

      setCrashes(
        dashboardData.countyCrashes.sort((a, b) => b.crashes - a.crashes)
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
          {dataCards.map((card) => {
            if(card.title=="Crashes This Week")
              {
            return(
              <GraphDataCard key={card.title} content={card} crashList={crashes}></GraphDataCard>
            );
          }
          }
          )}
          </div>
        {/* <IonInput
          className="ion-text-center ion-align-items-center"
          placeholder={selectedCounty.name}
          readonly
          onClick={openSearchModal}
          style={{ cursor: "pointer" }}
        ></IonInput> */}
        <IonRow className="dashboard__row">
          {dataCards.map((card) => {
            return (
              <IonCol key={card.title} className="data-card__col">
                <DataCard
                  content={card}
                  type={
                    card.title === "Crash Value" ||
                    card.title === "Fatality Value"
                  }
                />
              </IonCol>
            );
          })}
        </IonRow>
        <IonRow></IonRow>
        <IonRow>
             
          <IonCol >
            <IonCard 
              color="primary "
              className="ion-padding crash-counties-list">
              <IonItem color="primary">
                <h1>Crash Rates By County</h1>
              </IonItem>
             
               {crashes.map((county, index) => {
                 return (
                  <IonItem
                    className="ion-padding-top"
                    color="primary"
                    key={county.name}
                  >
                    {county.name} : {county.crashes}
                  </IonItem>
                ); 
               })} 
            </IonCard>
          </IonCol>
          {graphData.map((value: GraphData, index: number) => {
            return (
              <IonCol key={index} size-lg="6" size="10">
                <Graph
                  labels={value.labels}
                  series={value.series}
                  title={value.title}
                  subtitle={value.subtitle}
                  graphType={value.graphType}
                  content={value.content}
                  color={value.color}
                />
              </IonCol>
            );
          })}
        </IonRow>
      </IonContent>
      <CountySearch
        counties={counties}
        setCounties={setCounties}
        isOpen={isSearchModalOpen}
        onClose={closeSearchModal}
        onItemSelected={handleCountySelected}
      />
    </IonPage>
  );
};

export default Dashboard;
