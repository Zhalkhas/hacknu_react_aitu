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
  IonPage
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
          data.contacts.map(contact => arr.push(`${contact.first_name}` + `${contact.last_name ? contact.last_name : ''}\n`));
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
    
    const [list, setList] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([])

    useEffect(() => {
        setSearchResults(list);
    }, [list])

    useEffect(() => {
        const result = list.filter(item => item.toLowerCase().includes(searchText.toLowerCase()));
        setSearchResults(result)
    }, [searchText])

    return(
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Друзья в Oinow</IonTitle>
                </IonToolbar>
                <IonToolbar>
                    <IonSearchbar 
                        value={searchText} 
                        onIonChange={e => setSearchText(e.detail.value!)} 
                        placeholder={'Поиск'}>
                    </IonSearchbar>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonList>
                    <IonListHeader>
                        <IonLabel>
                            Друзья в Oinow
                        </IonLabel>
                    </IonListHeader>
                    {searchResults.map(item => {
                        return <IonItem><IonLabel>{item}</IonLabel></IonItem>
                    })}
                </IonList>
            </IonContent>
        </IonPage>
    );
}

export default FriendsList;