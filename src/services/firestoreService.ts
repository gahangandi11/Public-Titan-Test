import {getFirestore, doc, collection, getDoc, getDocs, onSnapshot} from 'firebase/firestore';
import {getStorage, ref, getDownloadURL} from 'firebase/storage';

import {DashboardData} from '../interfaces/DashboardData';
import {LinkData} from '../interfaces/LinkData';
import {User} from '../interfaces/User';
import {app, getUser} from '../firebaseConfig';
import {WeatherEvent} from '../interfaces/WeatherEvent';
import {WazeIncident} from '../interfaces/WazeIncident';
import {WazeJam} from '../interfaces/WazeJam';
import {GeoJSON} from 'geojson';

const db = getFirestore(app);
const storage = getStorage(app);

export async function getDashboardContent() {
    const dashboardDoc = doc(db, 'Dashboard', 'CURRENT');
    const dashboardSnapshot = await getDoc(dashboardDoc);
    return dashboardSnapshot.data() as DashboardData;
}

export async function getLinks() {
    const linksCollection = collection(db, "Links");
    const linksSnapshot = await getDocs(linksCollection);
    const links: LinkData[] = [];
    linksSnapshot.forEach(doc => {
        const link = doc.data() as LinkData;
        link.name = doc.id;
        links.push(link);
    });
    return links;
}

export async function getLink(title: string) {
    const linkDoc = doc(db, "Links", title);
    const linkSnapshot = await getDoc(linkDoc);
    return linkSnapshot.data() as LinkData;
}

export async function watchDownloads() {
    const user = await getUser();
    if (user != null) {
        return collection(db, "Files", user.uid, "Files");
    } else {
        return null;
    }
}

export async function watchWeatherData() {
    const weatherCollection = collection(db, "WEATHER", "ACTIVE", "INCIDENTS");
    const weatherDocs = await getDocs(weatherCollection);
    const weather: WeatherEvent[] = [];
    weatherDocs.forEach(doc => {
        const weatherEvent = doc.data() as WeatherEvent;
        weatherEvent.id = doc.id;
        weather.push(weatherEvent);
    });
    return weather;
}

export async function watchWazeIncidentsData() {
    const incidentsCollection = collection(db, "WAZE", "ACTIVE", "INCIDENTS");
    const incidentsDocs = await getDocs(incidentsCollection);
    const incidents: WazeIncident[] = [];
    incidentsDocs.forEach(doc => {
        incidents.push(doc.data() as WazeIncident);
    });
    return incidents;
}

export async function watchWazeJamsData(): Promise<GeoJSON.FeatureCollection> {
    const jamsCollection = collection(db, "WAZE", "ACTIVE", "JAMS");
    const jamsDocs = await getDocs(jamsCollection);
    const jams: GeoJSON.Feature[] = [];
    jamsDocs.forEach(doc => {
        const docData = doc.data() as WazeJam;
        let speedColor;
        const speed = docData.speed;

        if (speed < 1) {
            speedColor = 'red';
        } else if (speed <= 5) {
            speedColor = 'orangered';
        } else if (speed <= 10) {
            speedColor = 'gold';
        } else if (speed <= 15) {
            speedColor = 'greenyellow';
        } else if (speed <= 20) {
            speedColor = 'palegreen';
        } else if (speed <= 25) {
            speedColor = 'mediumseagreen';
        } else {
            speedColor = 'forestgreen';
        }

        jams.push({
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: [
                    [docData.start_long, docData.start_lat],
                    [docData.end_long, docData.end_lat]
                ]
            },
            properties: {
                color: speedColor
            }
        });
    });
    return {
        type: "FeatureCollection",
        features: jams
    };
}

export async function getUserByID(id: string) {
    const userDoc = doc(db, "Users", id);
    const userSnapshot = await getDoc(userDoc);
    return userSnapshot.data() as User;
}

export async function checkStorageStatus(link: string) {
    const reference = ref(storage, link);
    return await getDownloadURL(reference);
}
