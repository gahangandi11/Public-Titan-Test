import {
    IonButton,
    IonCard,
    IonCardContent,
    IonCheckbox,
    IonContent,
    IonIcon, IonItem, IonLabel,
    IonPage,
    IonRow,
    IonSelect, IonSelectOption
} from '@ionic/react';
import React, {useEffect, useState} from 'react';
import Downloads from '../../components/Downloads/Downloads';
import Header from '../../components/Header/Header';
import './DataDownload.css';
import DateTimes from '../../components/Forms/DateTimes';
import SelectableFields from '../../components/Forms/SelectableFields';
import FileName from '../../components/Forms/FileName';
import CountySelector from '../../components/Forms/CountySelector';
import bigQueryService from '../../services/bigQueryService';
import {FormRequest} from '../../interfaces/FormRequest';
import {downloadOutline, downloadSharp} from 'ionicons/icons';
import AuthProvider, {useAuth} from '../../services/contexts/AuthContext/AuthContext';
import { detectorCounties, probeCounties, wazeIncidentsCounties, wazeJamCounties } from '../../assets/counties';
import { counties as countiesMO } from '../../assets/counties';

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

const DataDownload: React.FC = () => {
    // const storedPage = localStorage.getItem("page");
    // const [page, setPage] = useState<{name: string, value: string}>(storedPage ? JSON.parse(storedPage) : pages[0]);
    const [page, setPage] = useState(pages[0]);
    const [startSelectedDate, handleStartDateChange] = useState<Date | null>(oneWeekAgo);
    const [endSelectedDate, handleEndDateChange] = useState<Date | null>(new Date());
    const [unit, setUnit] = useState<number>(60);
    const [interval, setInterval] = useState<number>(60);
    const [file, setFile] = useState<string>(page.name);
    const [counties, setCounties] = useState<{name: string, value: string}[]>([
        {name: 'Saint Charles', value: 'St. Charles'},
        {name: 'Saint Louis', value: 'St. Louis'},
        {name: 'Saint Louis City', value: 'St. Louis City'},
        {name: 'Franklin', value: 'Franklin'},
        {name: 'Jefferson', value: 'Jefferson'}
    ]);

    const { currentUser } = useAuth();

    const [attributeOptions, setAttributeOptions] = useState(options);

    const [showSelectables, setShowSelectables] = useState(false);

    function getCountyList()
    {
        switch(page.name)
        {
            case "Probe": return probeCounties;
            case "WazeIncident": return wazeIncidentsCounties;
            case "WazeJam": return wazeJamCounties;
            case "Detector": return detectorCounties;
            default:return countiesMO;

        }
    }

    function changePage(option: {name: string, value: string}) {
        setPage(option);
        handleStartDateChange(oneWeekAgo);
        handleEndDateChange(new Date());
        setAttributeOptions(options);
        setUnit(60);
        setInterval(60);
        setFile(option.name);
        setCounties([
            {name: 'Saint Charles', value: 'St. Charles'},
            {name: 'Saint Louis', value: 'St. Louis'},
            {name: 'Saint Louis City', value: 'St. Louis City'},
            {name: 'Franklin', value: 'Franklin'},
            {name: 'Jefferson', value: 'Jefferson'}
        ]);
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
        const uid = currentUser.uid;
        if (uid != null) {
            const countyValues: string[] = [];
            if (counties.length > 0) {
                counties.forEach(county => {
                    countyValues.push(county.value);
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

    useEffect(() => {
        changePage(pages[0]);
    }, []);

    return (
        <AuthProvider>
            <IonPage>
                <Header title="Data Download" />
                <IonContent color="light">
                    <IonRow className="ion-justify-content-center download__container">
                        <IonCard className="download__card">
                            <div className='download__icon download__green'>
                                <IonIcon size="large" color="light" ios={downloadOutline} md={downloadSharp} />
                            </div>
                            <IonCardContent className="download__card__content">
                                <IonLabel>{page.name}</IonLabel>
                                <IonSelect color="light" value={page} interface="popover" placeholder="Select Database" onIonChange={e => changePage(e.detail.value)}>
                                    <IonSelectOption value={{name: 'Probe', value: 'inrix_probe_query'}}>
                                        Probe Database
                                    </IonSelectOption>
                                    <IonSelectOption value={{
                                        name: 'WazeJam',
                                        value: 'waze_jam_query'
                                    }}>
                                        Waze Jam Database
                                    </IonSelectOption>
                                    <IonSelectOption value={{
                                        name: 'Incidents',
                                        value: 'transcore_incident_query'
                                    }}>
                                        Incidents Database
                                    </IonSelectOption>
                                    <IonSelectOption value={{
                                        name: 'Detector',
                                        value: 'transcore_detector_query'
                                    }}>
                                        Detector Database
                                    </IonSelectOption>
                                    <IonSelectOption value={{
                                        name: 'WazeIncident',
                                        value: 'waze_incident_query'
                                    }}>
                                        Waze Incidents Database
                                    </IonSelectOption>
                                </IonSelect>
                            </IonCardContent>
                            <IonCardContent>
                                <div className="forms-container">
                                    <DateTimes startDate={startSelectedDate}
                                               endDate={endSelectedDate}
                                               handleStartDateChange={handleStartDateChange}
                                               handleEndDateChange={handleEndDateChange}
                                               form={page.name} />
                                    {attributeOptions.length > 0 &&
                                        <div>
                                            <IonItem color="secondary">
                                                <div  className="attributes-container">
                                                    {attributeOptions.map((option) => {
                                                        return (
                                                            <IonItem color="secondary" lines="none" className="attribute-option" key={option.name}>
                                                                <IonLabel>{option.name}</IonLabel>
                                                                <IonCheckbox slot="end" onIonChange={() => option.selected = !option.selected} checked={option.selected} />
                                                            </IonItem>
                                                        );
                                                    })}
                                                </div>
                                            </IonItem>
                                        </div>
                                    }
                                    {showSelectables && <SelectableFields unit={unit} interval={interval} setUnit={setUnit} setInterval={setInterval} form={page.name} />}
                                    <FileName file={file} setFile={setFile} form={page.name} />
                                </div><br />
                                <CountySelector counties={counties} setCounties={setCounties} options={getCountyList()} width='county-small' /><br />
                                <IonButton color="secondary" type="submit" onClick={submit}>Submit Query</IonButton>
                            </IonCardContent>
                        </IonCard>
                    </IonRow>
                    <IonRow className="ion-justify-content-center">
                        <AuthProvider>
                            <Downloads page={page.value} />
                        </AuthProvider>
                    </IonRow>
                </IonContent>
            </IonPage>
        </AuthProvider>
    );
};

export default DataDownload;
