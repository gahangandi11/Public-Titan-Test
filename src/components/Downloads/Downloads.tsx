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
        watchDownloads().then(filesCollection => {
            onSnapshot(filesCollection, (snapshot) => {
                const foundFiles: File[] = [];
                snapshot.forEach(doc => {
                    foundFiles.push(doc.data() as File);
                });
                setFiles(foundFiles);
            });
        });
    }, []);
    return(
        <IonCard color="primary" className="downloads">
            {files.map(file => {
                if (file.type === props.page) {
                    return (
                        <IonItem color="primary" key={file.fileName}>
                            <div className="button--spacer">
                                <span>{file.fileName}</span>
                                {file.ready && <IonButton color="secondary" className="query-button" download="Query File" onClick={() => handleFile(file)}>Download Ready</IonButton>}
                                {!file.ready && <IonButton className="query-button" disabled={true} color="danger">Download Preparing</IonButton>}
                            </div>
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
