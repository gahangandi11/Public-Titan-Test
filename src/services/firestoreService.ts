import { getFirestore, doc, collection, getDoc, setDoc, getDocs, query, where, updateDoc, addDoc, DocumentReference, DocumentData, deleteDoc, } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL, uploadBytes, UploadResult, StorageReference } from 'firebase/storage';
import {getFunctions} from 'firebase/functions'

import firebase from 'firebase/compat/app';


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

import { functions } from '../firebaseConfig';
import { httpsCallable } from 'firebase/functions';

import { UserRole } from '../interfaces/UserRoles';


const db = getFirestore(app);
const storage = getStorage(app);



// export const sayHello = firebase.functions().httpsCallable('sayHello');



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
    console.log(dashboardSnapshot)
    return Object.assign(dashboardData, devData) as DashboardData;
}


export async function getDashboardCurrent() {
    const colRef=collection(db,'Dashboard');
    const dashboardcurrent=await getDocs(colRef);
    return dashboardcurrent;
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
    const weatherCollection = collection(db, "WEATHER", "RT", "INCIDENTS");
    const weatherDocs = await getDocs(weatherCollection);
    const weather: WeatherEvent[] = [];
    weatherDocs.forEach(doc => {
        const docData = doc.data();
        const weatherEvent = new WeatherEvent(
            doc.id,
            docData.county,
            docData.pub_millis,
            docData.weatherCode,
            docData.latitude,
            docData.longitude,
            docData.temperature,
            docData.rainIntensity,
            docData.windGust,
            docData.snowIntensity,
            docData.freezingRainIntensity,
            docData.sleetIntensity,
    
            );
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
        if (cam.latitude != 0 && cam.longitude != 0 && Number.isFinite(cam.latitude) && Number.isFinite(cam.longitude)) {
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

export function getUserDocumentRef(id: string): DocumentReference<DocumentData> {
    return doc(db, "Users", id);

}

export async function getNewUsers() {
    const userCollection = collection(db, "Users");
    const userQuery = query(userCollection, where("verified", "==", false));
    const userDocs = await getDocs(userQuery);
    const foundDocs: User[] = [];

    userDocs.forEach(doc => {
        foundDocs.push(doc.data() as User);
    });
    
    const getbrockdocs=await getDocs(collection(db,"Users"));
    getbrockdocs.forEach(doc=>{
        if(doc.data().email==="brockweekley@gmail.com")
            {
                console.log(doc.data().uid);
            }
    })


    return foundDocs;
}

export async function checkIfUserWithSameEmailAlreadyExists(email: string) {
    const userCollection = collection(db, "Users");
    const userQuery = query(userCollection, where("email", "==", email));
    const userDocs = await getDocs(userQuery);

    return userDocs.size > 0;
}

export async function verifyUser(user: User) {
    const userRef = doc(db, "Users", user.uid);
    await updateDoc(userRef, {
        verified: true
    });
}

export async function sendApprovalEmail(currentUser: User) {
    const uid = currentUser.uid;
    const emailDoc={
        toUids : [uid],
        template: {
            name: 'adminApproval',
        
        }
    }
    await addDoc(collection(db, "email"), emailDoc);
}




export async function sendRejectionEmail(currentUser: User, userDeleteMessage: string) {

    const email = currentUser.email;
    const emailDoc={
        to : [email],
        template: {
            name: 'adminRejection',
            data:{
                rejectMessage: userDeleteMessage,
            }
        
        }
    }
    await addDoc(collection(db, "email"), emailDoc);
}



export async function updateVerificationAndAdminFlag(userId: string, isVerfied: boolean, isAdmin: boolean) {
    const userRef = doc(db, "Users", userId);
    await updateDoc(userRef, {
        verified: isVerfied,
    });
}

export async function createUser(currentUser: any, firstName:string, middleName: string, lastName: string, phoneNumber: string, companyName: string, shortDescription: string) {
    const date = new Date();
    const formattedDate = date.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    })

    const oneYearFromNow = new Date(date.setFullYear(date.getFullYear() + 1));
    const formattedRenewalDate = oneYearFromNow.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
    currentUser = currentUser.user;
    const defaultData = {
        uid: currentUser.uid,
        admin: false,
        applied: false,
        verified: false,
        role:"",
        email: currentUser.email,
        displayName: currentUser.displayName,
        subscriptions: [],
        requiresRenewal: false,
        registeredDate: formattedDate,
        renewalDate: formattedRenewalDate,
        shortDescription: shortDescription,
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        companyName: companyName,
        fullAccess: false,
        
    };
    if (/@modot.mo.gov\s*$/.test(currentUser.email!)) {
        
        defaultData.verified = true;
        defaultData.fullAccess = true;

      }
    await setDoc(doc(db, "Users", currentUser.uid), defaultData);
}

export async function checkStorageStatus(link: string) {
    const reference = ref(storage, link);
    return await getDownloadURL(reference);
}


export async function submitFeedbackRequest(data: any) {

    const userDocId = collection(db, "UserFeedbacks")
    data.isEmailSent = false;
    await addDoc(userDocId, data)

}

export async function uploadAttachment(uid: string, data: File, uploadDate: string): Promise<UploadResult> {
    const reference = ref(storage, uid + '/support_attachments/' + data.name + ' - ' + uploadDate);
    return uploadBytes(reference, data)
}


export async function getAttachementUrl(ref: StorageReference): Promise<string> {
    return getDownloadURL(ref);
}

////////////////////////////////////////////////////////////////////////////////////////////

export async function setUserRole(user: User, access:string) {
    const userRef = doc(db, "Users", user.uid);
    await updateDoc(userRef, {
        role:access,
    });
}


export async function reverifyUser(user: User, renewalstatus: boolean) {
    const userRef = doc(db, "Users", user.uid);
    await updateDoc(userRef, {
        verified: true,
        requiresRenewal: renewalstatus,
    });
}

export async function setNewrenewalDate(user: User) {
    const userRef = doc(db, "Users", user.uid);
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1); 

    const formattedDate = oneYearFromNow.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      });
    await updateDoc(userRef, {
        renewalDate: formattedDate,
    });
}

