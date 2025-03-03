import * as React from "react";
import { IonContent, IonPage, IonToast } from "@ionic/react";
import { RouteProps } from "react-router";
import Header from "../../components/Header/Header";
import "./AppPage.css";
import { useState } from "react";
import { getLink } from "../../services/firestoreService";

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import Button from '@mui/material/Button';
import { IonIcon } from '@ionic/react';
import { informationCircleSharp, } from "ionicons/icons";
import Tooltip from '@mui/material/Tooltip';


const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface AppCenterProps extends RouteProps {
  title: string;
}

const AppPage: React.FC<AppCenterProps> = (props: AppCenterProps) => {
  const [pageLink, setPageLink] = useState("");
  const [errorResponse, setErrorResponse] = useState(false);

  const [connectClass, setConnectClass] = useState("connect");

  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };


  React.useEffect(() => {
    setConnectClass("connect");
    setErrorResponse(false);
    getLink(props.title).then((link) => {
      setErrorResponse(false);
      setPageLink(link.link);
    });
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
            text: "Ok",
            side: "end",
            role: "cancel",
          },
        ]}
      />
      <IonContent className="ion-content-div">
        {
          props.title === "WinterSeverity" && 
          (
            <div className="hide-iframe-buttons" >
            <Tooltip title="click here for detailed explanation of terms">
             <div className="icon-and-text" onClick={() => openModal()}>
               <IonIcon className="more-info-icon" color="light" ios={informationCircleSharp} md={informationCircleSharp} />
               <div>
                 <span className="icon-text">More Info</span>
               </div>
             </div>
             </Tooltip>
           </div>
          )
        }
        {!errorResponse && <iframe className="iframe" src={pageLink} />}
      </IonContent>

   
      <Dialog
        className='alert-class'
        open={modalOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={closeModal}
        aria-describedby="alert-dialog-slide-description"
      >
        <h4 className='alert-title'>Detailed explanation of Terms</h4>
        <DialogContent>
          <h6 className='alert-source'>
                Purpose of Winter Severity Index (WSI)
          </h6>
          <DialogContentText id="alert-dialog-slide-description">
                  The WSI tracks the impacts winter weather has on the traveling public and MoDOT operations.  
                  Knowing these impacts aids MoDOT in the review and analysis of each storm or a winter season 
                  and allows the department to better compare response practices and performance across the 
                  diverse regions of Missouri.
          </DialogContentText>

          <h6 className='alert-source'>
              WSI_we 
          </h6>

          <DialogContentText id="alert-dialog-slide-description">
                  Compares the amount of precipitation accumulated during the current winter season to the average 
                  accumulation in past seasons. A WSIwe of 1.35 means the amount of accumulating precipitation we have received 
                  is approximately 35% greater than a yearly average.
          </DialogContentText>

          <h6 className='alert-source'>
              WSI_cr
          </h6>

          <DialogContentText id="alert-dialog-slide-description">
          Compares the crash costs during the current winter season to the average crash cost in past seasons.
           Crash costs are normalized to property damage only (PDO) crashes. For example 1 Fatal crash is equivalent to 950 PDO crashes.
          </DialogContentText>

          <h6 className='alert-source'>
              WSI_op
          </h6>

          <DialogContentText id="alert-dialog-slide-description">
              Compares operational costs during the current winter season to the average operational cost in past seasons.
          </DialogContentText>

          <h6 className='alert-source'>
              WSI_dl
          </h6>

          <DialogContentText id="alert-dialog-slide-description">
          Compares delay costs during the current winter season to the average delay cost in past seasons.
          </DialogContentText>

          <h6 className='alert-source'>
           Data Sources
          </h6>

          <DialogContentText id="alert-dialog-slide-description">
          Data sources used for this tool include MoDOT TMS and MMS data, Road Weather Information System (RWIS), 
          Missouri Automated Surface Observation System (ASOS), HERE Traffic Analytics, Missouri State Highway Patrol, 
          and the National Weather Service.
          </DialogContentText>
        </DialogContent>
        <div className='alert-buttons' onClick={closeModal}>
          <Button >Close</Button>
        </div>
      </Dialog>

    </IonPage>
  );
};

export default AppPage;
