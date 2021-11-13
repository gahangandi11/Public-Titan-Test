import * as React from 'react';
import {IonContent, IonIcon, IonItem, IonPage, IonToast} from '@ionic/react';
import {RouteProps, useHistory} from 'react-router';
import Header from '../../components/Header/Header';
import './AppCenter.css';
import {useState} from 'react';
import {closeOutline, closeSharp} from 'ionicons/icons';
import {getLink} from '../../services/firestoreService';

interface AppCenterProps extends RouteProps {
    title: string;
}

const AppCenter: React.FC<AppCenterProps> = (props: AppCenterProps) => {
    const [pageLink, setPageLink] = useState('');
    const [errorResponse, setErrorResponse] = useState(false);
    const [closeReconnect, setCloseReconnect] = useState(false);
    const [closeConnect, setCloseConnect] = useState(false);
    const [connectClass, setConnectClass] = useState('connect');
    const history = useHistory();

    React.useEffect(() => {
        setCloseConnect(false);
        setCloseReconnect(false);
        setConnectClass('connect');
        setErrorResponse(false);
        getLink(props.title).then(link => {
            setErrorResponse(false);
            setPageLink(link.link);
        });

        setTimeout(() => {
            setCloseConnect(true);
            setCloseReconnect(true);
        }, 20000);

    }, [props.title]);

    return (
        <IonPage>
            <Header title={props.title} />
            <IonToast
                isOpen={errorResponse}
                onDidDismiss={() => setErrorResponse(false)}
                color="danger"
                message="Oops. Looks like we're having some trouble connecting to OmniSci. Please make sure third-party cookies are enabled and try again!"
                cssClass="toast-error"
                buttons={[
                    {
                        text: 'Ok',
                        side: 'end',
                        role: 'cancel'
                    }
                ]}
            />
            { !closeReconnect && <div className="please-wait">
                <IonItem color="primary" lines="none" button={true} onClick={() => {history.go(0)}}>
                    Reconnect to TITAN Dashboard &nbsp; <IonIcon onClick={(event) => {setCloseReconnect(true); setConnectClass(''); event.stopPropagation()}} md={closeSharp} ios={closeOutline} />
                </IonItem>
            </div>}
            { !closeConnect && <div className={"please-wait " + connectClass}>
                <IonItem color="primary" lines="none" button={true} onClick={() => window.open(pageLink, "_blank")}>
                    Connect Directly to TITAN Dashboard &nbsp; <IonIcon onClick={(event) => {setCloseConnect(true); event.stopPropagation()}} md={closeSharp} ios={closeOutline} />
                </IonItem>
            </div>}
            <IonContent>
                {!errorResponse && <iframe className="iframe" src={pageLink} />}
            </IonContent>
        </IonPage>
    );
};

export default AppCenter;
