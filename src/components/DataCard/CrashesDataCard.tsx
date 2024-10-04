import React, { useState } from 'react';
import { IonCard, IonCardTitle, IonIcon } from '@ionic/react';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { DataCardContent } from "../../interfaces/DataCardContent";
import { CountyData } from "../../interfaces/CountyData";
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';
import { useHistory } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import tourService from "../../services/tourService";
import Tour from "reactour";
import "./AllCardsStyles.css"

interface GraphDataCardprops {
  content: DataCardContent;
  crashList: CountyData[];
}


const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
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

  return (
    <>
      <IonCard className='card-main-container crashes-tour-main'>
        <IonCardTitle className="data-card-title">
          <div className='card-header-title'>{props.content.title}</div>
          <Tooltip title="More Information">
            <div onClick={openModal} className="data-card-icon crashes-data-card-icon crashes-tour-icon">
              <IonIcon className="remove-pointer" color="light" ios={props.content.ios} md={props.content.md} />
            </div>
          </Tooltip>
        </IonCardTitle>

        <div className="gauge-container crashes-tour-gauge">
          <Gauge width={200} height={150} value={Number(props.content.data)} startAngle={-110} endAngle={110} valueMax={200} innerRadius="75%" outerRadius="100%"
            sx={{
              [`& .${gaugeClasses.valueArc}`]: { fill: '#ec4561', },
              [`& .${gaugeClasses.valueText}`]: { fontSize: 60, transform: 'translate(0px, 0px)', fill: 'red' },
              [`& .${gaugeClasses.referenceArc}`]: { fill: '#456e97', }
            }} />
        </div>

        <IonCardTitle className='card-graph-title' style={{ color: 'white' }}>
          Crash Rates By County
        </IonCardTitle>

        <div className=" counties-list crashes-tour-counties">
          {props.crashList.map((county, index) => {
            return (
              <div key={county.name}>
                <div className='county-and-percentage'>
                  <div>{county.name} : {county.crashes}</div> <div> {Math.floor(((county.crashes) / Number(props.content.data)) * 100)}% </div>
                </div>
                <div style={{ width: '100%' }}>
                  <BorderLinearProgress variant="determinate" value={Math.floor(((county.crashes) / Number(props.content.data)) * 100)} />
                </div>
              </div>
            );
          })}
        </div>
        <div className='card-last-updated'>{props.content.updated}</div>
      </IonCard>

      <Dialog
        className='alert-class'
        open={modalOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={closeModal}
        aria-describedby="alert-dialog-slide-description"
      >
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

