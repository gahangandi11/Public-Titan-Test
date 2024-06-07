import * as React from 'react';
import './TutorialCard.css'
import {
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCol,
    IonGrid, IonIcon,
    IonLabel,
    IonRow
} from "@ionic/react";
import {RouteProps} from 'react-router';
import {TutorialData} from '../../interfaces/TutorialData';

interface CardProps extends RouteProps {
    cardData: TutorialData;
}

const TutorialCard: React.FC<CardProps> = (props: CardProps) => {
    return(
        <IonCol size="12" size-sm="12" size-md="6" size-lg="4" size-xl="3">
            <IonCard color='primary' className={"outer-tutorial-card"}>
                <IonGrid>
                    <IonRow>
                        <IonCol size="5">
                            <div className={"tutorial-card " + props.cardData.color}>
                                <IonIcon color="light" size="large" ios={props.cardData.iosIcon} md={props.cardData.mdIcon}/>
                            </div>
                        </IonCol>
                        <IonCol size="7">
                            <IonCardHeader className="ion-text-right">
                                <IonCardTitle className={'card-title'}>
                                    {props.cardData.title}
                                </IonCardTitle>
                            </IonCardHeader>
                        </IonCol>
                    </IonRow>
                    <IonRow className="top-border">
                        <IonCardContent>
                            <div className="tutorial-content-container">
                                <IonLabel>
                                    {props.cardData.description}
                                </IonLabel>
                                {props.cardData.playTour &&<IonButton className="tutorial-button" color="pink" routerLink={props.cardData.tourLink}>See how it works!</IonButton>}
                            </div>
                        </IonCardContent>
                    </IonRow>
                </IonGrid>
            </IonCard>
        </IonCol>
    );
};

export default TutorialCard;
