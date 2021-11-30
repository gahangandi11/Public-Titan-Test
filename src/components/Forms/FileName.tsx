import {IonInput, IonItem, IonLabel} from '@ionic/react';
import * as React from 'react';
import {RouteProps} from 'react-router';

interface FileNameProps extends RouteProps {
    file: string,
    setFile: ((file: string) => void),
    form: string
}

const FileName: React.FC<FileNameProps> = (props: FileNameProps) => {
    return (
        <div className="form-div">
            <IonItem color="secondary" className="form-item">
                <IonLabel position="stacked">File Name</IonLabel>
                <IonInput value={props.file} name="file" onInput={e => {props.setFile((e.target as HTMLInputElement).value)}} />
            </IonItem>
        </div>
    )
};

export default FileName;
