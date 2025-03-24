import * as React from "react";
import Header from "../../components/Header/Header";

import { IonContent, IonIcon, IonPage, } from "@ionic/react";

import { useEffect, useState } from 'react';
import { useHistory } from "react-router";
import { useAuth } from '../../services/contexts/AuthContext/AuthContext';
import { getLinks, getUpdatedLinks } from '../../services/firestoreService';
import { LinkData } from '../../interfaces/LinkData';
import { AppPage } from "../../interfaces/AppPage";



import tourService from "../../services/tourService";
import Tour from "reactour";

import './OtherApps.css'

import video from '../../assets/doen.mp4.mp4'



const OtherApps: React.FC = () => {
    const history = useHistory();
    const [appCenter, setAppCenter] = useState<AppPage[]>([]);

    const { currentUser } = useAuth();
    
    useEffect(() => {

        const fetchLinks = async () => {
            const links: LinkData[] = await getLinks();
            const apps: AppPage[] = await getUpdatedLinks(links);
            setAppCenter(apps);
        }
       if(currentUser)
        {
            fetchLinks();
        }

    }, [currentUser]);


    const steps = tourService.getStepsFor("AppCenter");
    const isTour = tourService.StartTourApp();

    return (
        <IonPage>
            <Header title={"Other Apps"} />
            <IonContent >
                <div>
                    <video src={video} autoPlay loop muted className="bg-video" />
                </div>


                <div className="card-grid">
                    {appCenter.map((page, index) => {
                        return (
                            page.displayPage === 'otherapps' &&
                            <div key={index} className="my-card" onClick={() => history.push(page.url)}>
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

export default OtherApps;