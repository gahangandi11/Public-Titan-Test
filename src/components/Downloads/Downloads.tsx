import {IonButton, IonCard, IonCol, IonItem} from '@ionic/react';
import React, {useEffect, useState} from 'react';
import {checkStorageStatus, watchDownloads} from '../../services/firestoreService';
import {File} from '../../interfaces/File';
import {watchUser} from '../../firebaseConfig';
import {onSnapshot} from 'firebase/firestore';

interface DownloadProps {
    page: string;
}

const Downloads: React.FC<DownloadProps> = (props: DownloadProps) => {
    const [files, setFiles] = useState<File[]>([]);

    const handleFile = (file: File) => {
        checkStorageStatus(file.location).then(url => {
            window.open(url, "_blank");
        }).catch((err: any) => {
            console.log(err);
            window.open(file.location, "_blank");
        });
    };

    useEffect(() => {
        watchUser().onAuthStateChanged(() => {
            watchDownloads().then(foundFiles => {
                if (foundFiles != null) {
                    onSnapshot(foundFiles, (userFilesSnapshot) => {
                        const userFiles: File[] = [];
                        userFilesSnapshot.forEach(doc => {
                            const file = doc.data() as File;
                            userFiles.push(file);
                        });
                        setFiles(userFiles);
                    });
                }
            });
        });
    }, []);
    return(
        <IonCard color="primary">
            {files.map(file => {
                if (file.type === props.page) {
                    return (
                        <IonItem color="primary" key={file.fileName}>
                            {file.fileName}
                            {file.ready && <IonCol><IonButton color="secondary" className="query-button" download="Query File" onClick={() => handleFile(file)}>Download Ready</IonButton></IonCol>}
                            {!file.ready && <IonCol><IonButton className="query-button" disabled={true} color="danger">Download Preparing</IonButton></IonCol>}
                        </IonItem>
                    );
                } else {
                    return null;
                }
            })}
        </IonCard>
    )
};

export default Downloads;