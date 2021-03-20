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
    
    useEffect(() => {
        if (aituBridge.isSupported()) {
        //   getContacts();
        }
      }, []);

      const [currentValue, setCurrentValue] = useState('все')

    return(
        <IonPage>
            <IonReactRouter>
                <IonRouterOutlet>
                <Switch>
                    {/* <Redirect exact path="/leaderboard" to="/leaderboard/" /> */}
                    <Route path="/leaderboard/all" component={LeaderboardAll} render={() => <IonContent><LeaderboardAll /></IonContent>} exact={true} />
                    <Route path="/leaderboard/friends" render={() => <IonContent><LeaderboardFriends /></IonContent>} exact={true} />
                </Switch>
                </IonRouterOutlet>
                <IonHeader>
                    <IonToolbar>
                        <IonSegment value={currentValue}>
                            <IonRouterLink onClick={() => setCurrentValue('все')} routerLink='/leaderboard/all'>
                                <IonSegmentButton value='все'>
                                    <IonLabel>Все</IonLabel>
                                </IonSegmentButton>
                            </IonRouterLink>
                            <IonRouterLink onClick={() => setCurrentValue('друзья')} routerLink='/leaderboard/friends'>
                                <IonSegmentButton value='друзья'>
                                    <IonLabel>Друзья</IonLabel>
                                </IonSegmentButton>
                            </IonRouterLink>
                        </IonSegment>
                    </IonToolbar>
                </IonHeader>
            </IonReactRouter>
        </IonPage>
    );
}

export default Leaderboard;