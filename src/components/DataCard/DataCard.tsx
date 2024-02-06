import {
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonIcon,
  IonRow,
  IonModal,
  IonPopover,
  IonContent,
  IonLabel,
  IonAlert,
} from "@ionic/react";
import * as React from "react";
import { DataCardContent } from "../../interfaces/DataCardContent";
import "./DataCard.css";
import { useRef, useState } from "react";

interface DataCardProps {
  content: DataCardContent;
  type: boolean;
}

const DataCard: React.FC<DataCardProps> = (props: DataCardProps) => {
    const [modalOpen, setModalOpen] = useState(false);

    const openModal = () => {
      setModalOpen(true);
    };
  
    const closeModal = () => {
      setModalOpen(false);
    };

  return (
    <div>
      <IonCard
        id={props.content.title}
        color="primary"
        className="data-card hover-column"
        onClick={openModal}
      >
        <IonCardTitle className="data-card__title">
          {props.content.title}
          {!props.type && (
            <div className={"data-card__icon " + props.content.color}>
              <IonIcon
                color="light"
                ios={props.content.ios}
                md={props.content.md}
              />
            </div>
          )}
          {props.type && (
            <div className={"data-card__icon icon__neutral"}>
              <IonIcon
                color={props.content.color === "icon__green" ? "green" : "red"}
                ios={props.content.ios}
                md={props.content.md}
              />
            </div>
          )}
        </IonCardTitle>
        <IonCardContent>
          <div className="data-card__data">{props.content.data}</div>
        </IonCardContent>
        <IonRow className="data-card__date">{props.content.updated}</IonRow>
      </IonCard>

     
      <IonAlert
        isOpen={modalOpen}
        header={props.content.title}
        // subHeader="A Sub Header Is Optional"
        message={"Source: "+props.content.source}
        buttons={['Okay']}
        onDidDismiss={closeModal}
      ></IonAlert>

   
      
    </div>
  );
};

export default DataCard;
