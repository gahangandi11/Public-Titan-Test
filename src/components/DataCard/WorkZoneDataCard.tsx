import React, { useState } from 'react';
import { IonCard, IonCardTitle, IonIcon } from '@ionic/react';
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useHistory } from 'react-router-dom';
import { LineChart } from '@mui/x-charts/LineChart';
import { BarChart } from '@mui/x-charts/BarChart';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

import './AllCardsStyles.css'

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


const WorkZoneDataCard: React.FC<GraphDataCardprops> = (props: GraphDataCardprops) => {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => {
    if (props.content.Workzones.notes.source != "N/A") setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const history = useHistory();

  const handleOkay = () => {
    closeModal();  
    history.push('/app-center/TranscoreAnalytics');  
  };

  const clearanceValues = props.content.dowWzCongestion.map((day: any) => Math.floor(day.delay));
  const dayNames = props.content.dowWzCongestion.map((day: any) => day.name.substring(0, 3));


  return (
    <>
      <IonCard className='card-main-container'>
        <IonCardTitle className="data-card-title">
          <div className='card-header-title'>WorkZones</div>
          <Tooltip title="More Information">
            <div onClick={openModal} className="data-card-icon workzone-data-card-icon">
              <IonIcon className='remove-pointer' color="light" ios={props.content.ios} md={props.content.md} />
            </div>
          </Tooltip>
        </IonCardTitle>
        <div className='workone'>
          <div className="workzone-line-chart">
            <LineChart className='line-chart'
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

                  fill: 'white',
                  transform: "translate(-10px,0)",
                },
              }}
              xAxis={[{ scaleType: "point", data: dayNames }]}
              yAxis={[{ label: 'Congestion Hours', fill: 'white', labelStyle: { fontSize: 14, fontWeight: 'bold', } }]}
              series={[{data: clearanceValues, label: 'Congestion by Day of Week'},]}
              margin={{ left: 70 }}
              dataset={props.content.dowWzCongestion}
            />
          </div>
          <div className='work-zone-info'>
            <Table striped bordered hover>
              <tbody>
                <tr>
                  <td>Number of WorkZones</td>
                  <td>{props.content.Workzones.value}</td>
                </tr>
                <tr>
                  <td>Avg. Queue Length (ft)</td>
                  <td>{props.content.QueueLengths.value}</td>
                </tr>
                <tr>
                  <td>Congested Hours</td>
                  <td>{props.content.CongestedHours.value}</td>
                </tr>
              </tbody>
            </Table>
          </div>
          <div className='bar-chart'>
            <BarChart
              dataset={props.content.roadWzCongestion}
              yAxis={[{ scaleType: 'band', dataKey: 'name' }]}
              series={[{ dataKey: 'delay', label: 'Congestion Hours by Road' }]}
              margin={{ left: 200 }}
              layout="horizontal"
              sx={{
                "& .MuiChartsAxis-left .MuiChartsAxis-tickLabel": {
                  strokeWidth: 1.2,
                  fill: "white",
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
                "& .MuiChartsAxis-top .MuiChartsAxis-label": {
                  fill: "white",
                }
              }}
            />
          </div>
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
        <h3 className='alert-title'>Work Zones</h3>
        <DialogContent>
          <h6 className='alert-source'>
            {"Source: " + props.content.Workzones.notes.source}
          </h6>
          <DialogContentText id="alert-dialog-slide-description">
            {props.content.Workzones.notes.Description}
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
export default WorkZoneDataCard;

