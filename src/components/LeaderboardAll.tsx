import { useEffect, useRef, useState } from "react";
import aituBridge from "@btsd/aitu-bridge";
import {
  IonLabel,
  IonList,
  IonItem,
  IonListHeader,
  IonContent,
  IonTitle,
  IonPage,
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
import { request } from "node:https";

/* Theme variables */

const LeaderboardAll: React.FC = () => {

    const [arr, setArr] = useState([])


    async function request() {
        try {
          const url = await aituBridge.storage.getItem('url');

          const response = await fetch(url + '/rest/oinow/leaderboard/')
          const data = await response.json()

          data.map(item => setArr(arr => [...arr, item]))

        } catch (e) {
          // handle error
          console.log(e);
        }
      }
    
    useEffect(() => {
        if (aituBridge.isSupported()) {
          request();
        }
      }, []);


    return(
        <IonPage>
            <IonContent>
                <IonList>
                    <IonListHeader><IonTitle>Общий рейтинг</IonTitle></IonListHeader>
                    {arr.map(item => <IonItem><IonLabel>{item.name}: {item.score}</IonLabel></IonItem>)}
                </IonList>
            </IonContent>
        </IonPage>
    );
}

export default LeaderboardAll;