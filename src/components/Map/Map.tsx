import * as React from 'react';
import {IonCard, IonIcon} from '@ionic/react';
import './Map.css';
import ReactMapGl, {InteractiveMapProps, Layer, LayerProps, Marker, Source} from 'react-map-gl';
import {useEffect, useState} from 'react';
import {Missouri} from './Missouri';
import {cloudy, help, pin, snow} from 'ionicons/icons';
import {WeatherEvent} from '../../interfaces/WeatherEvent';
import {watchWazeIncidentsData, watchWazeJamsData, watchWeatherData} from '../../services/firestoreService';
import {WazeIncident} from '../../interfaces/WazeIncident';
import {GeoJSON} from 'geojson';
import {Simulate} from 'react-dom/test-utils';

const Map = () => {
    const accessToken = process.env.REACT_APP_MAPBOX_API_KEY;
    const [weather, setWeather] = useState<WeatherEvent[]>([]);
    const [wazeIncidents, setWazeIncidents] = useState<WazeIncident[]>([]);
    const [wazeJamGeo, setWazeJamGeo] = useState<GeoJSON.FeatureCollection>();
    const [viewport, setViewport] = useState<InteractiveMapProps>({
        width: 640,
        height: 550,
        latitude: 37.9643,
        longitude: -91.8318,
        zoom: 5.5
    });
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

    const weatherMarkers = React.useMemo(() => weather.map(weatherItem => {
            let iconType: string;
            let weatherType: string;
            switch(weatherItem.weatherCode) {
                case 0:
                    iconType = help;
                    weatherType = 'invalid';
                    break;
                case 1000:
                    iconType = cloudy;
                    weatherType = 'Clear Day';
                    break;
                case 1001:
                    iconType = cloudy;
                    weatherType = 'Cloudy';
                    break;
                case 1100:
                    iconType = cloudy;
                    weatherType = "Mostly Clear Day";
                    break;
                case 1101:
                    iconType = cloudy;
                    weatherType = "Partly Cloudy Day";
                    break;
                case 1102:
                    iconType = cloudy;
                    weatherType = "Mostly Cloudy";
                    break;
                case 2000:
                    iconType = cloudy;
                    weatherType = "Foggy";
                    break;
                case 2100:
                    iconType = cloudy;
                    weatherType = "Light Fog";
                    break;
                case 3000:
                    iconType = cloudy;
                    weatherType = "Light Wind";
                    break;
                case 3001:
                    iconType = cloudy;
                    weatherType = "Windy";
                    break;
                case 3002:
                    iconType = cloudy;
                    weatherType = "Heavy Wind";
                    break;
                case 4000:
                    iconType = cloudy;
                    weatherType = "Drizzle";
                    break;
                case 4001:
                    iconType = cloudy;
                    weatherType = "Rainy";
                    break;
                case 4200:
                    iconType = cloudy;
                    weatherType = "Light Rain";
                    break;
                case 4201:
                    iconType = cloudy;
                    weatherType = "Heavy Rain";
                    break;
                case 5000:
                    iconType = snow;
                    weatherType = "Snowy";
                    break;
                case 5001:
                    iconType = cloudy;
                    weatherType = "Snow Flurries";
                    break;
                case 5100:
                    iconType = cloudy;
                    weatherType = "Light Snow";
                    break;
                case 5101:
                    iconType = cloudy;
                    weatherType = "Heavy Snow";
                    break;
                case 6000:
                    iconType = cloudy;
                    weatherType = "Freezing Drizzle";
                    break;
                case 6001:
                    iconType = cloudy;
                    weatherType = "Freezing Rain";
                    break;
                case 6200:
                    iconType = cloudy;
                    weatherType = "Light Freezing Rain";
                    break;
                case 6201:
                    iconType = cloudy;
                    weatherType = "Heavy Freezing Rain";
                    break;
                case 7000:
                    iconType = cloudy;
                    weatherType = "Hail";
                    break;
                case 7101:
                    iconType = cloudy;
                    weatherType = "Heavy Hail";
                    break;
                case 7102:
                    iconType = cloudy;
                    weatherType = "Light Hail";
                    break;
                case 8000:
                    iconType = cloudy;
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

    const wazeIncidentMarkers = React.useMemo(() => wazeIncidents.map(incident => {
        let iconType;
        let iconColor;
        if (incident.event_class === '') {
            incident.event_class = incident.type;
        }
        switch (incident.event_class) {
            case "ROAD_CLOSED":
                iconType = pin;
                iconColor = "red";
                break;
            case "ROADWORK":
                iconType = pin;
                iconColor = "yellow";
                break;
            case "":
                iconType = pin;
                break;
            case "STALLED VEHICLE_ON_ROAD":
                iconType = pin;
                iconColor = "warning";
                break;
            case "STALLED VEHICLE_SHOULDER":
                iconType = pin;
                iconColor = "warning";
                break;
            case "JAM_HEAVY_TRAFFIC":
                iconType = pin;
                iconColor = "red";
                break;
            case "POT_HOLE":
                iconType = pin;
                iconColor = "orange";
                break;
            case "ROAD_OBJECT":
                iconType = pin;
                iconColor = "danger";
                break;
            case "JAM_MODERATE_TRAFFIC":
                iconType = pin;
                iconColor = "red";
                break;
            case "ACCIDENT_MINOR":
                iconType = pin;
                iconColor = "warning";
                break;
            case "ROAD_KILL_ROAD":
                iconType = pin;
                iconColor = "purple";
                break;
            case "JAM_STAND_STILL_TRAFFIC":
                iconType = pin;
                iconColor = "red";
                break;
            case "ACCIDENT_MAJOR":
                iconType = pin;
                iconColor = "danger";
                break;
            case "ACCIDENT":
                iconType = pin;
                iconColor = "orange";
                break;
            case "HAZARD_ON_SHOULDER":
                iconType = pin;
                iconColor = "danger";
                break;
            case "SHOULDER_MISSING_SIGN":
                iconType = pin;
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
        })
    }, []);

    return(
        <IonCard className="map__card">
            <ReactMapGl
                {...viewport}
                onViewportChange={(nextViewport: InteractiveMapProps) => setViewport(nextViewport)}
                mapStyle="mapbox://styles/mapbox/dark-v10"
                mapboxApiAccessToken={accessToken}
            >
                {weatherMarkers}
                {wazeIncidentMarkers}
                <Source id='missouri' type='geojson' data={geojson}>
                    <Layer {...stateLayer} />
                </Source>
                <Source id='wazeJam' type='geojson' data={wazeJamGeo}>
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
                </Source>
            </ReactMapGl>
        </IonCard>
    );
};

export default Map;
