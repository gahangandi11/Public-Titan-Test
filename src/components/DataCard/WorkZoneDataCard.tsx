import React,{ useRef, useEffect,useState } from 'react';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonItem, IonIcon, IonAlert, IonRouterLink,IonLabel } from '@ionic/react';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import Stack from '@mui/material/Stack';
import { DataCardContent } from "../../interfaces/DataCardContent";
import { CountyData } from "../../interfaces/CountyData";
// import ProgressBar from "@ramonak/react-progress-bar";
import "./WorkZoneDataCard.css"
import { green } from '@material-ui/core/colors';
import { colorFill } from 'ionicons/icons';
import { color } from '@mui/system';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { styled } from '@mui/material/styles';
import { useHistory } from 'react-router-dom';
import { LineChart } from '@mui/x-charts/LineChart';
import CircleIcon from '@mui/icons-material/Circle';
import { BarChart } from '@mui/x-charts/BarChart';

import Tooltip from '@mui/material/Tooltip';

interface GraphDataCardprops {
  content: DataCardContent;
  crashList: CountyData[];
  newdata:any;
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


const WorkZoneDataCard: React.FC<GraphDataCardprops> =(props:GraphDataCardprops)=> {
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
  
  const clearanceValues = props.newdata.dowWzCongestion.map((day:any )=> Math.floor(day.delay));
  const dayNames = props.newdata.dowWzCongestion.map((day:any) => day.name.substring(0, 3));   
  console.log(clearanceValues)
  console.log(dayNames)

    return(
  <>
    <IonCard  className='workzone-main-container'>
            <IonCardTitle className="crash-data-card-title">
              <div className='crashes-header-title'>WorkZones</div>
              <Tooltip title="More Information">
              <div onClick={openModal} className="crashes-data-card-icon">
                <IonIcon className='colorin' color="light" ios={props.content.ios} md={props.content.md}/>
              </div>
              </Tooltip>
            </IonCardTitle>

            <div className='workone'>

                    <div className="workzone-line-chart">
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
                                yAxis={[{label: 'Congestion',fill:'white'}]}
                                series={[
                                {
                                    data: clearanceValues,
                                },
                                ]}
                                dataset={props.newdata.dowWzCongestion}
                                width={300}
                                height={210}
                            />
                
                    </div>
                    <div className='work-zone-info'>
                        {/* <div className='work-zone-info-child'>
                            <CircleIcon style={{fill:'red',fontSize:'13'}}></CircleIcon> Number of WorkZones: {props.newdata.Workzones}
                        </div>
                        <div className='work-zone-info-child'>
                            <CircleIcon style={{fill:'red',fontSize:'13'}}></CircleIcon> Avg. Queue Lengths : {props.newdata['Queue Lengths']}
                        </div>
                        <div className='work-zone-info-child'>
                            <CircleIcon style={{fill:'red',fontSize:'13'}}></CircleIcon> Congested Hours : {props.newdata['Congested Hours']}
                        </div> */}

                        <Table striped bordered hover>
                              <tbody>
                                  <tr>
                                    <td>Number of WorkZones</td>
                                    <td>{props.newdata.Workzones.value}</td>
                                  </tr>
                                  <tr>
                                    <td>Avg. Queue Length</td>
                                    <td>{props.newdata['Queue Lengths'].value}</td>
                                  </tr>
                                  <tr>
                                    <td>Congested Hours</td>
                                    <td>{props.newdata['Congested Hours'].value}</td>
                                  </tr>                                
                              </tbody>
                          </Table>
                    </div>
          
            </div>
        <IonCardTitle className='crashes-title' style={{ color: 'white' }}>
                  Congestion By Road
        </IonCardTitle>
      
        
            <div className='bar-chart'>
                    <BarChart
                        dataset={props.newdata.roadWzCongestion}
                        yAxis={[{ scaleType: 'band', dataKey: 'name' }]}
                        // xAxis={[{label:'rainfall'}]}
                        width={200}
                        height={290}
                        series={[{ dataKey: 'delay',label:'Congestion'}]}
                        layout="horizontal"
                        sx={{
            
                        "& .MuiChartsAxis-left .MuiChartsAxis-tickLabel":{
                            strokeWidth:1.2,
                            fill:"white",
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
export default WorkZoneDataCard;

