import { useEffect, useRef, useState } from "react";
import aituBridge from "@btsd/aitu-bridge";
import {
  IonLabel,
  IonToolbar,
  IonContent,
  IonHeader,
  IonPage,
  IonSegment,
  IonSegmentButton,
} from "@ionic/react";

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
            
            
        }
        // setCurrentValue('друзья')
        console.log('aaa')
      }, []);


    return(
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonSegment value={currentValue}>
                        <IonSegmentButton onClick={() => setCurrentValue('все')}  value='все'>
                            <IonLabel>Все</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton onClick={() => setCurrentValue('друзья')} value='друзья'>
                            <IonLabel>Друзья</IonLabel>
                        </IonSegmentButton>
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