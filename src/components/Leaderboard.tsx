import { useEffect, useRef, useState } from "react";
import aituBridge from "@btsd/aitu-bridge";
import {
  IonLabel,
  IonList,
  IonItem,
  IonListHeader,
  IonToolbar,
  IonSearchbar,
  IonContent,
  IonHeader,
  IonTitle,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonRouterOutlet,
  IonRouterLink,
  IonTab,
  IonTabs
} from "@ionic/react";
import { Route, Redirect } from 'react-router';

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
import { IonReactRouter } from "@ionic/react-router";
import { Switch } from "react-router";
/* Theme variables */
// import "../theme/variables.css";

import LeaderboardAll from '../components/LeaderboardAll';
import LeaderboardFriends from '../components/LeaderboardFriends';

const Leaderboard: React.FC = () => {
    async function getContacts() {
        try {
          const data = await aituBridge.getContacts();

        } catch (e) {
          // handle error
          console.log(e);
        }
      }
    
    const [currentValue, setCurrentValue] = useState('все')

    useEffect(() => {
        if (aituBridge.isSupported()) {
        //   getContacts();
        setCurrentValue('все')
        }
      }, []);

    return(
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonSegment value={currentValue}>
                        <IonRouterLink onClick={() => setCurrentValue('все')}>
                            <IonSegmentButton value='все'>
                                <IonLabel>Все</IonLabel>
                            </IonSegmentButton>
                        </IonRouterLink>
                        <IonRouterLink onClick={() => setCurrentValue('друзья')}>
                            <IonSegmentButton value='друзья'>
                                <IonLabel>Друзья</IonLabel>
                            </IonSegmentButton>
                        </IonRouterLink>
                    </IonSegment>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                {currentValue === 'все' ? <LeaderboardAll /> : <LeaderboardFriends />}
            </IonContent>
        </IonPage>
    );
}

export default Leaderboard;