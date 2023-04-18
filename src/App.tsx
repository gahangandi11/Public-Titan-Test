import { Redirect, Route, useHistory } from "react-router-dom";
import { IonApp, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import Home from "./pages/Home/Home";
import Menu from "./components/Menu/Menu";

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
import AppCenter from "./pages/AppCenter/AppCenter";
import DataDownload from "./pages/DataDownload/DataDownload";
import Login from "./pages/Login/Login";
import RouteGuard from "./components/Guard/RouteGuard";
import { useEffect, useState } from "react";
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

const App: React.FC = () => {
  const [links, setLinks] = useState<LinkData[]>([]);

  useEffect(() => {
    getAuthToken().then((doc) => {
      setAuthToken(doc);
    });
    watchUser().onAuthStateChanged((user) => {
      if (user) {
        getLinks().then((foundLinks) => {
          setLinks(foundLinks);
        });
      }
    });
  }, []);

  return (
    <AuthProvider>
      <IonApp>
        <IonReactRouter>
          <Menu />
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

            <Route path="/renewaccount" exact={true}>
              <ReValidation />
            </Route>

            <RouteGuard path="/" exact={true}>
              <Redirect to="/home" />
            </RouteGuard>

            <RouteGuard path="/home" exact={true}>
              <Home />
            </RouteGuard>

            <RouteGuard path="/dashboard" exact={true}>
              <Dashboard />
            </RouteGuard>

            <RouteGuard path="/data" exact={true}>
              <DataDownload />
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
                  <AppCenter title={link.name} />
                </RouteGuard>
              );
            })}
          </IonRouterOutlet>
        </IonReactRouter>
      </IonApp>
    </AuthProvider>
  );
};

export default App;
