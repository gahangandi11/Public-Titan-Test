import * as React from 'react';
import { useEffect } from 'react';

import './notification.css';

import Alert from '@mui/material/Alert';


interface NotificationProps{
    setShowNotification: (value: any) => void;
}

const Notification:React.FC<NotificationProps>=({setShowNotification})=>{
    
    useEffect(()=>{
        setTimeout(()=>{
            setShowNotification(false);
        }, 1000)
    }
    ,[]);

    return(
        <div className="notification-overlay">
        <Alert variant="filled" severity="success" sx={{width:300}}>
            User approved successfully
        </Alert>
      </div>
    )
}



export default Notification;