import React from 'react';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/react';
// import { Gauge } from '@mui/x-charts/Gauge';

const GraphDataCard: React.FC =()=> {
    return(

    <IonCard color="primary">
        <IonCardHeader>
          <IonCardTitle>Card Title</IonCardTitle>
          <IonCardSubtitle>Card Subtitle</IonCardSubtitle>
        </IonCardHeader>

        <IonCardContent>Card Content</IonCardContent>
      </IonCard>
   
    );
};
export default GraphDataCard;