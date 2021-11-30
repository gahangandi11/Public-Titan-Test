import {
    IonButton,
    IonCard,
    IonCardContent,
    IonCardTitle,
    IonContent,
    IonIcon, IonLabel,
    IonPage,
    IonRow,
    IonSelect, IonSelectOption
} from '@ionic/react';
import React, {useEffect, useState} from 'react';
import Downloads from '../../components/Downloads/Downloads';
import Header from '../../components/Header/Header';
import Select from 'react-dropdown-select';
import './DataDownload.css';
import DateTimes from '../../components/Forms/DateTimes';
import SelectableFields from '../../components/Forms/SelectableFields';
import FileName from '../../components/Forms/FileName';
import CountySelector from '../../components/Forms/CountySelector';
import bigQueryService from '../../services/bigQueryService';
import {FormRequest} from '../../interfaces/FormRequest';
import {getUser} from '../../firebaseConfig';
import {downloadOutline, downloadSharp} from 'ionicons/icons';
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

    const [showSelectables, setShowSelectables] = useState(false);

    function changePage(option: {name: string, value: string}) {
        setPage(option);
        handleStartDateChange(oneWeekAgo);
        handleEndDateChange(new Date());
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
                break;

            case 'waze_jam_query':
                break;

            case 'transcore_incident_query':
                break;

            case 'transcore_detector_query':
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
        const uid = getUser()?.uid;
        if (uid != null) {
            const countyValues: string[] = [];
            if (counties.length > 0) {
                counties.forEach(county => {
                    countyValues.push(county.value);
                })
            }
            const formRequest = new FormRequest(uid, page.value, convertDateToString(startSelectedDate), convertDateToString(endSelectedDate), file, countyValues, [0, 1, 2, 3], interval, unit);

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
        <IonPage>

            <Header title="Data Download" />
            <IonContent color="dark">
                <IonRow className="ion-justify-content-center download__container">
                    <IonCard color="primary" className="download__card">
                        <div className='download__icon download__green'>
                            <IonIcon size="large" color="dark" ios={downloadOutline} md={downloadSharp} />
                        </div>
                        <IonCardContent className="download__card__content">
                            <IonLabel>{page.name}</IonLabel>
                            <IonSelect value={page} interface="popover" placeholder="Select Database" onIonChange={e => setPage(e.detail.value)}>
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
                            <DateTimes startDate={startSelectedDate}
                                       endDate={endSelectedDate}
                                       handleStartDateChange={handleStartDateChange}
                                       handleEndDateChange={handleEndDateChange}
                                       form={page.name} />
                            {showSelectables && <SelectableFields unit={unit} interval={interval} setUnit={setUnit} setInterval={setInterval} form={page.name} />}
                            <FileName file={file} setFile={setFile} form={page.name} /><br />
                            <CountySelector counties={counties} setCounties={setCounties} width='county-small' /><br />
                            <IonButton color="secondary" type="submit" onClick={submit}>Submit Query</IonButton>
                        </IonCardContent>
                    </IonCard>
                </IonRow>
                <IonRow className="ion-justify-content-center">
                    <Downloads page={page.value} />
                </IonRow>
            </IonContent>
        </IonPage>
    );
};

export default DataDownload;
