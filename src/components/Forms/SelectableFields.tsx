import {IonItem, IonLabel, IonSelect, IonSelectOption} from '@ionic/react';
import * as React from 'react';
import {RouteProps} from 'react-router';

import FileName from './FileName';

import './SelectableFields.css';

interface SelectableProps extends RouteProps {
    unit: number,
    interval: number,
    setUnit: ((unit: number) => void),
    setInterval: ((interval: number) => void),
    form: string
}

const SelectableFields: React.FC<SelectableProps> = (props: SelectableProps) => {
    return (
        <div className="selectable fourth-step">
            <div className="selectable-form-div">
                {/* <IonItem color="secondary" className="form-item"> */}
                    <span className='selector-title'>Units for Travel Time</span>
                    <span>:</span>
                    <div className="form-selectors">                    
                        <IonSelect value={props.unit} placeholder="Select One" name="unit" onIonChange={e => props.setUnit(e.detail.value)}>
                            <IonSelectOption value={60}>minutes</IonSelectOption>
                            <IonSelectOption value={1}>seconds</IonSelectOption>
                        </IonSelect>
                    </div>
                {/* </IonItem> */}
            </div>
            <div className="selectable-form-div">
                {/* <IonItem color="secondary" className="form-item"> */}
                    <span className='selector-title'>Aggregation Interval</span>
                    <span>:</span>
                    <div className="form-selectors">                    
                    <IonSelect value={props.interval} placeholder="Select One" name="interval" onIonChange={e => props.setInterval(e.detail.value)}>
                        <IonSelectOption value={60}>60 min</IonSelectOption>
                        <IonSelectOption value={30}>30 min</IonSelectOption>
                        <IonSelectOption value={15}>15 min</IonSelectOption>
                        <IonSelectOption value={5}>5 min</IonSelectOption>
                    </IonSelect>
                    </div>
                {/* </IonItem> */}
            </div>
        </div>
    );
};

export default SelectableFields;
