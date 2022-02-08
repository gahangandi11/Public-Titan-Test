import * as React from 'react';
import {
    IonButton,
    IonCard,
    IonCardContent, IonCardHeader,
    IonContent,
    IonItem,
    IonLabel,
    IonPage,
    IonToast,
    IonToggle
} from '@ionic/react';
import Map from '../../components/Map/Map';
import Header from '../../components/Header/Header';
import './Home.css';
import {useEffect, useState} from 'react';
import {Camera} from '../../interfaces/Camera';
import CctvPlayer from '../../components/CctvPlayer/CctvPlayer';
import {Device} from '@capacitor/device';
import {watchCameras} from '../../services/firestoreService';

const Home: React.FC = () => {
    const [weather, setWeather] = useState(false);
    const [wazeIncidents, setWazeIncidents] = useState(false);
    const [wazeJams, setWazeJams] = useState(false);
    const [showCameras, setShowCameras] = useState(false);
    const [displayedCameras, setDisplayedCameras] = useState<Camera[]>([]);
    const [activeCCTV, setActiveCCTV] = useState<Camera>(new Camera());
    const [cameras, setCameras] = useState<Camera[]>([]);
    const [isIOS, setIsIOS] = useState(false);
    const [errorResponse, setErrorResponse] = useState(false);

    const closeCurrentCamera = (id: number) => {
        setDisplayedCameras(displayedCameras.filter(camera => camera.id !== id));
    };

    const cameraError = (error: string, id: number) => {
        setErrorResponse(true);
        const newDisplayedCameras = displayedCameras.filter(camera => camera.id !== id);
        setDisplayedCameras(newDisplayedCameras);
        newDisplayedCameras.length > 0 ? setActiveCCTV(newDisplayedCameras[newDisplayedCameras.length - 1]) : setActiveCCTV(new Camera());
    };

    const setNewCamera = (id: number) => {
        const data = cameras.find(camera => camera.id === id);
        const duplicateCamera = displayedCameras.find(camera => camera.id === id);
        if (data && !duplicateCamera) {
            setDisplayedCameras(camera => [...camera, data as Camera]);
            setActiveCCTV(data as Camera)
        }
    };

    function clearAllSelectedCameras(){
        setDisplayedCameras([]);
    }

    useEffect(() => {
        watchCameras().then(foundCameras => {
            setCameras(foundCameras)
        });
        Device.getInfo().then((info) => {
            setIsIOS(info.operatingSystem === 'ios');
        });
    }, []);

    return (
        <IonPage>
            <Header title={'Home'} />
            <IonContent>
                <div className="home--content">
                    <div className="map--container">
                        <Map weather={weather} jams={wazeJams} incidents={wazeIncidents} cameras={cameras} setId={setNewCamera} showCameras={showCameras} height={1000} zoom={6.5} />
                    </div>
                    <IonCard className="map--toggles">
                        <IonCardContent>
                            <IonItem>
                                <IonLabel>Weather</IonLabel>
                                <IonToggle color='green' value='weather' checked={weather} onIonChange={e => setWeather(e.detail.checked)} />
                            </IonItem>
                            <IonItem>
                                <IonLabel>Cameras</IonLabel>
                                <IonToggle color="green" value="cameras" checked={showCameras} onIonChange={e => setShowCameras(e.detail.checked)} />
                            </IonItem>
                            <IonItem>
                                <IonLabel>Waze Incidents</IonLabel>
                                <IonToggle color="green" value='wazeIncidents' checked={wazeIncidents} onIonChange={e => setWazeIncidents(e.detail.checked)}/>
                            </IonItem>
                            <IonItem>
                                <IonLabel>Waze Jams</IonLabel>
                                <IonToggle color="green" value='wazeJams' checked={wazeJams} onIonChange={e => setWazeJams(e.detail.checked)}/>
                            </IonItem>
                            <br />
                            <IonLabel>Jams Key (MPH):</IonLabel>
                            <IonItem lines='none'>
                                <div className="key">
                                    <div className="key-box red-key">0</div>
                                    <div className="key-box orangered-key">1-5</div>
                                    <div className="key-box gold-key">6-10</div>
                                    <div className="key-box greenyellow-key">11-15</div>
                                    <div className="key-box palegreen-key">16-20</div>
                                    <div className="key-box mediumseagreen-key">21-25</div>
                                    <div className="key-box forestgreen-key">25+</div>
                                </div>
                            </IonItem>
                        </IonCardContent>
                    </IonCard>
                    {displayedCameras.length > 0 && <IonCard>
                        <IonCardHeader>
                            <IonLabel className="cctv-div-title">Selected Live CCTVs</IonLabel><br />
                            <IonButton onClick={clearAllSelectedCameras} color="primary">Clear All</IonButton>
                        </IonCardHeader>
                        <IonCardContent>
                            <div className="camera-container">
                                <div className="camera-index">
                                    { displayedCameras.map((currentCCTV, index) => {
                                        return(
                                            <CctvPlayer key={index} onClick={() => {setActiveCCTV(currentCCTV)}} cctv={currentCCTV} isIOS={isIOS} error={cameraError} closeCCTV={closeCurrentCamera}/>
                                        );
                                    }) }
                                </div>
                                <div className="main-camera">
                                    {activeCCTV.id !== -1 && <CctvPlayer cctv={activeCCTV} isIOS={isIOS} error={cameraError} closeCCTV={null} />}
                                </div>
                            </div>
                        </IonCardContent>
                    </IonCard>}
                </div>
            </IonContent>
            <IonToast
                isOpen={errorResponse}
                onDidDismiss={() => setErrorResponse(false)}
                color="danger"
                message="Could not connect to camera."
                cssClass="toast-error"
                duration={10000}
            />
        </IonPage>
    );
};

export default Home;
