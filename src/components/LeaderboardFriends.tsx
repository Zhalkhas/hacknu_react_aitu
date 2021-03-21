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

/* Theme variables */

const LeaderboardFriends: React.FC = () => {
    const [arr, setArr] = useState([])

    async function getContacts() {
        try {
          const contacts = await aituBridge.getContacts();
          const url = await aituBridge.storage.getItem('url');
          const cnt = contacts.contacts

          const response = await fetch(url + '/rest/oinow/friends/', {
              method: 'POST',
              body: JSON.stringify(cnt)
          });

          const data = await response.json();

          data.map(item => setArr(arr => [...arr, item]))

        } catch (e) {
          // handle error
          console.log(e);
        }
    }
    
    useEffect(() => {
        if (aituBridge.isSupported()) {
          getContacts();
        }
      }, []);

    return(
        <IonPage>
            <IonContent>
                <IonList>
                    <IonListHeader><IonTitle>Рейтинг друзей</IonTitle></IonListHeader>
                    {arr.map(item => <IonItem><IonLabel>{item.name}: {item.score}</IonLabel></IonItem>)}
                </IonList>
            </IonContent>
        </IonPage>
    );
}

export default LeaderboardFriends;