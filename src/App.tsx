import { Redirect, Route , useParams, useHistory} from "react-router-dom";
import { IonApp, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

import LiveData from "./pages/LiveData/LiveData";
import Homepage from "./pages/Home/HomePage";
import Menu from "./components/Menu/Menu";

import AppCenter from "./pages/AppCenter/AppCenter";
import OtherApps from "./pages/OtherApps/OtherApps";
import Tutorials from "./pages/Tutorials/Tutorials";


/* Ionic CSS */
import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import * as React from "react";
import AppPage from "./pages/AppPage/AppPage";
import DataDownload from "./pages/DataDownload/DataDownload";
import Login from "./pages/Login/Login";
import RouteGuard from "./components/Guard/RouteGuard";
import { useEffect, useState, useRef, useCallback } from "react";
import { getAuthToken, getLinks } from "./services/firestoreService";
import { LinkData } from "./interfaces/LinkData";
import Dashboard from "./pages/Dashboard/Dashboard";
import { setAuthToken } from "./services/bigQueryService";
import AuthProvider, {
  watchUser,
} from "./services/contexts/AuthContext/AuthContext";
import Profile from "./pages/Profile/Profile";
import Support from "./pages/Support/Support";
import ForgotPassword from "./pages/Login/ForgotPassword";
import EmailVerification from "./pages/Login/EmailVerification";
import RedirectHandler from "./pages/Login/RedirectUrlHandler";
import ReValidation from "./pages/Login/AccountReValidation";
import Issues from "./pages/Issues/Issues";
import NewIssue from "./pages/New Issue/NewIssue";
import IssueDetail from "./pages/IssueDetail/IssueDetail";
import SMSSignUp from "./pages/Login/SMSSignUp";
import Signup from "./pages/Login/Signup";

import { logout } from "./services/contexts/AuthContext/AuthContext";
import { log } from "console";

const DynamicAppPage: React.FC = () => {
  const { title } = useParams<{ title: string }>();
  return <AppPage title={title} />;
};



const App: React.FC = () => {
  const [links, setLinks] = useState<LinkData[]>([]);





  useEffect(() => {
    
    watchUser().onAuthStateChanged((user) => {
      if (user) {

        // Set the auth token in the BigQuery service
        getAuthToken().then((doc) => {
          setAuthToken(doc);
        }).catch((error) => {
          console.error("Error fetching auth token:", error);
          }
        );
        
        // Fetch links to the app center dashboards
        getLinks().then((foundLinks) => {
          setLinks(foundLinks);
        }).catch((error) => {
          console.error("Error fetching links:", error);
        }
        );
      }
    });

  }, []);

  return (
    
      <IonApp>
        <IonReactRouter>
        <AuthProvider>
          <Menu />
        </AuthProvider>
          <IonRouterOutlet id="main">
            <Route path="/login" exact={true}>
              <Login />
              <RedirectHandler />
            </Route>

            <Route path="/forgotPassword" exact={true}>
              <ForgotPassword />
            </Route>

            <Route path="/verification" exact={true}>
              <EmailVerification />
            </Route>

            <Route path="/signup" exact={true}>
              <Signup/>
            </Route>

            {/* <Route path="/smssignup" exact={true}>
              <SMSSignUp />
            </Route> */}

            <Route path="/renewaccount" exact={true}>
              <ReValidation />
            </Route>
          <AuthProvider>
            <RouteGuard path="/" exact={true}>
              <Redirect to="/homepage" />
              {/* <Homepage /> */}
            </RouteGuard>

            <RouteGuard path="/homepage" exact={true}>
              <Homepage />
            </RouteGuard>

            <RouteGuard path="/livedata" exact={true}>
              <LiveData />
            </RouteGuard>

            <RouteGuard path="/dashboard" exact={true}>
              <Dashboard />
            </RouteGuard>

            <RouteGuard path="/data" exact={true}>
              <DataDownload />
            </RouteGuard>

            <RouteGuard path="/appcenter" exact={true}>
              <AppCenter/>
            </RouteGuard>

            <RouteGuard path="/appcenter/otherapps" exact={true}>
              <OtherApps/>
            </RouteGuard>

            <RouteGuard path="/tutorials" exact={true}>
              <Tutorials />
            </RouteGuard>

            <RouteGuard path="/issues" exact={true}>
              <Issues />
            </RouteGuard>

            <RouteGuard path="/issues-new" exact={true}>
              <NewIssue />
            </RouteGuard>

            <RouteGuard path="/issues/:issueId" exact={true}> {/* Use exact={true} if this is the only dynamic part */}
              <IssueDetail />
            </RouteGuard>

            <RouteGuard path="/profile" exact={true}>
              <Profile />
            </RouteGuard>


            <RouteGuard path="/support" exact={true}>
              <Support />
            </RouteGuard>

            {links.map((link) => {
              return (
                <RouteGuard path={"/app-center/" + link.name} key={link.name}>
                  <AppPage title={link.name} />
                </RouteGuard>
              );
            })}

             {/* Catch-all route for /app-center/* - This will handle refreshes on the app center pages if links are not fetched properly*/}
             <RouteGuard path="/app-center/:title">
              <DynamicAppPage />
            </RouteGuard>
        </AuthProvider>
          </IonRouterOutlet>
        </IonReactRouter>
      </IonApp>
    
  );
};

export default App;
