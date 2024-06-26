import * as React from "react";
import Header from "../../components/Header/Header";
import './HomePage.css'


import {useAuth} from '../../services/contexts/AuthContext/AuthContext';

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
    IonItemDivider, IonCardSubtitle
  } from "@ionic/react";

  import { Icon } from '@iconify/react';

import { useHistory } from "react-router";

const Homepage: React.FC = () => {
  const history = useHistory(); 
  const handleCardClick = (path: string) => {
    history.push(path); // Redirects to the given path
  }

  // const { currentUser, userDoc } = useAuth();
 return(
        <IonPage>
    <Header title={"Home"} />
    <IonContent >
      <div className="home-background" >

         <div className="display-cards">

         
          <IonCard color="primary" onClick={() => handleCardClick('/home')}>
           
                <h1>Live Data</h1>
                <Icon className="icon-style" color="white" icon="arcticons:maps" />
           
          </IonCard> 
          

          <IonCard color="primary" onClick={() => handleCardClick('/dashboard')}>
          
               <h1>Dashboard</h1>
               <Icon className="icon-style" color="white" icon="mage:dashboard-fill" />
          
          </IonCard>
         
          
         
          <IonCard color="primary" onClick={() => handleCardClick('/data')}>
           
            <h1>Download</h1>
            <Icon className="icon-style" color="white" icon="mingcute:download-fill" />
          </IonCard>


    
          <IonCard color="primary" onClick={() => handleCardClick('/myapps')}>
          
              <h1>App center</h1>
              
             <Icon className="icon-style" color="white" icon="material-symbols:apps" />
          </IonCard>
          
          </div>


      </div>
      
        </IonContent>
        </IonPage>
 )


};

export default Homepage;