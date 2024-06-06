import React,{useState } from 'react';
import { IonCard, IonCardTitle, IonIcon, IonAlert } from '@ionic/react';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { DataCardContent } from "../../interfaces/DataCardContent";
import { CountyData } from "../../interfaces/CountyData";
import "./CongestionDataCard.css"


import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import CircleIcon from '@mui/icons-material/Circle';

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



interface GraphDataCardprops {
  content: DataCardContent;
  crashList: CountyData[];
  newdata:any;
}

import tourService from "../../services/tourService";
import Tour from "reactour";

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
    if (props.newdata.congested_miles.notes.source != "N/A") setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const history = useHistory();

  const handleOkay = () => {
    closeModal(); 
    history.push('/app-center/DailyCongestion');  
  };
  const steps = tourService.getStepsFor("Dashboard");
  const isTour = tourService.StartTour();

    return(
  <>
    <IonCard  className='congestion-main-container congestion-tour-main'>
            <IonCardTitle className="congestion-data-card-title">
              <div className='congestion-header-title'>Congestion Miles</div>
              <Tooltip title="More Information">
              <div onClick={openModal} className="congestion-data-card-icon congestion-tour-icon">
                <IonIcon  className='colorin' color="light" ios={props.content.ios} md={props.content.md}/>
              </div>
              </Tooltip>
            </IonCardTitle>
        
        <div className="congestion-gauge-container unique-class-to-change-color congestion-tour-gauge">
           <div className='gauge-circle'>
            <Gauge width={200} height={150} value={Number(props.newdata.congested_miles.value)} startAngle={-110} endAngle={110} valueMax={300} innerRadius="75%" outerRadius="100%" 
            sx={{[`& .${gaugeClasses.valueArc}`]: {fill: '#ec4561',},
                 [`& .${gaugeClasses.valueText}`]: {fontSize: 50,transform: 'translate(0px, 0px)',fill:'red' },
                 [`& .${gaugeClasses.referenceArc}`]: {fill: '#456e97',}}}/>
           </div>
            <div className='pti-tti'>
              <div className='pti'>
                  <div className="pti-circle"><CircleIcon style={{fill:'red',fontSize:'13'}}></CircleIcon></div> <div style={{fontSize:16}}>PTI : {props.newdata.pti.value}</div>
              </div>
              <div className='tti'>
                  <div className="tti-circle"><CircleIcon style={{fill:'red',fontSize:'13'}}></CircleIcon></div> <div style={{fontSize:16}}>TTI : {props.newdata.tti.value}</div>
              </div>
            </div>
        </div>
        
        <IonCardTitle className='crashes-title' style={{ color: 'white' }}>
                  Congestion By County
        </IonCardTitle>
        <div className=" crash-counties congestion-tour-counties">
              {props.newdata.countyCongestion.map((county:any, index:number) => {
                  return (
                    <div className='crashes-counties-with-bar' key={county.name}>   
                      <div className='crashes-counties-and-percentage'>               
                         <div>{county.name} : {Math.floor(county.miles)}</div> <div className='percentage'> {Math.floor(((county.miles)/Number(props.newdata.congested_miles.value))*100)}% </div>
                      </div>
                      <div style={{ width: '100%' }}> 
                         <BorderLinearProgress variant="determinate" value={Math.floor(((county.miles)/Number(props.newdata.congested_miles.value))*100)} />
                      </div>
                    </div>
                  ); 
              })} 
        </div>
        <div className='crash-last-updated'>{props.content.updated}</div>
    </IonCard>
    {/* <IonAlert
          isOpen={modalOpen}
          header={props.content.title}
          subHeader={"Source: " + props.content.source}
          message={props.content.description}
          buttons={[{text:"More Information", handler: handleOkay}]}
          onDidDismiss={closeModal}
          cssClass="bigger-alert"
        ></IonAlert>

        <Tour
          steps={steps}
          isOpen={isTour}
          accentColor="black"
          onRequestClose={() => {
            tourService.GoBack(history);
          }}
        /> */}
         <Dialog
      className='alert-class'
        open={modalOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={closeModal}
        aria-describedby="alert-dialog-slide-description"
      >
        {/* <DialogTitle className='alert-title'>{props.content.title}</DialogTitle> */}
        <h3 className='alert-title'>Congestion Miles</h3>
        <DialogContent>
        <h6 className='alert-source'>
        {"Source: " + props.newdata.congested_miles.notes.source}
        </h6>
          <DialogContentText id="alert-dialog-slide-description">
            {props.newdata.congested_miles.notes.Description}
          </DialogContentText>
        </DialogContent>
        <div className='alert-buttons'>
          <Button onClick={closeModal}>Close</Button>
          <Button onClick={handleOkay}>More Information</Button>
        </div>
      </Dialog>
    

  </>
   
    );
};
export default GraphDataCard;

