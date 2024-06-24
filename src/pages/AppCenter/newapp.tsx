import * as React from "react";
import Header from "../../components/Header/Header";

import './newapp.css'



import {
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonContent,
    IonFab,
    IonFabButton,
    IonIcon,
    IonItem,
    IonLabel,
    IonPage,
    IonSelect,
    IonSelectOption,
    IonToast,
    IonToggle,
    IonCardTitle,
    IonList,
    IonListHeader,IonMenuToggle,
    IonItemDivider, IonCardSubtitle
  } from "@ionic/react";

  import { Icon } from '@iconify/react';
  import {useEffect, useState} from 'react';
import { useHistory } from "react-router";
import AuthProvider, {logout, useAuth} from '../../services/contexts/AuthContext/AuthContext';
import {getLinks} from '../../services/firestoreService';
import {LinkData} from '../../interfaces/LinkData';
import iconService from '../../services/iconService';



import tourService from "../../services/tourService";
import Tour from "reactour";



interface AppPage {
    url: string;
    iosIcon: string;
    mdIcon: string;
    title: string;
    link?: string;
    category: string;
}


const Newapp: React.FC = () => {
  const history = useHistory(); 
  const handleCardClick = (path:any) => {
    history.push(path); // Redirects to the given path
  }
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
                let category='';

                switch (link.name) {
                    case 'Safety':
                      category = 'safety';
                      break;

                    case 'TranscoreAnalytics':
                        category = 'safety';
                        break;
                    
                    case 'WazeAnalytics':
                            category = 'safety';
                            break;
                    
                    case 'CrashRisk':
                                category = 'safety';
                                break;
                    case 'MotorCycles':
                                    category = 'safety';
                                    break;
                    case 'CrashesSHP':
                                        category = 'safety';
                                        break;
                    
                    case 'Probe':
                                    category = 'livedata';
                                    break;
                    case 'TrafficCounts':
                                    category = 'livedata';
                                    break;
                    case 'TrafficJams':
                                    category = 'livedata';
                                    break;
                    
                     case 'Congestion':
                                    category = 'livedata';
                                    break;
                    case 'WinterSeverity':
                                    category = 'operations';
                                    break;
                    case 'IncidentClearance':
                                    category = 'operations';
                                    break;
                    case 'INTEGRATED':
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
                console.log(link)
                apps.push({
                    title: link.name,
                    url: "/app-center/" + link.name,
                    iosIcon: iconService.getIcon(link.icon, "ios"),
                    mdIcon: iconService.getIcon(link.icon, "android"),
                    category: category
                });
            });
            console.log(apps);
            setAppCenter(apps);
        });
    }
}, [currentUser]);

// const steps = tourService.getStepsFor("AppCenter");
// const isTouri = tourService.StartTour();

// const [isTour,setisTour]=useState(isTouri);

    const steps = tourService.getStepsFor("AppCenter");
    const isTour = tourService.StartTourApp();

 return(
        <IonPage>
    <Header title={"Home"} />
    <IonContent >
      <div className="home-background" >

         {/* <div className="display-cards">

          
          

          <IonCard color="primary" onClick={() => handleCardClick('/dashboard')}>
          
               <h1>Dashboard</h1>
               <Icon className="icon-style" color="white" icon="mage:dashboard-fill" />
          
          </IonCard>
         
          
          
          <IonCard color="primary" onClick={() => handleCardClick('/data')}>
           
            <h1>Download</h1>
            <Icon className="icon-style" color="white" icon="mingcute:download-fill" />
          </IonCard>

          <IonCard color="primary" onClick={() => handleCardClick('/data')}>
          
              <h1>App center</h1>
              
             <Icon className="icon-style" color="white" icon="material-symbols:apps" />
          </IonCard>
          
          </div> */}
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

            <div className="my-first-row">
            {appCenter.map((page, index) => {
                    if(page.category=='safety')
                        // const uniqueClassName = page.title.replace(/\s+/g, '-').toLowerCase();
                            return(
                                <IonCard key={index} color="primary" className={`my-first-row-card ${page.title.replace(/\s+/g, '-').toLowerCase()}`} routerLink={page.url}>
                                    <h4>{page.title}</h4>
                                    <IonIcon className=" custom-icon-size"  ios={page.iosIcon} md={page.mdIcon} />
                                </IonCard>
                            );
                        })}
            </div>

            <div className="my-second-row">
            {appCenter.map((page, index) => {
                    if(page.category=='livedata')
                            return(
                                <IonCard key={index} color="primary" className={`my-first-row-card ${page.title.replace(/\s+/g, '-').toLowerCase()}`} routerLink={page.url}>
                                    <h4>{page.title}</h4>
                                    <IonIcon className=" custom-icon-size" ios={page.iosIcon} md={page.mdIcon} />
                                </IonCard>
                            );
                        })}
            </div>
            
            <div className="my-third-row">
            {appCenter.map((page, index) => {
                    if(page.category=='operations')
                            return(
                                <IonCard key={index} color="primary" className={`my-first-row-card ${page.title.replace(/\s+/g, '-').toLowerCase()}`} routerLink={page.url}>
                                    <h4>{page.title}</h4>
                                    <IonIcon className=" custom-icon-size" ios={page.iosIcon} md={page.mdIcon} />
                                </IonCard>
                            );
                        })}
            </div>

            


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

export default Newapp;