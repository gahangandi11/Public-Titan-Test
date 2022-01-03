import {Route} from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home/Home';
import Menu from './components/Menu/Menu';

/* Ionic CSS */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import * as React from 'react';
import AppCenter from './pages/AppCenter/AppCenter';
import DataDownload from './pages/DataDownload/DataDownload';
import Login from './pages/Login/Login';
import RouteGuard from './components/Guard/RouteGuard';
import {useEffect, useState} from 'react';
import {getLinks} from './services/firestoreService';
import {LinkData} from './interfaces/LinkData';

const App: React.FC = () => {
    const [links, setLinks] = useState<LinkData[]>([]);

    useEffect(() => {
        getLinks().then(foundLinks => {
            setLinks(foundLinks);
        })
    }, []);

  return (
      <IonApp>
          <IonReactRouter>
              <Menu/>
              <IonRouterOutlet id="main">

                  <Route path="/">
                      <Login />
                  </Route>

                  <Route path="/login">
                      <Login />
                  </Route>

                  <RouteGuard path="/home">
                      <Home />
                  </RouteGuard>

                  <RouteGuard path="/data">
                      <DataDownload />
                  </RouteGuard>

                  {links.map((link) => {
                      return(
                          <RouteGuard path={'/app-center/' + link.name} key={link.name}>
                              <AppCenter title={link.name} />
                          </RouteGuard>
                      );
                  })}
              </IonRouterOutlet>
          </IonReactRouter>
      </IonApp>
  );
};

export default App;
