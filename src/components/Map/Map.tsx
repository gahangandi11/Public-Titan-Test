import * as React from 'react';
import {IonCard, IonIcon} from '@ionic/react';
import './Map.css';
import ReactMapGl, {InteractiveMapProps, Layer, LayerProps, Marker, Source} from 'react-map-gl';
import mapboxgl from 'mapbox-gl';
import {useEffect, useState} from 'react';
import {Missouri} from './Missouri';
import {cloudy, help, pin, snow, videocam} from 'ionicons/icons';
import {WeatherEvent} from '../../interfaces/WeatherEvent';
import {
    watchTranscoreIncidents,
    watchWazeIncidentsData,
    watchWazeJamsData,
    watchWeatherData
} from '../../services/firestoreService';
import {WazeIncident} from '../../interfaces/WazeIncident';
import {GeoJSON} from 'geojson';
import {
    clearDay,
    drizzle, flurries,
    fog,
    fogLight,
    freezingDrizzle,
    freezingRain,
    freezingRainHeavy,
    freezingRainLight,
    heavyWind,
    icePellets,
    icePelletsHeavy,
    icePelletsLight,
    lightWind,
    mostlyClearDay,
    mostlyCloudy,
    partlyCloudyDay,
    rain,
    rainHeavy,
    rainLight,
    snowHeavy,
    snowLight,
    tstorm,
    wind
} from '../../assets/weather-icons/availableWeatherIcons';
import {
    accident,
    animal,
    block,
    closed, exitClosed,
    hazard,
    jam,
    noShoulder, other,
    pothole,
    roadwork,
    stalled
} from '../../assets/traffic-icons/availableTrafficIcons';
import {Camera} from '../../interfaces/Camera';
import {TranscoreIncident} from '../../interfaces/TranscoreIncident';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-var-requires,import/no-webpack-loader-syntax
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

const trafficLayer: LayerProps = {
    id: 'traffic-layer',
    source: 'traffic',
    'source-layer': 'traffic',
    type: 'line',
    minzoom: 5,
    paint: {
        'line-width': 1.5,
        'line-color': [
            "case",
            [
                "==",
                "low",
                [
                    "get",
                    "congestion"
                ]
            ],
            "#4caf50",
            [
                "==",
                "moderate",
                [
                    "get",
                    "congestion"
                ]
            ],
            "#ff3409",
            [
                "==",
                "heavy",
                [
                    "get",
                    "congestion"
                ]
            ],
            "#fc930a",
            [
                "==",
                "severe",
                [
                    "get",
                    "congestion"
                ]
            ],
            "#e73e3a",
            "#4caf50"
        ]
    }
};
const geojson: GeoJSON.Feature = Missouri;
const stateLayer: LayerProps = {
    id: 'fill',
    type: 'fill',
    source: 'missouri',
    paint: {
        'fill-color': '#3880ff',
        'fill-opacity': 0.2
    }
};


interface MapData {
    weather: boolean,
    jams: boolean,
    incidents: boolean,
    transcore: boolean,
    traffic: boolean,
    transcoreIncidents?: string[],
    cameras: Camera[],
    setId?: (id: number) => void;
    showCameras: boolean,
    height: number,
    zoom: number
}

