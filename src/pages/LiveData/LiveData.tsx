import * as React from "react";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonToast,
  IonToggle,
  IonCardTitle,
  IonList,
  IonItemDivider,
} from "@ionic/react";

import Map from "../../components/Map/Map";
import Header from "../../components/Header/Header";
import "./LiveData.css";
import { useEffect, useRef, useState } from "react";
import { Camera } from "../../interfaces/Camera";
import CctvPlayer from "../../components/CctvPlayer/CctvPlayer";
import { Device } from "@capacitor/device";
import { watchCameras } from "../../services/firestoreService";
import { arrowDownCircle } from "ionicons/icons";
import { Marker } from "../../interfaces/Marker";



const LiveData: React.FC = () => {
  const [weather, setWeather] = useState(false);
  const [traffic, setTraffic] = useState(true);
  const [transcore, setTranscore] = useState(false);
  const [transcoreIncidents, setTranscoreIncidents] = useState<string[]>([]);
  const [wazeIncidents, setWazeIncidents] = useState(false);
  const [wazeJams, setWazeJams] = useState(false);
  const [showCameras, setShowCameras] = useState(false);
  const [displayedCameras, setDisplayedCameras] = useState<Camera[]>([]);
  const [activeCCTV, setActiveCCTV] = useState<Camera>(new Camera());
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [isIOS, setIsIOS] = useState(false);
  const [errorResponse, setErrorResponse] = useState(false);
  const camerasEndRef = useRef(null);
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);

  const closeCurrentCamera = (id: number) => {
    setDisplayedCameras(displayedCameras.filter((camera) => camera.id !== id));
  };

  const cameraError = (error: string, id: number) => {
    setErrorResponse(true);
    const newDisplayedCameras = displayedCameras.filter(
      (camera) => camera.id !== id
    );
    setDisplayedCameras(newDisplayedCameras);
    newDisplayedCameras.length > 0
      ? setActiveCCTV(newDisplayedCameras[newDisplayedCameras.length - 1])
      : setActiveCCTV(new Camera());
  };

  const setNewCamera = (id: number) => {
    const data = cameras.find((camera) => camera.id === id);
    const duplicateCamera = displayedCameras.find((camera) => camera.id === id);
    if (data && !duplicateCamera) {
      setDisplayedCameras((camera) => [...camera, data as Camera]);
      setActiveCCTV(data as Camera);
    }
  };

  function clearAllSelectedCameras() {
    setDisplayedCameras([]);
  }

  function scrollToBottom() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    camerasEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    watchCameras().then((foundCameras) => {
      setCameras(foundCameras);
    });
    Device.getInfo().then((info) => {
      setIsIOS(info.operatingSystem === "ios");
    });
  }, []);

  return (
    <IonPage>
      <Header title={"Live Data"} />
      <IonContent fullscreen>
        <IonCard className="card-header-container card-container-padding">
          <IonCardContent className="box">
            <div className="map-div">
              <Map
                weather={weather}
                traffic={traffic}
                transcore={transcore}
                transcoreIncidents={transcoreIncidents}
                jams={wazeJams}
                incidents={wazeIncidents}
                cameras={cameras}
                setId={setNewCamera}
                showCameras={showCameras}
                height="70em"
                zoom={6.5}
                markerSelection={setSelectedMarker}
              />
            </div>
            <div className="controls-box">
              <IonCard className="controls-div second-step">
                <IonItemDivider  color="light">
                  <IonLabel class="header-font">Map Layers</IonLabel>
                </IonItemDivider>
                <IonList class="ion-list-bg">
                  <IonItem>
                    <IonLabel>Weather</IonLabel>
                    <IonToggle
                      color="green"
                      value="weather"
                      checked={weather}
                      onIonChange={(e) => setWeather(e.detail.checked)}
                    />
                  </IonItem>
                  <IonItem>
                    <IonLabel>Traffic</IonLabel>
                    <IonToggle
                      color="green"
                      value="traffic"
                      checked={traffic}
                      onIonChange={(e) => setTraffic(e.detail.checked)}
                    />
                  </IonItem>
                  <IonItem>
                    <IonLabel>Cameras</IonLabel>
                    <IonToggle
                      color="green"
                      value="cameras"
                      checked={showCameras}
                      onIonChange={(e) => setShowCameras(e.detail.checked)}
                    />
                  </IonItem>
                  <IonItem>
                    <IonLabel>Transcore Incidents</IonLabel>
                    <IonToggle
                      color="green"
                      value="transcore"
                      checked={transcore}
                      onIonChange={(e) => setTranscore(e.detail.checked)}
                    />
                  </IonItem>
                  {transcore && (
                    <IonItem>
                      <IonLabel>Select Incidents</IonLabel>
                      <IonSelect
                        multiple
                        value={transcoreIncidents}
                        onIonChange={(e) =>
                          setTranscoreIncidents(e.detail.value)
                        }
                      >
                        <IonSelectOption value="accident">
                          Accidents
                        </IonSelectOption>
                        <IonSelectOption value="debris">Debris</IonSelectOption>
                        <IonSelectOption value="exit closed">
                          Exit Closed
                        </IonSelectOption>
                        <IonSelectOption value="roadwork">
                          Roadwork
                        </IonSelectOption>
                        <IonSelectOption value="stalled vehicle">
                          Stalled Vehicle
                        </IonSelectOption>
                        <IonSelectOption value="other">Other</IonSelectOption>
                      </IonSelect>
                    </IonItem>
                  )}
                  <IonItem>
                    <IonLabel>Waze Incidents</IonLabel>
                    <IonToggle
                      color="green"
                      value="wazeIncidents"
                      checked={wazeIncidents}
                      onIonChange={(e) => setWazeIncidents(e.detail.checked)}
                    />
                  </IonItem>
                  <IonItem>
                    <IonLabel>Waze Jams</IonLabel>
                    <IonToggle
                      color="green"
                      value="wazeJams"
                      checked={wazeJams}
                      onIonChange={(e) => setWazeJams(e.detail.checked)}
                    />
                  </IonItem>
                  <br />
                  <IonItem lines="none">
                  <IonLabel class="offset-title">Jams Key (MPH):</IonLabel>

                  </IonItem>

                  <IonItem lines="none">
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
                </IonList>
              </IonCard>
              {/* {selectedMarker && (
                <IonCard className="controls-div">
                  <IonItemDivider  color="light">
                    <IonLabel class="header-font">Marker Information</IonLabel>
                  </IonItemDivider>
                  <IonList class="ion-list-bg">
                    <IonItem lines="none">
                      <IonLabel>Event Type:</IonLabel>
                      <IonLabel slot="end">{selectedMarker.eventType}</IonLabel>
                    </IonItem>
                    <IonItem lines="none">
                      <IonLabel>County:</IonLabel>
                      <IonLabel slot="end">{selectedMarker.county}</IonLabel>
                    </IonItem>
                    {selectedMarker.description !== "" && (
                      <IonItem lines="none">
                        <IonLabel>Description:</IonLabel>
                        <IonLabel slot="end">
                          {selectedMarker.description}
                        </IonLabel>
                      </IonItem>
                    )}
                    <IonItem lines="none">
                      <IonLabel>Latitude & Longitude:</IonLabel>
                      <IonLabel slot="end">
                        {selectedMarker.latitude}, &nbsp;{" "}
                        {selectedMarker.longitude}
                      </IonLabel>
                    </IonItem>
                    {selectedMarker.street !== "" && (
                      <IonItem lines="none">
                        <IonLabel>Street:</IonLabel>
                        <IonLabel slot="end">{selectedMarker.street}</IonLabel>
                      </IonItem>
                    )}
                    <IonItem lines="none">
                      <IonLabel>Recorded Time:</IonLabel>
                      <IonLabel slot="end">
                        {selectedMarker.recordedTime.toLocaleString()}
                      </IonLabel>
                    </IonItem>
                    {selectedMarker.eventType === "Weather Event" && (
                      <div className="weather-div">
                        <IonItem lines="none">
                          <IonLabel>Temperature:</IonLabel>
                          <IonLabel slot="end">
                            {selectedMarker.temperature}°F
                          </IonLabel>
                        </IonItem>
                        <IonItem lines="none">
                          <IonLabel>Wind Gust:</IonLabel>
                          <IonLabel slot="end">
                            {selectedMarker.windGust} MPH
                          </IonLabel>
                        </IonItem>
                        <IonItem lines="none">
                          <IonLabel>Precipitation:</IonLabel>
                          <IonLabel slot="end">
                            {selectedMarker.precipitationIntensity}
                          </IonLabel>
                        </IonItem>

                        <IonItem lines="none">
                          <IonLabel>Snow Intensity:</IonLabel>
                          <IonLabel slot="end">
                            {selectedMarker.snowIntensity}
                          </IonLabel>
                        </IonItem>

                        <IonItem lines="none">
                          <IonLabel>Freezing Range Intensity:</IonLabel>
                          <IonLabel slot="end">
                            {selectedMarker.freezingRangeIntensity}
                          </IonLabel>
                        </IonItem>

                        <IonItem lines="none">
                          <IonLabel>Sleet Intensity:</IonLabel>
                          <IonLabel slot="end">
                            {selectedMarker.sleetIntensity}
                          </IonLabel>
                        </IonItem>

                      </div>
                    )}
                  </IonList>
                </IonCard>
              )} */}
            </div>
          </IonCardContent>
        </IonCard>
        {/* <div className="home--content"> */}

        {displayedCameras.length > 0 && (
          <IonFab
            vertical="bottom"
            horizontal="start"
            slot="fixed"
            onClick={scrollToBottom}
          >
            <IonFabButton>
              <IonIcon icon={arrowDownCircle} />
            </IonFabButton>
          </IonFab>
        )}

        {displayedCameras.length > 0 && (
          <IonCard ref={camerasEndRef}>
            <IonCardHeader>
              <IonLabel className="cctv-div-title">
                Selected Live CCTVs
              </IonLabel>
              <br />
              <IonButton onClick={clearAllSelectedCameras} color="primary">
                Clear All
              </IonButton>
            </IonCardHeader>
            <IonCardContent>
              <div className="camera-container">
                <div className="camera-index">
                  {displayedCameras.map((currentCCTV, index) => {
                    return (
                      <CctvPlayer
                        key={index}
                        onClick={() => {
                          setActiveCCTV(currentCCTV);
                        }}
                        cctv={currentCCTV}
                        isIOS={isIOS}
                        error={cameraError}
                        closeCCTV={closeCurrentCamera}
                      />
                    );
                  })}
                </div>
                <div className="main-camera">
                  {activeCCTV.id !== -1 && (
                    <CctvPlayer
                      cctv={activeCCTV}
                      isIOS={isIOS}
                      error={cameraError}
                      closeCCTV={null}
                    />
                  )}
                </div>
              </div>
            </IonCardContent>
          </IonCard>
        )}
        {/* </div> */}
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

export default LiveData;
