import {
    IonButton,
    IonCard,
    IonCardContent,
    IonCheckbox,
    IonContent,
    IonIcon, IonItem, IonLabel,
    IonPage,
    IonRow,
    IonSelect, IonSelectOption, IonRadioGroup, IonRadio
} from '@ionic/react';
import React, {useEffect, useState} from 'react';
import Downloads from '../../components/Downloads/Downloads';
import Header from '../../components/Header/Header';
import './DataDownload.css';
import DateTimes from '../../components/Forms/DateTimes';
import SelectableFields from '../../components/Forms/SelectableFields';
import FileName from '../../components/Forms/FileName';
import bigQueryService from '../../services/bigQueryService';
import {FormRequest} from '../../interfaces/FormRequest';
import {downloadOutline, downloadSharp} from 'ionicons/icons';
import AuthProvider, {useAuth} from '../../services/contexts/AuthContext/AuthContext';
import { detectorCounties, probeCounties, wazeIncidentsCounties, wazeJamCounties } from '../../assets/counties';
import { countiesWithAlias as countiesMO } from '../../assets/counties';
import CountySelectorWithAlias from '../../components/Forms/CountySelectorWithAlias';

import tourService from "../../services/tourService";
import Tour from "reactour";
import { useHistory} from "react-router";
import Button from '@mui/material/Button';


import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';


const oneWeekAgo = new Date();
oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
const pages: {name: string, value: string}[] = [
    {
        name: 'Probe',
        value: 'inrix_probe_query'
    },
    {
        name: 'WazeIncident',
        value: 'waze_incident_query'
    },
    {
        name: 'WazeJam',
        value: 'waze_jam_query'
    },
    {
        name: 'Incidents',
        value: 'transcore_incident_query'
    },
    {
        name: 'Detector',
        value: 'transcore_detector_query'
    },
];

const options = [
    {
        name: 'Travel Time',
        selected: false
    },
    {
        name: 'Speed',
        selected: false
    },
    {
        name: 'Average Speed',
        selected: false
    },
    {
        name: 'Reference Speed',
        selected: false
    }
];

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
  

