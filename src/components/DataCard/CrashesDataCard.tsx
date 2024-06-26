import React,{useState } from 'react';
import { IonCard, IonCardTitle, IonIcon, IonAlert, IonRouterLink,IonLabel, IonButton } from '@ionic/react';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';

import { DataCardContent } from "../../interfaces/DataCardContent";
import { CountyData } from "../../interfaces/CountyData";

import "./CrashesDataCard.css"


import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { styled } from '@mui/material/styles';
import { useHistory } from 'react-router-dom';

import Tooltip from '@mui/material/Tooltip';

import Button from '@mui/material/Button';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

import tourService from "../../services/tourService";
import Tour from "reactour";

interface GraphDataCardprops {
  content: DataCardContent;
  crashList: CountyData[];
}

 
const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {backgroundColor:'#456e97'},
  [`& .${linearProgressClasses.bar}`]: {borderRadius: 5,backgroundColor: '#ec4561'},
}));

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});


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
    closeModal();  
    history.push('/app-center/TranscoreAnalytics');  
  };


const steps = tourService.getStepsFor("Dashboard");
const isTour = tourService.StartTourDashboard();

console.log(steps);
console.log(isTour);

    return(
  <>
    <IonCard  className='main-container crashes-tour-main'>
            <IonCardTitle className="crash-data-card-title">
              <div className='crashes-header-title'>{props.content.title}</div>
              <Tooltip title="More Information">
              <div onClick={openModal} className="crashes-data-card-icon crashes-tour-icon">
                <IonIcon className='colorin' color="light" ios={props.content.ios} md={props.content.md}/>
              </div>
              </Tooltip>
            </IonCardTitle>
        
            <div className="gauge-container unique-class-to-change-color crashes-tour-gauge">
                <Gauge width={200} height={150} value={Number(props.content.data)} startAngle={-110} endAngle={110} valueMax={200} innerRadius="75%" outerRadius="100%" 
                sx={{[`& .${gaugeClasses.valueArc}`]: {fill: '#ec4561',},
                    [`& .${gaugeClasses.valueText}`]: {fontSize: 60,transform: 'translate(0px, 0px)',fill:'red' },
                    [`& .${gaugeClasses.referenceArc}`]: {fill: '#456e97',}}}/>
            </div>
        
        <IonCardTitle className='crashes-title' style={{ color: 'white' }}>
                  Crash Rates By County
        </IonCardTitle>
      
        <div className=" crash-counties crashes-tour-counties">
              {props.crashList.map((county, index) => {
                  return (
                    <div className='crashes-counties-with-bar' key={county.name}>   
                      <div className='crashes-counties-and-percentage'>               
                         <div>{county.name} : {county.crashes}</div> <div className='percentage'> {Math.floor(((county.crashes)/Number(props.content.data))*100)}% </div>
                      </div>
                      <div style={{ width: '100%' }}> 
                         <BorderLinearProgress variant="determinate" value={Math.floor(((county.crashes)/Number(props.content.data))*100)} />
                      </div>
                    </div>
                  ); 
              })} 
        </div>
        <div className='crash-last-updated'>{props.content.updated}</div>
        


    </IonCard>
     

    {/* <IonButton id="present-alert">Click Me</IonButton>
      <IonAlert
        isOpen={modalOpen}
        header="A Short Title Is Best"
        subHeader="A Sub Header Is Optional"
        message="A message should be a short, complete sentence."
        buttons={['Action']}
      ></IonAlert> */}

    {/* <IonAlert
          
          isOpen={modalOpen}
          header={props.content.title}
          subHeader={"Source: " + props.content.source}
          message={props.content.description}
          buttons={[{text:"Close", role: 'cancel'},{text:"More Information", handler: handleOkay}]}
          onDidDismiss={closeModal}
          cssClass="custom-alert"
          // cssClass="bigger-alert"
        ></IonAlert> */}



      <Dialog
      className='alert-class'
        open={modalOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={closeModal}
        aria-describedby="alert-dialog-slide-description"
      >
        {/* <DialogTitle className='alert-title'>{props.content.title}</DialogTitle> */}
        <h3 className='alert-title'>{props.content.title}</h3>
        <DialogContent>
        <h6 className='alert-source'>
        {"Source: " + props.content.source}
        </h6>
          <DialogContentText id="alert-dialog-slide-description">
            {props.content.description}
          </DialogContentText>
        </DialogContent>
        <div className='alert-buttons'>
          <Button onClick={closeModal}>Close</Button>
          <Button onClick={handleOkay}>More Information</Button>
        </div>
      </Dialog>
      <Tour
          steps={steps}
          isOpen={isTour}
          startAt={0}
          accentColor="black"
          onRequestClose={() => {
            tourService.GoBack(history);
          }}
        />
    
    

  </>
   
    );
};
export default GraphDataCard;

