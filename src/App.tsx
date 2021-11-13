import {Redirect, Route, useHistory} from 'react-router-dom';
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
import {useState} from 'react';
import * as React from 'react';
import AppCenter from './pages/AppCenter/AppCenter';


const App: React.FC = () => {
    const [auth, setAuth] = useState(2);
    let pageDefault: JSX.Element = (<div>Error Loading Auth</div>);

    // const history = useHistory();
    // watchUser().onAuthStateChanged((fireUser) => {
    //     if (fireUser !== null) {
    //         firebaseService.getUserByID(fireUser.uid).then(doc => {
    //             const user = doc.data() as User;
    //             if (fireUser.emailVerified && user.verified) {
    //                 setAuth(2);
    //             } else if (fireUser.providerData[0]?.providerId !== 'password' && user.verified) {
    //                 setAuth(2);
    //             }else {
    //                 setAuth(1);
    //                 if (history) {
    //                     history.push('/');
    //                 }
    //             }
    //         });
    //     } else {
    //         setAuth(0);
    //         if (history) {
    //             history.push('/');
    //         }
    //     }
    // });

  if (auth === 0) {
    pageDefault = (
        <Route path="/" exact={true}>
          <Redirect to="/login" />
        </Route>
    );
  }

  if (auth === 2) {
    pageDefault = (
        <Route path="/" exact={true}>
          <Redirect to="/home"/>
        </Route>
    );
  }

  return (
      <IonApp>
        <IonReactRouter>
          <Menu/>
          <IonRouterOutlet id="main">
            {pageDefault}
            <Route path="/home">
              <Home />
            </Route>
              <Route path="/app-center/Safety">
                  <AppCenter title={'Safety'} />
              </Route>

              <Route path="/app-center/Congestion">
                  <AppCenter title={'Congestion'} />
              </Route>

              <Route path="/app-center/TravelTime">
                  <AppCenter title={'TravelTime'} />
              </Route>

              <Route path="/app-center/TrafficCounts">
                  <AppCenter title={'TrafficCounts'} />
              </Route>

              <Route path="/app-center/TrafficJams">
                  <AppCenter title={'TrafficJams'} />
              </Route>

              <Route path="/app-center/WazeAnalytics">
                  <AppCenter title={'WazeAnalytics'} />
              </Route>

              <Route path="/app-center/TranscoreAnalytics">
                  <AppCenter title={'TranscoreAnalytics'} />
              </Route>
          </IonRouterOutlet>
        </IonReactRouter>
      </IonApp>
  );
};

export default App;
