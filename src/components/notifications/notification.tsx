import * as React from 'react';
import { useEffect } from 'react';

import './notification.css';

import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

interface NotificationProps {
    setShowNotification: (value: any) => void;
    NotificationProperties: { 'message': string, 'color': string };
    operation_loading: boolean;
}

const Notification: React.FC<NotificationProps> = ({ setShowNotification, NotificationProperties, operation_loading }) => {

    useEffect(() => {
        if (!operation_loading) {
            setTimeout(() => {
                setShowNotification(false);
            }, 1000)
        }
    }
        , []);

    return (
        <div className="notification-overlay">
            {operation_loading ? (
                <div className={`notification-bar ${NotificationProperties.color==='green' ? 'notification-greeen' :'notification-red'}`}>
                    <div>
                        <CircularProgress
                            sx={{ color: 'white' }}
                            size={25}
                        />
                    </div>
                    <div>
                        {NotificationProperties.color === 'green' ? <p>Aprroving user .....</p> : <p>Deleting User .....</p>}
                    </div>
                </div>
            ) : (
                <Alert
                    variant="filled"
                    severity="success"
                    sx={{ width: 300, backgroundColor: NotificationProperties.color }}
                >
                    {NotificationProperties.message}
                </Alert>
            )}
        </div>
    )
}



export default Notification;