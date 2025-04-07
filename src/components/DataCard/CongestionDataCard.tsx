import React, { useState } from 'react';
import { IonCard, IonCardTitle, IonIcon } from '@ionic/react';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import CircleIcon from '@mui/icons-material/Circle';
import { styled } from '@mui/material/styles';
import { useHistory } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

import "./AllCardsStyles.css"

interface GraphDataCardprops {
  content: any;
}

import tourService from "../../services/tourService";
import Tour from "reactour";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 12,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: { backgroundColor: '#456e97' },
  [`& .${linearProgressClasses.bar}`]: { borderRadius: 5, backgroundColor: '#ec4561' },
}));

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});


const GraphDataCard: React.FC<GraphDataCardprops> = (props: GraphDataCardprops) => {

  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => {
    if (props.content.congested_miles.notes.source != "N/A") setModalOpen(true);
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



  return (
    <>
      <IonCard className='card-main-container congestion-tour-main'>
        <IonCardTitle className="data-card-title">
          <div className='card-header-title'>Congestion Miles</div>
          <Tooltip title="More Information">
            <div onClick={openModal} className="data-card-icon congestion-data-card-icon congestion-tour-icon">
              <IonIcon className='remove-pointer' color="light" ios={props.content.ios} md={props.content.md} />
            </div>
          </Tooltip>
        </IonCardTitle>

        <div className="congestion-gauge-container  congestion-tour-gauge">
          <div className='gauge-circle'>
            <Gauge width={200} height={150} value={Number(props.content.congested_miles.value)} startAngle={-110} endAngle={110} valueMax={Number(props.content.congested_miles.value)+150} innerRadius="75%" outerRadius="100%"
              sx={{
                [`& .${gaugeClasses.valueArc}`]: { fill: '#ec4561', },
                [`& .${gaugeClasses.valueText}`]: { fontSize: 50, transform: 'translate(0px, 0px)', fill: 'red' },
                [`& .${gaugeClasses.referenceArc}`]: { fill: '#456e97', }
              }} />
          </div>
          <div className='pti-tti'>
            <div className='pti'>
              <div><CircleIcon style={{ fill: 'red', fontSize: '16' }}></CircleIcon></div> <div style={{ fontSize: 20 }}>PTI : {props.content.pti.value}</div>
            </div>
            <div className='pti'>
              <div><CircleIcon style={{ fill: 'red', fontSize: '16' }}></CircleIcon></div> <div style={{ fontSize: 20 }}>TTI : {props.content.tti.value}</div>
            </div>
          </div>
        </div>

        <IonCardTitle className='card-graph-title' style={{ color: 'white' }}>
          Congestion By County
        </IonCardTitle>
        <div className=" counties-list congestion-tour-counties">
          {props.content.countyCongestion.map((county: any, index: number) => {
            return (
              <div key={county.name}>
                <div className='county-and-percentage'>
                  <div>{county.name} : {Math.floor(county.miles)}</div> <div> {Math.floor(((county.miles) / Number(props.content.congested_miles.value)) * 100)}% </div>
                </div>
                <div style={{ width: '100%' }}>
                  <BorderLinearProgress variant="determinate" value={Math.floor(((county.miles) / Number(props.content.congested_miles.value)) * 100)} />
                </div>
              </div>
            );
          })}
        </div>
        <div className='card-last-updated'>{props.content.updated}</div>
      </IonCard>

      <Tour
        steps={steps}
        isOpen={isTour}
        accentColor="black"
        startAt={0}

        onRequestClose={() => {


          tourService.GoBack(history);
        }}
      />
      <Dialog
        className='alert-class'
        open={modalOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={closeModal}
        aria-describedby="alert-dialog-slide-description"
      >
        <h3 className='alert-title'>Congestion Miles</h3>
        <DialogContent>
          <h6 className='alert-source'>
            {"Source: " + props.content.congested_miles.notes.source}
          </h6>
          <DialogContentText id="alert-dialog-slide-description">
            {props.content.congested_miles.notes.Description}
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

