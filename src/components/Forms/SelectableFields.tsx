import {IonItem, IonLabel, IonSelect, IonSelectOption} from '@ionic/react';
import * as React from 'react';
import {RouteProps} from 'react-router';

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
            <div className="form-div">
                <IonItem color="secondary" className="form-item">
                    <IonLabel position="stacked">Units for Travel Time</IonLabel>
                    <IonSelect value={props.unit} placeholder="Select One" name="unit" onIonChange={e => props.setUnit(e.detail.value)}>
                        <IonSelectOption value={60}>minutes</IonSelectOption>
                        <IonSelectOption value={1}>seconds</IonSelectOption>
                    </IonSelect>
                </IonItem>
            </div>
            <div className="form-div">
                <IonItem color="secondary" className="form-item">
                    <IonLabel position="stacked">Aggregation Interval</IonLabel>
                    <IonSelect value={props.interval} placeholder="Select One" name="interval" onIonChange={e => props.setInterval(e.detail.value)}>
                        <IonSelectOption value={60}>60 min</IonSelectOption>
                        <IonSelectOption value={30}>30 min</IonSelectOption>
                        <IonSelectOption value={15}>15 min</IonSelectOption>
                        <IonSelectOption value={5}>5 min</IonSelectOption>
                    </IonSelect>
                </IonItem>
            </div>
        </div>
    );
};

export default SelectableFields;
