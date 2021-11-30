import * as React from 'react';
import {IonCheckbox, IonCol, IonGrid, IonItem, IonLabel, IonRow} from '@ionic/react';
import {RouteProps} from 'react-router';

interface AttributesProps extends RouteProps {
    attributeOptions: Attribute[],
    setCheck: ((event: CustomEvent) => void),
    form: string
}

interface Attribute {
    name: string;
    checked: boolean;
}

const DataAttributes: React.FC<AttributesProps> = (props: AttributesProps) => {
    return (
        <div className="form-div third-step">
            <IonGrid>
                <IonLabel>Data Attributes</IonLabel>
                <IonRow>
                    {props.attributeOptions.map(({name}, index) => {
                        return (
                            <IonCol size="12" size-sm="12" size-md="6" size-lg="6" size-xl="3" key={index}>
                                <IonItem className="check">
                                    <IonCheckbox slot="start" color="medium" value={name} onIonChange={props.setCheck}/>
                                    <IonLabel>{name}</IonLabel>
                                </IonItem>
                            </IonCol>
                        );
                    })}

                </IonRow>
            </IonGrid>
        </div>
    );
};

export default DataAttributes;
