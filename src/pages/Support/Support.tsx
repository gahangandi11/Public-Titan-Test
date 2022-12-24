import React, {  useState } from "react";
import {
  IonButton,
  IonInput,
  IonCard,
  IonContent,
  IonCardTitle,
  IonCardContent,
  IonCardHeader,
  IonLabel,
  IonPage,
  IonTextarea,
  useIonToast,
} from "@ionic/react";
import "./Support.css";
import Header from "../../components/Header/Header";
import { useAuth } from "../../services/contexts/AuthContext/AuthContext";
import { organization as organizationList } from "../../assets/organization";
import { supporttype as supportTypeList } from "../../assets/supporttype";

import DDSelector from "../../components/Forms/DropDownSelector";
import { submitFeedbackRequest } from "../../services/firestoreService";
import { useHistory } from "react-router";

const Support: React.FC = () => {
  const [type, setType] = useState<{ name: string; value: string }[]>([]);
  const [organization, setOrganization] =
    useState<{ name: string; value: string }[]>([]);
  const [requesterName, setRequesterName] = useState("");
  const [description, setDescription] = useState("");

  const { currentUser, userDoc } = useAuth();

  const [present, dismiss] = useIonToast();
  const history = useHistory();

  function validateFields(): boolean {
    if (
      organization == null ||
      organization.length < 1 ||
      type == null ||
      type.length < 1 ||
      organization == null ||
      organization.length < 1 ||
      requesterName.length < 1||
      description.length < 1
    )
      return false;
    return true;
  }

  async function onSubmit() {
    if (validateFields()) {
      try {
        const userData  = {
          uid: currentUser.uid,
          organization: organization?.at(0)?.value,
          type: type?.at(0)?.value,
          requesterName: requesterName,
          requesterEmail:currentUser.email,
          requestedDate: getCurrentDateAndTime(),
          description:description
          
        } ;
        await submitFeedbackRequest(userData);
        clear();

        present({
          buttons: [{ text: "dismiss", handler: () => dismiss() }],
          message: "Requested successfully",
          duration: 5000,
          color: "success",
        });
        history.push("/home");
      } catch (e: any) {
        present({
          buttons: [{ text: "dismiss", handler: () => dismiss() }],
          message: e,
          duration: 5000,
          color: "danger",
        });
      }
    } else {
      present({
        buttons: [{ text: "dismiss", handler: () => dismiss() }],
        message: "All fields are required.",
        duration: 5000,
        color: "danger",
      });
    }
  }
  
  function clear()
  {
    setRequesterName("")
    setDescription("")
    setType([])
    setOrganization([])
  }
  function getCurrentDateAndTime(): string {
    const date = new Date();
    const n = date.toDateString();
    const time = date.toLocaleTimeString();
    return n + " " + time;
  }

  return (
    <IonPage >
      <Header title="Support" hideProfileButton={true} />
      <IonContent fullscreen color="light">
        <IonCard className="form-card">
          <IonCardHeader>
            <IonCardTitle>Support Request</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <DDSelector
              title="Select Organization"
              data={organization}
              onDataChange={setOrganization}
              options={organizationList}
              width="county-select"
              allowMultipleOption={false}
            />
            <DDSelector
              title="Select Type"
              data={type}
              onDataChange={setType}
              options={supportTypeList}
              width="county-select"
              allowMultipleOption={false}
            />
           
            <div className="form-div county-column">
              <IonLabel>Requester Name</IonLabel>
              <div className="county-form-div">
                <IonInput
                  className="form-input"
                  value={requesterName}
                  onIonChange={(val) => {
                    const inputCheck = val.detail.value;
                    if (inputCheck) {
                      setRequesterName(inputCheck);
                    }
                  }}
                />
              </div>
            </div>

            <div className="form-div county-column">
              <IonLabel>Description</IonLabel>
              <div className="county-form-div">
                <IonTextarea
                rows={5}
                  className="form-input"
                  value={description}
                  onIonChange={(val) => {
                    const inputCheck = val.detail.value;
                    if (inputCheck) {
                      setDescription(inputCheck);
                    }
                  }}
                />
              </div>
            </div>

            <IonButton
              color="secondary"
              onClick={() => {
                onSubmit();
              }}
            >
              Submit
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Support;
