import { useEffect, useRef, useState } from "react";
import aituBridge from "@btsd/aitu-bridge";
import {
  IonApp,
  IonSlides,
  IonSlide,
  IonContent,
  IonButton,
  IonText,
  IonToast,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonBadge,
  IonTab,
  IonHeader,
  IonItem,
  IonToolbar,
  IonTitle,
  IonRouterOutlet,
  IonPage,
} from "@ionic/react";
import {IonReactRouter} from '@ionic/react-router'
import { 
  gameController,
  person,
  calendar, personCircle, map, informationCircle
} from 'ionicons/icons';
import { Route, Redirect } from 'react-router';

import FriendsList from './components/FriendsList';

import "./App.css";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";

const App: React.FC = () => {
  async function getMe() {
    try {
      await aituBridge.getMe();

    } catch (e) {
      // handle error
      console.log(e);
    }
  }

  useEffect(() => {
    if (aituBridge.isSupported()) {
      // getMe();
    }
  }, []);

  const [name, setName] = useState('');

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Redirect exact path="/tabs" to="/tabs/schedule" />
          {/*
            Using the render method prop cuts down the number of renders your components will have due to route changes.
            Use the component prop when your component depends on the RouterComponentProps passed in automatically.
          */}
          <Route path="/games" render={() => <IonPage><FriendsList /></IonPage>} exact={true} />
          <Route path="/leaderboards" render={() => <IonPage><FriendsList /></IonPage>} exact={true} />
          <Route path="/profile" render={() => <IonPage><FriendsList /></IonPage>} exact={true} />
        </IonRouterOutlet>
      </IonReactRouter>
        
      <IonTabs>
        <IonTabBar slot="bottom">
          <IonTabButton tab="games" href="/tabs/games">
            <IonIcon icon={gameController} />
            <IonLabel>Games</IonLabel>
          </IonTabButton>

          <IonTabButton tab="leaderboards" href="/tabs/leaderboards">
            <IonIcon icon={calendar} />
            <IonLabel>Leaderboards</IonLabel>
          </IonTabButton>

          <IonTabButton tab="profile" href="/tabs/profile">
            <IonIcon icon={person} />
            <IonLabel>Profile</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonApp>
  );
};

export default App;