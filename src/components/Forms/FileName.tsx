import {IonInput, IonItem, IonLabel} from '@ionic/react';
import * as React from 'react';
import {RouteProps} from 'react-router';

import './FileName.css';


interface FileNameProps extends RouteProps {
    file: string,
    setFile: ((file: string) => void),
    form: string
}

const FileName: React.FC<FileNameProps> = (props: FileNameProps) => {
    return (
        <div className="file-name">
            
                <span className='selector-title'>File Name</span>
                <span>:</span>
                <div className='input-box'>
                  <IonInput className="ion-input-custom" value={props.file} name="file" onInput={e => {props.setFile((e.target as HTMLInputElement).value)}} />
                </div>
            
        </div>
    )
};

export default FileName;