export async function deleteDocument(currentUser: any) {
    const docRef = doc(db, "Users", currentUser.uid);

    await deleteDoc(docRef);
    // delete doc has to be implemented with admin auth and delete the user from the Auth as well.

    // just adding a temporary check so the admin feels user is deleted.
    // but the user is not deleted from the database and still wont have access beacuse of the verified flag is still false.
    // await updateDoc(docRef, {
    //     applied: true,
    // });


}

export async function getreverifyUsers() {
    const userCollection = collection(db, "Users");
    const userQuery = query(userCollection, where("requiresRenewal", "==", true));
    const userDocs = await getDocs(userQuery);
    const foundDocs: User[] = [];
    userDocs.forEach(doc => {
        foundDocs.push(doc.data() as User);
    });
    return foundDocs;
}


export async function updateRenewalStatus(userId: string, requiresRenewal: boolean) {
    const userRef = doc(db, "Users", userId);
    await updateDoc(userRef, {
        requiresRenewal: requiresRenewal,
    });
}

// export async function updateallusersRegisteredDate() {
//     const userCollection = collection(db, "Users");
//     const userDocs = await getDocs(userCollection);

//      userDocs.forEach(async (docSnapshot) => {
//                     await updateDoc(doc(db, "Users", docSnapshot.id), {
//                         fullAccess: true
//                     });
          
        
//     });

    
// }


export async function createRole(name:string,permissions:string []){
      
    const data={
        permissions:permissions,
    }
    await setDoc(doc(db, "Roles", name), data);
}


export async function getRoles(){

    const rolesCollection = collection(db, 'Roles');
    const snapshot = await getDocs(rolesCollection);

    const roles = snapshot.docs.map(doc => ({
        role: doc.id,
        permissions: doc.data().permissions || [],
    } as UserRole));

    return roles;

}


export async function getRoleCount(Roles: UserRole [] | null)
{
    const userCollection=collection(db,'Users');
    const snapshot=await getDocs(userCollection);

    const roleCount: {[role:string]:number} ={};

    const roleNamesSnapshot = await getDocs(collection(db,'Roles'));

    const roleNames = roleNamesSnapshot.docs.map(doc=>doc.id);

    console.log('role Names:', roleNames);

    roleNames.forEach(roleName=>{
        roleCount[roleName]=0;
    })

    snapshot.docs.forEach(doc =>{
        const userRole=doc.data().role;

        roleCount[userRole]+=1;
    })

    return roleCount;
}

export async function getRolePermissions(role:string)
{
    const roleDocRef = doc(db, 'Roles', role);
    const roleDoc =await getDoc(roleDocRef);

    return roleDoc.data();
}

export const DeleteUserFromAuth = async (uid:any) =>{
    const deleteUserFn = httpsCallable(functions, 'deleteUserFn');
    try{
          await deleteUserFn({uid});
    }
    catch(error){
      console.error("Error calling function:", error);
    }
   }