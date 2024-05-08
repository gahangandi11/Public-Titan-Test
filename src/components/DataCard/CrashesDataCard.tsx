import React,{ useRef, useEffect,useState } from 'react';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonItem, IonIcon, IonAlert, IonRouterLink,IonLabel } from '@ionic/react';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import Stack from '@mui/material/Stack';
import { DataCardContent } from "../../interfaces/DataCardContent";
import { CountyData } from "../../interfaces/CountyData";
// import ProgressBar from "@ramonak/react-progress-bar";
import "./CrashesDataCard.css"
import { green } from '@material-ui/core/colors';
import { colorFill } from 'ionicons/icons';
import { color } from '@mui/system';
import ProgressBar from 'react-bootstrap/ProgressBar';

import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { styled } from '@mui/material/styles';
import { useHistory } from 'react-router-dom';



interface GraphDataCardprops {
  content: DataCardContent;
  crashList: CountyData[];
}


const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    // backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    backgroundColor:'#456e97',
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: '#ec4561'
    // backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
  },
}));


const GraphDataCard: React.FC<GraphDataCardprops> =(props:GraphDataCardprops)=> {
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
    history.push('/app-center/TranscoreAnalytics');  // Navigate to the desired path
  };

    return(
  <>
    <IonCard  className='main-container'>
            <IonCardTitle className="crash-data-card-title">
              <div className='crashes-header-title'>{props.content.title}</div>
              <div onClick={openModal} className="crashes-data-card-icon">
                <IonIcon  color="light" ios={props.content.ios} md={props.content.md}/>
                
              </div>
            </IonCardTitle>
        
            <div className="gauge-container unique-class-to-change-color">
                <Gauge width={200} height={150} value={Number(props.content.data)} startAngle={-110} endAngle={110} valueMax={200} innerRadius="75%" outerRadius="100%" 
                sx={{[`& .${gaugeClasses.valueArc}`]: {fill: '#ec4561',},
                    [`& .${gaugeClasses.valueText}`]: {fontSize: 60,transform: 'translate(0px, 0px)',fill:'red' },
                    [`& .${gaugeClasses.referenceArc}`]: {fill: '#456e97',}}}/>
            </div>
        
        <IonCardTitle className='crashes-title' style={{ color: 'white' }}>
                  Crash Rates By County
        </IonCardTitle>
      
        <div className=" crash-counties">
              {props.crashList.map((county, index) => {
                  return (
                    <div className='crashes-counties-with-bar' key={county.name}>   
                      <div className='crashes-counties-and-percentage'>               
                         <div>{county.name} : {county.crashes}</div> <div className='percentage'> {Math.floor(((county.crashes)/Number(props.content.data))*100)}% </div>
                      </div>
                      <div style={{ width: '100%' }}> 
                         {/* <ProgressBar className='bars' key={county.name} completed = {Math.floor(((county.crashes)/Number(props.content.data))*100)} bgColor = "#EA7B26" animateOnRender = {true} isLabelVisible = {false} />  */}
                         {/* <ProgressBar className='bars' key={county.name} variant="warning" now={Math.floor(((county.crashes)/Number(props.content.data))*100)} /> */}
                         <BorderLinearProgress variant="determinate" value={Math.floor(((county.crashes)/Number(props.content.data))*100)} />
                      </div>
                    </div>
                  ); 
              })} 
        </div>
        <div className='crash-last-updated'>{props.content.updated}</div>
        


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
export default GraphDataCard;

