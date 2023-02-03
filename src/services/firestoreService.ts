import { getFirestore, doc, collection, getDoc, setDoc, getDocs, query, where, updateDoc, addDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL, uploadBytes, UploadResult, StorageReference } from 'firebase/storage';


import { DashboardData } from '../interfaces/DashboardData';
import { LinkData } from '../interfaces/LinkData';
import { User } from '../interfaces/User';
import { app } from '../firebaseConfig';
import { WeatherEvent } from '../interfaces/WeatherEvent';
import { WazeIncident } from '../interfaces/WazeIncident';
import { WazeJam } from '../interfaces/WazeJam';
import { GeoJSON } from 'geojson';
import { Camera } from '../interfaces/Camera';
import { TranscoreIncident } from '../interfaces/TranscoreIncident';
import { push, pushOutline } from 'ionicons/icons';

const db = getFirestore(app);
const storage = getStorage(app);

export async function getAuthToken() {
    const tokenDoc = doc(db, 'API-TOKEN', '1');
    const tokenSnapshot = await getDoc(tokenDoc);
    return tokenSnapshot.data()?.token;
}

export async function getDashboardContent() {
    const dashboardDocs = collection(db, 'Dashboard');
    const dashboardSnapshot = await getDocs(dashboardDocs);
    const dashboardData = dashboardSnapshot.docs[0].data();
    const devData = dashboardSnapshot.docs[1].data();
    return Object.assign(dashboardData, devData) as DashboardData;
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

export async function watchDownloads(currentUser: any) {
    const user = currentUser;
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
        const docData = doc.data();
        const weatherEvent = new WeatherEvent(
            doc.id,
            docData.county,
            docData.pub_millis,
            docData.weather_code,
            docData.latitude,
            docData.longitude,
            docData.temperature,
            docData.precipitation_intensity,
            docData.wind_gust,
            docData.snow_accumulation);
        weather.push(weatherEvent);
    });
    return weather;
}

export async function watchCameras() {
    const camerasCollection = collection(db, "CCTV_UPDATE");
    const camerasDocs = await getDocs(camerasCollection);
    const cameras: Camera[] = [];
    camerasDocs.forEach(doc => {
        const cam = doc.data() as Camera
        if (cam.latitude != 0 && cam.longitude != 0 && Number.isFinite(cam.latitude)&& Number.isFinite(cam.longitude))
        {
            cameras.push(doc.data() as Camera);

        }     
    });
    return cameras;
}

export async function watchTranscoreIncidents() {
    const incidentsCollection = collection(db, "TRANSCORE", "ACTIVE", "INCIDENTS");
    const incidentsDocs = await getDocs(incidentsCollection);
    const incidents: TranscoreIncident[] = [];
    incidentsDocs.forEach(doc => {
        incidents.push(doc.data() as TranscoreIncident);
    });
    return incidents;
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

export async function getNewUsers() {
    const userCollection = collection(db, "Users");
    const userQuery = query(userCollection, where("verified", "==", false));
    const userDocs = await getDocs(userQuery);
    const foundDocs: User[] = [];
    userDocs.forEach(doc => {
        foundDocs.push(doc.data() as User);
    });
    return foundDocs;
}

export async function verifyUser(user: User) {
    const userRef = doc(db, "Users", user.uid);
    await updateDoc(userRef, {
        verified: true
    });
}

export async function createUser(currentUser: any) {
    currentUser = currentUser.user;
    let defaultData = {
        uid: currentUser.uid,
        admin: false,
        applied: false,
        verified: false,
        email: currentUser.email,
        displayName: currentUser.displayName,
        subscriptions: []
    };

    if (/@olsson.com\s*$/.test(currentUser.email)) {
        defaultData = {
            uid: currentUser.uid,
            admin: false,
            applied: false,
            verified: true,
            email: currentUser.email,
            displayName: currentUser.displayName,
            subscriptions: []
        };
    }

    await setDoc(doc(db, "Users", currentUser.uid), defaultData);
}

export async function checkStorageStatus(link: string) {
    const reference = ref(storage, link);
    return await getDownloadURL(reference);
}


export async function submitFeedbackRequest(data: any) {

    const userDocId= collection(db, "UserFeedbacks")
    data.isEmailSent=false;
    await addDoc(userDocId,data)

}

export async function uploadAttachment(uid:string,data:File,uploadDate:string):Promise<UploadResult>
{
        const reference = ref(storage, uid+'/support_attachments/'+data.name+' - '+uploadDate);
        return uploadBytes(reference,data) 
}


export async function getAttachementUrl(ref: StorageReference):Promise<string> {
    return  getDownloadURL(ref);
}