const DataDownload: React.FC = () => {
    // const storedPage = localStorage.getItem("page");
    // const [page, setPage] = useState<{name: string, value: string}>(storedPage ? JSON.parse(storedPage) : pages[0]);
    const [page, setPage] = useState(pages[0]);
    const [pageAlert, setPageAlert] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    console.log('page Name:',page);
    const [startSelectedDate, handleStartDateChange] = useState<Date | null>(oneWeekAgo);
    const [endSelectedDate, handleEndDateChange] = useState<Date | null>(new Date());
    const [unit, setUnit] = useState<number>(60);
    const [interval, setInterval] = useState<number>(60);
    const [file, setFile] = useState<string>(page.name);
    const [counties, setCounties] = useState<{name: string, value: string[]}[]>([]);

    const { currentUser } = useAuth();

    const [attributeOptions, setAttributeOptions] = useState(options);

    const [showSelectables, setShowSelectables] = useState(false);

    const openModal = () => {
         setModalOpen(true);
      };
    
      const closeModal = () => {
        setModalOpen(false);
      };
    

    function getCountyList(pageName:string)
    {
        switch(pageName)
        {
            case "Probe": return probeCounties;
            case "WazeIncident": return wazeIncidentsCounties;
            case "WazeJam": return wazeJamCounties;
            case "Detector": return detectorCounties;
            default:return countiesMO;

        }
    }

    function changePage(option: {name: string, value: string}) {
        console.log('pageAlert in changePage:',pageAlert);
        setPageAlert(false);
        setPage(option);
        handleStartDateChange(oneWeekAgo);
        handleEndDateChange(new Date());
        setAttributeOptions(options);
        setUnit(60);
        setInterval(60);
        setFile(option.name);
        setShowSelectables(false);
        switch (option.value) {
            case 'inrix_probe_query':
                setShowSelectables(true);
                break;
            case 'waze_incident_query':
                setAttributeOptions([
                    {name: 'Major Accidents', selected: false},
                    {name: 'Minor Accidents', selected: false},
                    {name: 'Construction', selected: false},
                    {name: 'Jam', selected: false},
                    {name: 'Road Closed', selected: false}
                ]);
                break;

            case 'waze_jam_query':
                setAttributeOptions([]);
                break;

            case 'transcore_incident_query':
                setAttributeOptions([
                    {name: 'Incidents', selected: false},
                    {name: 'Construction', selected: false}
                ]);
                break;

            case 'transcore_detector_query':
                setAttributeOptions([]);
                setShowSelectables(true);
                break;
        }
        // setCounties(getCountyList(option.name).slice(0,5))

    }

    function convertDateToString(date: Date | null) {
        let startDate;
        if (date != null) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            startDate = date.toLocaleString("en-GB", {hourCycle: "h24"});
            startDate = startDate.replaceAll('/','-');
            startDate = startDate.replace(',','');
            const tempDate = startDate.split(' ')[0];
            const day = tempDate.split('-')[0];
            const month = tempDate.split('-')[1];
            const year = tempDate.split('-')[2];
            return year + "-" + month + "-" + day;
        } else {
            alert('Error parsing date.');
            return '2000-05-02';
        }
    }

    function submit() {
        console.log('pageAlert in submit:',pageAlert);
        
        if(pageAlert)
        {
            openModal();
        }
        else{

        const uid = currentUser.uid;
        if (uid != null) {
            const countyValues: string[] = [];
            if (counties.length > 0) {
                counties.forEach(county => {
                    countyValues.push(...county.value);
                })
            }
            const optionsSelected: number[] = [];
            attributeOptions.forEach((option, i) => {
                if (option.selected) {
                    optionsSelected.push(i);
                }
            });
            const formRequest = new FormRequest(uid, page.value, convertDateToString(startSelectedDate), convertDateToString(endSelectedDate), file, countyValues, optionsSelected, interval, unit);

            switch (page.value) {
                case 'inrix_probe_query':
                    bigQueryService.queryProbeData(formRequest);
                    break;
                case 'waze_incident_query':
                    bigQueryService.queryWazeIncidentData(formRequest);
                    break;

                case 'waze_jam_query':
                    bigQueryService.queryWazeJamData(formRequest);
                    break;

                case 'transcore_incident_query':
                    bigQueryService.queryIncidentsData(formRequest);
                    break;

                case 'transcore_detector_query':
                    bigQueryService.queryDetectorData(formRequest);
                    break;
            }
        }
      }
    }

    useEffect(() => {
        changePage(pages[0]);
        setPageAlert(true);
    }, []);

    const steps = tourService.getStepsFor("Downloads");
    const isTour = tourService.StartTourData();
    const history = useHistory();

    return (
        
            <IonPage>
                <Header title="Data Download" />
                <IonContent color="light">
                    <IonRow className="ion-justify-content-center download__container">
                        <IonCard className="download__card">
                            <div className='download__icon download__green first-step-tutorial'>
                                <IonIcon size="large" color="light" ios={downloadOutline} md={downloadSharp} />
                            </div>
                            <div className="download__card__content">
                                <IonLabel className='second-step-tutorial'>{page.name}</IonLabel>
                                {/* <IonSelect color="light" value={page} interface='alert'  placeholder="Select Database"  onIonChange={e => changePage(e.detail.value)}>
                                    <IonSelectOption  value={{name: 'Probe', value: 'inrix_probe_query'}}>
                                        Probe 
                                    </IonSelectOption>
                                    
                                    <IonSelectOption value={{
                                        name: 'WazeJam',
                                        value: 'waze_jam_query'
                                    }}>
                                        Waze Jam 
                                    </IonSelectOption>
                                    <IonSelectOption value={{
                                        name: 'Incidents',
                                        value: 'transcore_incident_query'
                                    }}>
                                        Incidents 
                                    </IonSelectOption>
                                    <IonSelectOption value={{
                                        name: 'Detector',
                                        value: 'transcore_detector_query'
                                    }}>
                                        Detector 
                                    </IonSelectOption>
                                    <IonSelectOption value={{
                                        name: 'WazeIncident',
                                        value: 'waze_incident_query'
                                    }}>
                                        Waze Incidents 
                                    </IonSelectOption>
                                </IonSelect> */}
                                 <div className='database-selector'>Select database Below:</div>
                                 <IonRadioGroup value={page} onIonChange={e => changePage(e.detail.value)} className='radio-buttons'>
                                    <IonItem>
                                        <IonLabel>Probe</IonLabel>
                                        <IonRadio slot="start" value={{name: 'Probe', value: 'inrix_probe_query'}} />
                                    </IonItem>
                                    
                                    <IonItem>
                                        <IonLabel>Waze Jam</IonLabel>
                                        <IonRadio slot="start" value={{name: 'WazeJam', value: 'waze_jam_query'}} />
                                    </IonItem>

                                    <IonItem>
                                        <IonLabel>Incidents</IonLabel>
                                        <IonRadio slot="start" value={{name: 'Incidents', value: 'transcore_incident_query'}} />
                                    </IonItem>

                                    <IonItem>
                                        <IonLabel>Detector</IonLabel>
                                        <IonRadio slot="start" value={{name: 'Detector', value: 'transcore_detector_query'}} />
                                    </IonItem>

                                    <IonItem>
                                        <IonLabel>Waze Incidents</IonLabel>
                                        <IonRadio slot="start" value={{name: 'WazeIncident', value: 'waze_incident_query'}} />
                                    </IonItem>
                                </IonRadioGroup>
                            </div>
                            <div className='query-selectors'>
                                <div className="forms-container">
                                    <DateTimes startDate={startSelectedDate}
                                               endDate={endSelectedDate}
                                               handleStartDateChange={handleStartDateChange}
                                               handleEndDateChange={handleEndDateChange}
                                               form={page.name} />
                                    {attributeOptions.length > 0 &&
                                        <div>
                                            {/* <IonItem color="secondary"> */}
                                                <div  className="attributes-container">
                                                    {attributeOptions.map((option) => {
                                                        return (
                                                            // <IonItem color="secondary" lines="none" className="attribute-option" key={option.name}>
                                                            <div key={option.name} className="attribute-option">
                                                                <IonLabel>{option.name}</IonLabel>
                                                                <IonCheckbox slot="end" onIonChange={() => option.selected = !option.selected} checked={option.selected} />
                                                            </div>
                                                            // </IonItem>
                                                        );
                                                    })}
                                                </div>
                                            {/* </IonItem> */}
                                        </div>
                                    }
                                    <div>
                                    {showSelectables && <SelectableFields unit={unit} interval={interval} setUnit={setUnit} setInterval={setInterval} form={page.name} />}
                                    
                                    </div>
                                    <div >
                                    <FileName file={file} setFile={setFile} form={page.name} />
                                    </div>
                                    
                                </div>
                                <br />
                                <CountySelectorWithAlias counties={counties} setCounties={setCounties} options={countiesMO} width='county-small' type="counties" />
                                <br />
                                <IonButton  color="secondary" type="submit" onClick={submit}>Submit Query</IonButton>
                            </div>
                        </IonCard>
                    </IonRow>
                    <IonRow className="ion-justify-content-center">
                        
                            <Downloads page={page.value} />
                        
                    </IonRow>
                   
                    <Dialog
      className='alert-class'
        open={modalOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={closeModal}
        aria-describedby="alert-dialog-slide-description"
      >
        {/* <DialogTitle className='alert-title'>{props.content.title}</DialogTitle> */}
        <h3 className='alert-title'>Database Alert</h3>
        <DialogContent>
       
          <DialogContentText id="alert-dialog-slide-description">
            Please select database
          </DialogContentText>
        </DialogContent>
        <div className='alert-buttons'>
          <Button onClick={closeModal}>Close</Button>
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
                </IonContent>
            </IonPage>
        
    );
};

export default DataDownload;
