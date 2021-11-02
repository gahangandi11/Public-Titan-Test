import {firebaseConfig} from '../firebaseConfig';
import {initializeApp} from 'firebase/app';
import {getFirestore, doc, getDoc} from 'firebase/firestore';
import {DashboardData} from '../interfaces/DashboardData';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function getDashboardContent() {
    const dashboardDoc = doc(db, 'Dashboard', 'CURRENT');
    const dashboardSnapshot = await getDoc(dashboardDoc);
    return dashboardSnapshot.data() as DashboardData;
}
