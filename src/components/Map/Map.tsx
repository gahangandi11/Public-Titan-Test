import * as React from 'react';
import {IonCard} from '@ionic/react';

const Map = () => {

    return(
        <IonCard>
            {/* @ts-ignore */}
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3103.282209728817!2d-92.32992618464839!3d38.94038077956403!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87dcb79505ed8739%3A0xc18305329c07fb48!2sUniversity%20of%20Missouri!5e0!3m2!1sen!2sus!4v1635889808920!5m2!1sen!2sus" width="1000" height="500" loading="lazy"/>
        </IonCard>
    );
};

export default Map;
