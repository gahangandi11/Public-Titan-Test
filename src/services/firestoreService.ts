import {firebaseConfig} from '../firebaseConfig';
import {initializeApp} from 'firebase/app';
import {getFirestore, doc, collection, getDoc, getDocs} from 'firebase/firestore';
import {DashboardData} from '../interfaces/DashboardData';
import {LinkData} from '../interfaces/LinkData';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
