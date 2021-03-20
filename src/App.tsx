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
  star
} from 'ionicons/icons';
import { Route, Redirect, Switch } from 'react-router';

import FriendsList from './components/FriendsList';
import Leaderboard from './components/Leaderboard';
import Profile from './components/Profile';

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

  const username = '@oinau'

  async function storage() {
    try {
      await aituBridge.storage.setItem('username', username);

    } catch (e) {
      // handle error
      console.log(e);
    }
  }

  useEffect(() => {
    if (aituBridge.isSupported()) {
      storage();
    }
  }, []);

  const [name, setName] = useState('');

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Switch>
              <Redirect exact path="/" to="/profile" />
              {/*
                Using the render method prop cuts down the number of renders your components will have due to route changes.
                Use the component prop when your component depends on the RouterComponentProps passed in automatically.
              */}
              <Route path="/games" exact={true} />
              <Route path="/leaderboard" render={() => <IonContent><Leaderboard /></IonContent>} exact={true} />
              <Route path="/profile" render={() => <IonContent><Profile /></IonContent>} exact={true} />
            </Switch>
          </IonRouterOutlet>  
        
          <IonTabBar slot="bottom">
            <IonTabButton tab="games" href="/games">
              <IonIcon icon={gameController} />
              <IonLabel>Игры</IonLabel>
            </IonTabButton>

            <IonTabButton tab="leaderboard" href="/leaderboard">
              <IonIcon icon={star} />
              <IonLabel>Рекорды</IonLabel>
            </IonTabButton>

            <IonTabButton tab="profile" href="/profile">
              <IonIcon icon={person} />
              <IonLabel>Профиль</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;