import React,{useState} from 'react';
import { IonCard, IonCardTitle, IonIcon} from '@ionic/react';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { DataCardContent } from "../../interfaces/DataCardContent";
import { CountyData } from "../../interfaces/CountyData";
import { BarChart } from '@mui/x-charts/BarChart';
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
    history.push('/app-center/TrafficCounts');  // Navigate to the desired path
  };
  const steps = tourService.getStepsFor("Dashboard");
const isTour = tourService.StartTour();


    return(
  <>
    <IonCard className='card-main-container freeway-tour-main'>
            <IonCardTitle className="data-card-title">
              <div className='card-header-title'>{props.content.title}</div>
              <Tooltip title="More Information">
              <div onClick={openModal} className="data-card-icon freeway-data-card-icon freeway-tour-icon">
                <IonIcon className='remove-pointer' color="light" ios={props.content.ios} md={props.content.md}/>
              </div>
              </Tooltip>
            </IonCardTitle>
        
        <div className="freeway-gauge-container freeway-tour-gauge">
            <Gauge width={200} height={150} value={Number(props.content.Active.value)} startAngle={-110} endAngle={110} valueMax={100} innerRadius="75%"
                outerRadius="100%" sx={{[`& .${gaugeClasses.valueArc}`]: {
                  fill: '#ec4561',
                },[`& .${gaugeClasses.valueText}`]: {fontSize: 60,transform: 'translate(0px, 0px)',},[`& .${gaugeClasses.referenceArc}`]: {fill: '#456e97',},} }
                text={
                  ({ value, valueMax }) => `${value}%`
                  }
                />
        </div>
          
        <IonCardTitle className='card-graph-title' style={{ color: 'white' }}>
                  Data Rate
        </IonCardTitle>
        
       <div className='freeway-bar-chart freeway-tour-chart'>
          <BarChart
            dataset={props.content.roadAadt}
            yAxis={[{ scaleType: 'band', dataKey: 'name' }]}
            // xAxis={[{label:'rainfall'}]}
            width={270}
            height={290}
            series={[{ dataKey: 'lane_Volume',label:'Freeway Counts By Highway'}]}
            layout="horizontal"
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
            "& .MuiChartsAxis-top .MuiChartsAxis-label":{
              fill:"white",
            }
            }}
      />
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
          accentColor="black"
          startAt={0}

          onRequestClose={() => {

            tourService.GoBack(history);
          }}
        />
    

  </>
   
    );
};
export default GraphDataCard;


