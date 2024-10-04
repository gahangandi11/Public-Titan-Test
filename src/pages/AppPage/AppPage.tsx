import * as React from "react";
import { IonContent,IonPage, IonToast } from "@ionic/react";
import { RouteProps, useHistory } from "react-router";
import Header from "../../components/Header/Header";
import "./AppPage.css";
import { useState } from "react";
import { getLink } from "../../services/firestoreService";

interface AppCenterProps extends RouteProps {
  title: string;
}

const AppPage: React.FC<AppCenterProps> = (props: AppCenterProps) => {
  const [pageLink, setPageLink] = useState("");
  const [errorResponse, setErrorResponse] = useState(false);

  const [connectClass, setConnectClass] = useState("connect");


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
      <IonContent>
        {!errorResponse && <iframe className="iframe" src={pageLink} />}
      </IonContent>
    </IonPage>
  );
};

export default AppPage;
