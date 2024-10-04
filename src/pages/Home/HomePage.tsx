import * as React from "react";
import { useAuth } from '../../services/contexts/AuthContext/AuthContext';
import { IonCard, IonContent, IonPage, } from "@ionic/react";
import { Icon } from '@iconify/react';
import { useHistory } from "react-router";
import Header from "../../components/Header/Header";
import video from '../../assets/doen.mp4.mp4'
import './HomePage.css'



const Homepage: React.FC = () => {
  const history = useHistory();
  const handleCardClick = (path: string) => {
    history.push(path); // Redirects to the given path
  }

  const { permissions } = useAuth();
  return (
    <IonPage>
      <Header title={"Home"} />
      <IonContent >
        <div>
          <video src={video} autoPlay loop muted className="bg-video"/>
        </div>
        <div className="home-background" >

          <div className="display-cards">

            {permissions?.includes("Live Data") && <IonCard  onClick={() => handleCardClick('/livedata')}>
              <h1>Live Data</h1>
              <Icon className="icon-style" color="white" icon="arcticons:maps" />
            </IonCard>}

            {permissions?.includes("Dashboard") && <IonCard  onClick={() => handleCardClick('/dashboard')}>
              <h1>Dashboard</h1>
              <Icon className="icon-style" color="white" icon="mage:dashboard-fill" />
            </IonCard>}

            {permissions?.includes("Data Download") && <IonCard  onClick={() => handleCardClick('/data')}>
              <h1>Download</h1>
              <Icon className="icon-style" color="white" icon="mingcute:download-fill" />
            </IonCard>}


            {permissions?.includes("App Center") && <IonCard  onClick={() => handleCardClick('/appcenter')}>
              <h1>App center</h1>
              <Icon className="icon-style" color="white" icon="material-symbols:apps" />
            </IonCard>}

          </div>

          <div className="disclaimer">
            <IonCard >
              <div className="disclaimer-content">
                <h3>Discalimer</h3>
                <span style={{ fontStyle: "italic" }}>
                  The University of Missouri developed this interactive web-based platform for transportation data integration and analytics,
                  known as TITAN, on behalf of the Missouri Highways and Transportation Commission (MHTC) to transform the way we use data to
                  solve problems by presenting the information in a visual way to enhance our understanding of Missouri’s transportation system.
                  While precautions to ensure the content of this site are both current and accurate, errors may be present. The University and
                  the MHTC assume no responsibility or liability for any errors or omissions in the content of this site.  The information
                  contained in this site is provided on an “as is” basis with no guarantees of completeness, accuracy, usefulness or timeliness,
                  and without any warranties of any kind whatsoever, expressed or implied.  TITAN also includes information that is protected
                  from disclosure by 23 USC Section 407 and the Missouri Open Records Law. Reports, surveys, schedules, lists, or data compiled or
                  collected for the purpose of identifying, evaluating, or planning the safety enhancement of roadway conditions or for the purpose
                  of developing any highway safety construction improvement project shall not be subject to discovery or admitted into evidence in a
                  Federal or State court proceeding or considered for other purposes in any lawsuit against the MHTC.
                </span>
              </div>
            </IonCard>

          </div>


        </div>

      </IonContent>
    </IonPage>
  )


};

export default Homepage;