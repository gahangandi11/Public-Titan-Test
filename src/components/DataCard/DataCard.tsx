import {IonCard, IonCardContent, IonCardTitle, IonIcon, IonRow} from '@ionic/react';
import * as React from 'react';
import {DataCardContent} from '../../interfaces/DataCardContent';
import './DataCard.css';

interface DataCardProps {
    content: DataCardContent
    type: boolean
}

const DataCard: React.FC<DataCardProps> = (props: DataCardProps) => {
    return (
        <IonCard color="primary" className="data-card">
            <IonCardTitle className="data-card__title">
                {props.content.title}
                {!props.type && <div className={'data-card__icon ' + props.content.color}>
                    <IonIcon color="light" ios={props.content.ios} md={props.content.md} />
                </div>}
                {props.type && <div className={'data-card__icon icon__neutral'}>
                    <IonIcon color={props.content.color === 'icon__green' ? 'green' : 'red'} ios={props.content.ios} md={props.content.md} />
                </div>}
            </IonCardTitle>
            <IonCardContent>
                <div className="data-card__data">
                    {props.content.data}
                </div>
            </IonCardContent>
            <IonRow className="data-card__date">
                {props.content.updated}
            </IonRow>
        </IonCard>
    );
};

export default DataCard;