const Map: React.FC<MapData> = (props: MapData) => {
    const accessToken = process.env.REACT_APP_MAPBOX_API_KEY;
    const [weather, setWeather] = useState<WeatherEvent[]>([]);
    const [wazeIncidents, setWazeIncidents] = useState<WazeIncident[]>([]);
    const [transcoreIncidents, setTranscoreIncidents] = useState<TranscoreIncident[]>([]);
    const [wazeJamGeo, setWazeJamGeo] = useState<GeoJSON.FeatureCollection>();
    const [viewport, setViewport] = useState<InteractiveMapProps>({
        height: props.height,
        latitude: 37.9643,
        longitude: -91.8318,
        zoom: props.zoom
    });

    const cameraMarkers = React.useMemo(() => props.cameras?.map(
        camera => (
            <Marker latitude={camera.latitude} longitude={camera.longitude} key={camera.id}>
                <IonIcon className="map-icon" color='primary' md={videocam} onClick={() => props.setId ? props.setId(camera.id) : {}} />
            </Marker>
        ),
    ), [props]);

    const weatherMarkers = React.useMemo(() => weather.map(weatherItem => {
            let iconType: string;
            let weatherType: string;
        switch(weatherItem.weatherCode) {
            case 0:
                iconType = help;
                weatherType = 'invalid';
                break;
            case 1000:
                iconType = clearDay;
                weatherType = 'Clear Day';
                break;
            case 1001:
                iconType = cloudy;
                weatherType = 'Cloudy';
                break;
            case 1100:
                iconType = mostlyClearDay;
                weatherType = "Mostly Clear Day";
                break;
            case 1101:
                iconType = partlyCloudyDay;
                weatherType = "Partly Cloudy Day";
                break;
            case 1102:
                iconType = mostlyCloudy;
                weatherType = "Mostly Cloudy";
                break;
            case 2000:
                iconType = fog;
                weatherType = "Foggy";
                break;
            case 2100:
                iconType = fogLight;
                weatherType = "Light Fog";
                break;
            case 3000:
                iconType = lightWind;
                weatherType = "Light Wind";
                break;
            case 3001:
                iconType = wind;
                weatherType = "Windy";
                break;
            case 3002:
                iconType = heavyWind;
                weatherType = "Heavy Wind";
                break;
            case 4000:
                iconType = drizzle;
                weatherType = "Drizzle";
                break;
            case 4001:
                iconType = rain;
                weatherType = "Rainy";
                break;
            case 4200:
                iconType = rainLight;
                weatherType = "Light Rain";
                break;
            case 4201:
                iconType = rainHeavy;
                weatherType = "Heavy Rain";
                break;
            case 5000:
                iconType = snow;
                weatherType = "Snowy";
                break;
            case 5001:
                iconType = flurries;
                weatherType = "Snow Flurries";
                break;
            case 5100:
                iconType = snowLight;
                weatherType = "Light Snow";
                break;
            case 5101:
                iconType = snowHeavy;
                weatherType = "Heavy Snow";
                break;
            case 6000:
                iconType = freezingDrizzle;
                weatherType = "Freezing Drizzle";
                break;
            case 6001:
                iconType = freezingRain;
                weatherType = "Freezing Rain";
                break;
            case 6200:
                iconType = freezingRainLight;
                weatherType = "Light Freezing Rain";
                break;
            case 6201:
                iconType = freezingRainHeavy;
                weatherType = "Heavy Freezing Rain";
                break;
            case 7000:
                iconType = icePellets;
                weatherType = "Hail";
                break;
            case 7101:
                iconType = icePelletsHeavy;
                weatherType = "Heavy Hail";
                break;
            case 7102:
                iconType = icePelletsLight;
                weatherType = "Light Hail";
                break;
            case 8000:
                iconType = tstorm;
                weatherType = "Thunderstorm";
                break;
            default:
                iconType = help;
                break;
        }
            return (
                <Marker latitude={weatherItem.latitude} longitude={weatherItem.longitude} key={weatherItem.id}>
                    <IonIcon className="marker-icon" src={iconType} />
                </Marker>
            );
        },
    ), [weather]);

    const transcoreMarkers = React.useMemo(() => transcoreIncidents.map(incident => {
        let iconType;
        let iconColor;

        if (props.transcoreIncidents?.includes(incident.event_class.toLowerCase())) {
            switch (incident.event_class) {
                case "ACCIDENT":
                    iconType = accident;
                    iconColor = "blue";
                    break;
                case "ROADWORK":
                    iconType = roadwork;
                    iconColor = "yellow";
                    break;
                case "OTHER":
                    iconType = other;
                    iconColor = "black";
                    break;
                case "EXIT CLOSED":
                    iconType = exitClosed;
                    iconColor = "danger";
                    break;
                case "STALLED VEHICLE":
                    iconType = stalled;
                    iconColor = "warning";
                    break;
                default:
                    iconType = pin;
                    break;
            }
            return <Marker
                key={incident.uuid}
                longitude={incident.longitude}
                latitude={incident.latitude}>
                <IonIcon className="marker-icon" color={iconColor} src={iconType} />
            </Marker>
        }
        return <div className="hidden" />;
    }), [transcoreIncidents, props]);

    const wazeIncidentMarkers = React.useMemo(() => wazeIncidents.map(incident => {
        let iconType;
        let iconColor;
        if (incident.event_class === '') {
            incident.event_class = incident.type;
        }
        switch (incident.event_class) {
            case "ROAD_CLOSED":
                iconType = closed;
                iconColor = "red";
                break;
            case "ROADWORK":
                iconType = roadwork;
                iconColor = "yellow";
                break;
            case "":
                iconType = pin;
                break;
            case "STALLED VEHICLE_ON_ROAD":
                iconType = stalled;
                iconColor = "warning";
                break;
            case "STALLED VEHICLE_SHOULDER":
                iconType = stalled;
                iconColor = "warning";
                break;
            case "JAM_HEAVY_TRAFFIC":
                iconType = jam;
                iconColor = "red";
                break;
            case "POT_HOLE":
                iconType = pothole;
                iconColor = "orange";
                break;
            case "ROAD_OBJECT":
                iconType = block;
                iconColor = "danger";
                break;
            case "JAM_MODERATE_TRAFFIC":
                iconType = jam;
                iconColor = "red";
                break;
            case "ACCIDENT_MINOR":
                iconType = accident;
                iconColor = "warning";
                break;
            case "ROAD_KILL_ROAD":
                iconType = animal;
                iconColor = "purple";
                break;
            case "JAM_STAND_STILL_TRAFFIC":
                iconType = jam;
                iconColor = "red";
                break;
            case "ACCIDENT_MAJOR":
                iconType = accident;
                iconColor = "danger";
                break;
            case "ACCIDENT":
                iconType = accident;
                iconColor = "orange";
                break;
            case "HAZARD_ON_SHOULDER":
                iconType = hazard;
                iconColor = "danger";
                break;
            case "SHOULDER_MISSING_SIGN":
                iconType = noShoulder;
                iconColor = "warning";
                break;
            default:
                iconType = pin;
                break;
        }
        return <Marker
            key={incident.uuid}
            longitude={incident.longitude}
            latitude={incident.latitude}>
            <IonIcon className="marker-icon" color={iconColor} src={iconType}/>
        </Marker>
    }), [wazeIncidents]);

    useEffect(() => {
        watchWeatherData().then(foundWeather => {
            setWeather(foundWeather);
        });
        watchWazeIncidentsData().then(foundIncidents => {
            setWazeIncidents(foundIncidents);
        });
        watchWazeJamsData().then(foundJams => {
            setWazeJamGeo(foundJams);
        });
        watchTranscoreIncidents().then(foundTranscore => {
            setTranscoreIncidents(foundTranscore)
        })
    }, [props]);

    return(
        <IonCard className="map__card">
            <ReactMapGl
                {...viewport}
                width="100%"
                onViewportChange={(nextViewport: InteractiveMapProps) => setViewport(nextViewport)}
                mapStyle="mapbox://styles/mapbox/dark-v10"
                mapboxApiAccessToken={accessToken}
            >
                {props.weather && weatherMarkers}
                {props.showCameras && cameraMarkers}
                {props.incidents && wazeIncidentMarkers}
                {props.transcore && transcoreMarkers}
                {props.traffic &&
                <Source id='traffic' type='vector' url='mapbox://mapbox.mapbox-traffic-v1' minzoom={5}>
                    <Layer {...trafficLayer} />
                </Source>}
                <Source id='missouri' type='geojson' data={geojson}>
                    <Layer {...stateLayer} />
                </Source>
                {props.jams && <Source id='wazeJam' type='geojson' data={wazeJamGeo}>
                    <Layer
                        id="wazeJamLayer"
                        type="line"
                        source="wazeJam"
                        paint={
                            {
                                'line-color': [
                                    'match',
                                    ['get', 'color'],
                                    'red',
                                    'red',
                                    'orangered',
                                    'orangered',
                                    'gold',
                                    'gold',
                                    'greenyellow',
                                    'greenyellow',
                                    'palegreen',
                                    'palegreen',
                                    'mediumseagreen',
                                    'mediumseagreen',
                                    'forestgreen',
                                    'forestgreen',
                                    'red'
                                ]
                            }
                        }
                    />
                </Source>}
            </ReactMapGl>
        </IonCard>
    );
};

export default Map;
