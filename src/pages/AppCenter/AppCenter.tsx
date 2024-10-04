import * as React from "react";
import Header from "../../components/Header/Header";

import {IonContent,IonIcon,IonPage,} from "@ionic/react";

import { useEffect, useState } from 'react';
import { useHistory } from "react-router";
import { useAuth } from '../../services/contexts/AuthContext/AuthContext';
import { getLinks } from '../../services/firestoreService';
import { LinkData } from '../../interfaces/LinkData';
import iconService from '../../services/iconService';

import tourService from "../../services/tourService";
import Tour from "reactour";

import './AppCenter.css'

import video from '../../assets/doen.mp4.mp4'


interface AppPage {
    url: string;
    iosIcon: string;
    mdIcon: string;
    title: string;
    link?: string;
    category: string;
}


const AppCenter: React.FC = () => {
    const history = useHistory();
    const [appCenter, setAppCenter] = useState<AppPage[]>([]);

    const { currentUser } = useAuth();
    useEffect(() => {
        if (currentUser) {
            getLinks().then((links: LinkData[]) => {
                const apps: AppPage[] = [];
                links.sort((a, b) => {
                    return a.order - b.order;
                });
                links.forEach(link => {
                    let category = '';

                    switch (link.name) {
                        case 'Safety':
                            category = 'safety';
                            break;

                        case 'TranscoreAnalytics':
                            category = 'safety';
                            break;

                        case 'CrashRisk':
                            category = 'safety';
                            break;
                       
                        case 'CrashesSHP':
                            category = 'safety';
                            break;
                        
                        case 'IncidentClearance':
                            category = 'safety';
                            break;




                        case 'Probe':
                            category = 'livedata';
                            break;
                        case 'TrafficCounts':
                            category = 'livedata';
                            break;



                        case 'WazeAnalytics':
                                category = 'traffic';
                                break;
                        case 'TrafficJams':
                            category = 'traffic';
                            break;



                        case 'MotorCycles':
                            category = 'motor';
                            break;
                        case 'INTEGRATED':
                            category = 'motor';
                            break;
                        
                        

                        case 'Congestion':
                            category = 'operations';
                            break;

                        case 'WinterSeverity':
                            category = 'operations';
                            break;                            
                        case 'DailyCongestion':
                            category = 'operations';
                            break;
                        case 'DetectorHealth':
                            category = 'operations';
                            break;
                        case 'WorkZones':
                            category = 'operations';
                            break;
                        default:
                            category = 'other';
                            break;
                    }
                    apps.push({
                        title: link.name,
                        url: "/app-center/" + link.name,
                        iosIcon: iconService.getIcon(link.icon, "ios"),
                        mdIcon: iconService.getIcon(link.icon, "android"),
                        category: category
                    });
                });
                setAppCenter(apps);
            });
        }
    }, [currentUser]);


    const steps = tourService.getStepsFor("AppCenter");
    const isTour = tourService.StartTourApp();

    return (
        <IonPage>
            <Header title={"App center"} />
            <IonContent >
                <div>
                 <video src={video} autoPlay loop muted className="bg-video"/>
                </div>
               
                    
                    <div className="card-grid">
                        {appCenter.map((page, index) => {
                                return (
                                    <div key={index}  className="my-card" onClick={()=>history.push(page.url)}>
                                        <h4>{page.title}</h4>
                                        <IonIcon className={`custom-icon-size ${page.category}`} ios={page.iosIcon} md={page.mdIcon} />
                                    </div>
                                );
                        })}
                    </div>
                    
            
                <Tour
                    steps={steps}
                    isOpen={isTour}
                    startAt={0}
                    accentColor="black"
                    onRequestClose={() => {
                        tourService.GoBack(history);
                    }}
                />
            </IonContent>
        </IonPage>
    )
};

export default AppCenter;