import * as React from 'react';
import {IonContent, IonPage} from '@ionic/react';
import Map from '../../components/Map/Map';
import Header from '../../components/Header/Header';
import './Home.css';

const Home: React.FC = () => {
    return (
        <IonPage>
            <Header title={'Home'} />
            <IonContent>
                <div className="home--content">
                    <div className="map--container">
                        <Map weather={true} jams={true} incidents={true} height={1000} zoom={6.5} />
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Home;
