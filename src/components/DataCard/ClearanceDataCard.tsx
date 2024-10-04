import React, { useState } from 'react';
import { IonCard, IonCardTitle, IonIcon, IonAlert } from '@ionic/react';
import { DataCardContent } from "../../interfaces/DataCardContent";
import { CountyData } from "../../interfaces/CountyData";
import { useHistory } from 'react-router-dom';
import { LineChart } from '@mui/x-charts/LineChart';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CircleIcon from '@mui/icons-material/Circle';
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
  content: any;
}



const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ClearanceDataCard: React.FC<GraphDataCardprops> = (props: GraphDataCardprops) => {


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

  const clearanceValues = props.content.weekdayClearance.map((day: any) => Math.floor(day.clearance));
  const dayNames = props.content.weekdayClearance.map((day: any) => day.name.substring(0, 3));

  const steps = tourService.getStepsFor("Dashboard");
  const isTour = tourService.StartTour();

  return (
    <>
      <IonCard className='card-main-container clearance-tour-main'>
        <IonCardTitle className="data-card-title">
          <div className='card-header-title'>{props.content.title}</div>
          <Tooltip title="More Information">
            <div onClick={openModal} className="data-card-icon clearance-data-card-icon clearance-tour-icon">
              <IonIcon className='remove-pointer' color="light" aria-label="myicon" ios={props.content.ios} md={props.content.md} />
            </div>
          </Tooltip>
        </IonCardTitle>

        <div className="clearance-gauge-container clearance-tour-gauge">
          <LineChart
            sx={{
              "& .MuiChartsAxis-left .MuiChartsAxis-tickLabel": {
                strokeWidth: "0.4",
                fill: "white"
              },
              "& .MuiChartsAxis-left .MuiChartsAxis-tick": {
                stroke: "white"
              },
              "& .MuiChartsAxis-bottom .MuiChartsAxis-tick": {
                stroke: "white"
              },
              "& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel": {
                strokeWidth: "0.5",
                fill: "white"
              },
              "& .MuiChartsAxis-bottom .MuiChartsAxis-line": {
                stroke: "white",
                strokeWidth: 1.2
              },
              "& .MuiChartsAxis-left .MuiChartsAxis-line": {
                stroke: "white",
                strokeWidth: 1.2
              },
              "& .MuiChartsAxis-left .MuiChartsAxis-label": {

                fill: 'white'
              },
            }}
            xAxis={[{ scaleType: "point", data: dayNames }]}
            yAxis={[{ label: 'Clearance Time' }]}
            series={[
              {
                data: clearanceValues,
              },
            ]}
            dataset={props.content.weekdayClearance}
            width={285}
            height={210}

          />

        </div>
        <IonCardTitle className='card-graph-title' style={{ color: 'white' }}>
          Clearance Time By County
        </IonCardTitle>
        <div className='counties-and-time clearance-tour-counties'>
          {
            props.content.countyClearance.map((day: any, index: number) => {
              return (
                <div key={index} className='county-and-arrow'>
                  <CircleIcon className='circle-dot' style={{ fill: 'white', fontSize: 12 }}></CircleIcon>
                  <div key={day.name}>{day.name} : {Math.floor(day.clearance)}</div>
                  {day.clearance > props.content.clearance_time ?
                    <ArrowUpwardIcon className='arrow' style={{ color: 'red', fontSize: 20 }}></ArrowUpwardIcon>
                    : <ArrowDownwardIcon className='arrow' style={{ color: 'green', fontSize: 20 }}></ArrowDownwardIcon>
                  }
                </div>
              )
            })
          }
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
export default ClearanceDataCard;
