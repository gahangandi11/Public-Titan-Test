import * as React from "react";
import Header from "../../components/Header/Header";
import { IonContent, IonIcon, IonPage, } from "@ionic/react";
import { useEffect, useState } from 'react';
import { useHistory } from "react-router";
import { useAuth } from '../../services/contexts/AuthContext/AuthContext';
import { getLinks, getUpdatedLinks } from '../../services/firestoreService';
import { LinkData } from '../../interfaces/LinkData';
import { AppPage } from "../../interfaces/AppPage";
import iconService from '../../services/iconService';
import tourService from "../../services/tourService";
import Tour from "reactour";
import './AppCenter.css'
import video from '../../assets/doen.mp4.mp4'




const AppCenter: React.FC = () => {
    const history = useHistory();
    const [appCenter, setAppCenter] = useState<AppPage[]>([]);

    const { currentUser } = useAuth();

    useEffect(() => {

        const fetchLinks = async () => {
            const links: LinkData[] = await getLinks();
            const apps: AppPage[] = await getUpdatedLinks(links);
            setAppCenter(apps);
        }

        if (currentUser) {
            fetchLinks();
        }

    }, [currentUser]);



    const steps = tourService.getStepsFor("AppCenter");
    const isTour = tourService.StartTourApp();

    return (
        <IonPage>
            <Header title={"App center"} />
            <IonContent >
                <div>
                    <video src={video} autoPlay loop muted className="bg-video" />
                </div>


                <div className="app-card-grid">
                    {appCenter.map((page, index) => {
                        return (
                            page.displayPage === 'appcenter' &&
                            <div key={index} className="app-my-card" onClick={() => history.push(page.url)}>
                                <h2>{page.title}</h2>
                                <IonIcon className={`app-custom-icon-size ${page.category}`} ios={page.iosIcon} md={page.mdIcon} />
                            </div>
                        );
                    })}

                    <div className="app-my-card" onClick={() => history.push('/appcenter/otherapps')}>
                        <h2>WIP</h2>
                        <IonIcon className={`app-custom-icon-size motor`} ios={iconService.getIcon('git', "ios")} md={iconService.getIcon('git', "android")} />
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

export default AppCenter;