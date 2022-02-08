import * as React from 'react';
import './CctvPlayer.css';

import {
    IonButton,
    IonButtons,
    IonCard,
    IonIcon,
    IonLabel,
    IonToolbar

} from "@ionic/react";

import {
    closeOutline
} from "ionicons/icons";
import {RouteProps} from "react-router";
import {Camera} from '../../interfaces/Camera';
import ReactPlayer from "react-player";

export interface CctvPlayerProps extends RouteProps {
    cctv: Camera;
    isIOS: boolean;
    closeCCTV: ((id: number) => void) | null;
    error: ((error: string, id: number) => void);
    onClick?: () => void;
}

const CctvPlayer: React.FC<CctvPlayerProps> = (props:CctvPlayerProps) => {
    const currentCCTV: Camera = props.cctv;
    const isIOS: boolean = props.isIOS;
    let cardType = 'react-player-card';
    if (props.closeCCTV == null) {
        cardType = 'active-player-card';
    }
    return(
            <IonCard className={cardType} onClick={props.onClick}>
                <IonToolbar color="light" className="react-player-card-header">
                    <IonLabel className="react-player-card-title">Location: {currentCCTV?.description}</IonLabel>
                    <IonButtons slot="end">
                        {props.closeCCTV != null && <IonButton size="large" fill="clear" onClick={ () => {
                            if (props.closeCCTV != null) {
                                props.closeCCTV(currentCCTV.id)
                            }
                        } }>
                            <IonIcon md={closeOutline} />
                        </IonButton>}
                    </IonButtons>
                </IonToolbar>
                <div className="react-player-container">
                    { !isIOS && <ReactPlayer width="100%" height="80%" url={currentCCTV.https_url} onError={(error) => {props.error(error, currentCCTV.id)}} playing={true} volume={1} muted={true} controls={true} /> }
                    { isIOS && <ReactPlayer width="100%" height="80%" url={currentCCTV.ios_Url} onError={(error) => {props.error(error, currentCCTV.id)}}  playing={true} volume={1} muted={true} controls={true} /> }
                </div>
            </IonCard>
    );
};

export default CctvPlayer;
