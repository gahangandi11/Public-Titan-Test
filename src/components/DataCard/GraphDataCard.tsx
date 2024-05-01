import React from 'react';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonItem, IonIcon } from '@ionic/react';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import Stack from '@mui/material/Stack';
import { DataCardContent } from "../../interfaces/DataCardContent";
import { CountyData } from "../../interfaces/CountyData";
import ProgressBar from "@ramonak/react-progress-bar";

interface GraphDataCardprops {
  content: DataCardContent;
  crashList: CountyData[];
}


const GraphDataCard: React.FC<GraphDataCardprops> =(props:GraphDataCardprops)=> {
    return(
  <>
    <IonCard color="warning" className='main-container'>
      <IonCardHeader className='header-content'>
          <IonCardTitle className="data-card__title">
            <div className='header-title'>{props.content.title}</div>
          <div className={"data-card__icon " + props.content.color}>
              <IonIcon
                color="light"
                ios={props.content.ios}
                md={props.content.md}
              />
            </div>
          </IonCardTitle>
      </IonCardHeader>
      <div className="gauge-container">
       <Gauge width={250} height={150} value={Number(props.content.data)} startAngle={210} endAngle={570} valueMax={200} innerRadius="75%"
           outerRadius="100%" sx={{[`& .${gaugeClasses.valueText}`]: {fontSize: 60,transform: 'translate(0px, 0px)',},} }/>
      </div>
        
      <IonCardContent>{props.content.updated}</IonCardContent>
      <IonCardTitle>
                Crash Rates By County
      </IonCardTitle>
      <div className=" crash-counties">
     
      
      {props.crashList.map((county, index) => {
                 return (
                  <div className='counties-with-bar' key={county.name}>   
                    <div className='counties-and-percentage'>               
                    <div>{county.name} : {county.crashes}</div> <div className='percentage'> {Math.floor(((county.crashes)/Number(props.content.data))*100)}% </div>
                    </div>
                     <div style={{ width: '100%' }}> <ProgressBar className='bars' key={county.name} completed = {Math.floor(((county.crashes)/Number(props.content.data))*100)} bgColor = "grey" animateOnRender = {true} isLabelVisible = {false} /> </div>
                   </div>
                ); 
               })} 
      </div>
    </IonCard>
    

    </>
   
    );
};
export default GraphDataCard;


// import { Gauge } from '@mui/x-charts/Gauge';

// <Gauge
//   value={75}
//   startAngle={0}
//   endAngle={360}
//   innerRadius="80%"
//   outerRadius="100%"
//   // ...
// />