import React,{useState} from 'react';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonItem, IonIcon, IonAlert } from '@ionic/react';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import Stack from '@mui/material/Stack';
import { DataCardContent } from "../../interfaces/DataCardContent";
import { CountyData } from "../../interfaces/CountyData";
import ProgressBar from "@ramonak/react-progress-bar";
import "./FreewayDataCard.css"
import { green } from '@material-ui/core/colors';
import { BarChart } from '@mui/x-charts/BarChart';
import { useHistory } from 'react-router-dom';
interface GraphDataCardprops {
  content: DataCardContent;
  crashList: CountyData[];
  newdata:any;
}


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
    return(
  <>
    <IonCard className='freeway-main-container'>
            <IonCardTitle className="freeway-data-card-title">
              <div className='freeway-header-title'>{props.content.title}</div>
              <div onClick={openModal} className="freeway-data-card-icon">
                <IonIcon  color="light" ios={props.content.ios} md={props.content.md}/>
              </div>
            </IonCardTitle>
        
        <div className="freeway-gauge-container">
            <Gauge width={200} height={150} value={Number(props.newdata.Active)} startAngle={-110} endAngle={110} valueMax={100} innerRadius="75%"
                outerRadius="100%" sx={{[`& .${gaugeClasses.valueArc}`]: {
                  fill: '#ec4561',
                },[`& .${gaugeClasses.valueText}`]: {fontSize: 60,transform: 'translate(0px, 0px)',},[`& .${gaugeClasses.referenceArc}`]: {fill: '#456e97',},} }
                text={
                  ({ value, valueMax }) => `${value}%`
                  }
                />
        </div>
          
        <IonCardTitle className='freeway-graph-title' style={{ color: 'white' }}>
                  Freeway counts By Highway
        </IonCardTitle>
        
       <div className='freeway-bar-chart'>
          <BarChart
            dataset={props.newdata.roadAadt}
            yAxis={[{ scaleType: 'band', dataKey: 'name' }]}
            // xAxis={[{label:'rainfall'}]}
            width={270}
            height={290}
            series={[{ dataKey: 'lane_Volume',label:'Freeway Counts'}]}
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
        <div className='freeway-last-updated'>{props.content.updated}</div>
    </IonCard>

    <IonAlert
          isOpen={modalOpen}
          header={props.content.title}
          subHeader={"Source: " + props.content.source}
          message={props.content.description}
          buttons={[{text:"More Inforamtion", handler: handleOkay}]}
          onDidDismiss={closeModal}
          cssClass="bigger-alert"
        ></IonAlert>
    

  </>
   
    );
};
export default GraphDataCard;


