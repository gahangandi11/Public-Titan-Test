import {getFirestore, doc, collection, getDoc, getDocs, onSnapshot} from 'firebase/firestore';
import {getStorage, ref, getDownloadURL} from 'firebase/storage';

import {DashboardData} from '../interfaces/DashboardData';
import {LinkData} from '../interfaces/LinkData';
import {File} from '../interfaces/File';
import {User} from '../interfaces/User';
import {app, getUser} from '../firebaseConfig';

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

export async function getUserByID(id: string) {
    const userDoc = doc(db, "Users", id);
    const userSnapshot = await getDoc(userDoc);
    return userSnapshot.data() as User;
}

export async function checkStorageStatus(link: string) {
    const reference = ref(storage, link);
    return await getDownloadURL(reference);
}
