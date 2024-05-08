import React,{useState} from 'react';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonItem, IonIcon,IonAlert } from '@ionic/react';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import Stack from '@mui/material/Stack';
import { DataCardContent } from "../../interfaces/DataCardContent";
import { CountyData } from "../../interfaces/CountyData";
import ProgressBar from "@ramonak/react-progress-bar";
import { useHistory } from 'react-router-dom';
import { LineChart } from '@mui/x-charts/LineChart';

import "./ClearanceDataCard.css"
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CircleIcon from '@mui/icons-material/Circle';

interface GraphDataCardprops {
    content: DataCardContent;
    crashList: CountyData[];
    newdata:any;
  }

interface dayClearance{
  clearance: number;
  name: string;
}
  
  const ClearanceDataCard: React.FC<GraphDataCardprops> =(props:GraphDataCardprops)=> {


    const [modalOpen, setModalOpen] = useState(false);
    const openModal = () => {
      if (props.content.source != "N/A") setModalOpen(true);
    };
  
    const closeModal = () => {
      setModalOpen(false);
    };
    const history = useHistory();
    const handleOkay = () => {
      closeModal();  // Close the modal first
      history.push('/app-center/IncidentClearance');  // Navigate to the desired path
    };

    const clearanceValues = props.newdata.weekdayClearance.map((day:any )=> Math.floor(day.clearance));
    const dayNames = props.newdata.weekdayClearance.map((day:any) => day.name.substring(0, 3));    

      return(
    <>
      <IonCard className='clearance-main-container'>
              <IonCardTitle className="clearance-data-card-title">
                <div className='clearance-header-title'>{props.content.title}</div>
                <div onClick={openModal} className="clearance-data-card-icon">
                  <IonIcon  color="light" ios={props.content.ios} md={props.content.md}/>
                </div>
              </IonCardTitle>
          
          <div className="clearance-gauge-container">
           
            <LineChart
              sx={{
                "& .MuiChartsAxis-left .MuiChartsAxis-tickLabel":{
                  strokeWidth:"0.4",
                  fill:"white"
                 },
                 "& .MuiChartsAxis-left .MuiChartsAxis-tick":{
                  stroke:"white"
                 },
                 "& .MuiChartsAxis-bottom .MuiChartsAxis-tick":{
                  stroke:"white"
                 },
                 "& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel":{
                  strokeWidth:"0.5",
                  fill:"white"
               },
               "& .MuiChartsAxis-bottom .MuiChartsAxis-line":{
                stroke:"white",
                strokeWidth:1.2
               },
               "& .MuiChartsAxis-left .MuiChartsAxis-line":{
                stroke:"white",
                strokeWidth:1.2
               },
               "& .MuiChartsAxis-left .MuiChartsAxis-label":{
                                 
                fill:'white'
            },
              }}
               xAxis={[{ scaleType:"point" , data:dayNames}]}
               yAxis={[{label:'Clearance Time'}]}
               series={[
               {
                 data: clearanceValues,
               },
               ]}
              dataset={props.newdata.weekdayClearance}
              width={285}
              height={210}
              
            />
        
          </div>
          <IonCardTitle className='clearance-by-county-title' style={{ color: 'white' }}>
                  Clearance Time By County
        </IonCardTitle>
        
         
         <div className='counties-and-time'>
         {
           props.newdata.countyClearance.map((day:any,index:number)=>{
            return(
              <div key={index} className='county-and-arrow'>
                   <CircleIcon className='circle-dot' style={{fill:'white',fontSize: 12}}></CircleIcon>
                  <div key={day.name}>{day.name} : {Math.floor(day.clearance)}</div>
                  {day.clearance>props.newdata.clearance_time?
                  <ArrowUpwardIcon className='arrow' style={{ color:'red',fontSize: 20 }}></ArrowUpwardIcon>
                  :<ArrowDownwardIcon className='arrow' style={{ color:'green', fontSize:20 }}></ArrowDownwardIcon>
                  }
              </div>
            )
           })
         }
         </div>
            
          
          
          
          <div className='clearance-last-updated'>{props.content.updated}</div>
      </IonCard>

      <IonAlert
          isOpen={modalOpen}
          header={props.content.title}
          subHeader={"Source: " + props.content.source}
          message={props.content.description}
          buttons={[{text:"More Information", handler: handleOkay}]}
          onDidDismiss={closeModal}
          cssClass="bigger-alert"
        ></IonAlert>
      
  
    </>
     
      );
  };
  export default ClearanceDataCard;
  