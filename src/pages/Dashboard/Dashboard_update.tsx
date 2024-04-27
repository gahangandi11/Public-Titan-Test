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