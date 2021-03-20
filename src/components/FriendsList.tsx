import { useEffect, useRef, useState } from "react";
import aituBridge from "@btsd/aitu-bridge";
import {
  IonLabel,
  IonList,
  IonItem,
  IonListHeader,
} from "@ionic/react";

// import "./App.css";

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
// import "../theme/variables.css";

const FriendsList: React.FC = () => {

    const arr = [];

    async function getContacts() {
        try {
          const data = await aituBridge.getContacts();
          data.contacts.map(contact => arr.push(`${contact.first_name}\n`));
          arr.map(contact => setList(list => [...list, contact]));

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
    
    const [list, setList] = useState([])

    const listed = list.map(item => {
        return(
            <IonItem><IonLabel>{item}</IonLabel></IonItem>
        )
    })

    return(
        <IonList>
            <IonListHeader>
                <IonLabel>
                    Друзья в Oinow
                </IonLabel>
            </IonListHeader>
            {listed}
        </IonList>
    );
}

export default FriendsList;