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
  IonAvatar,
  IonBadge,
  IonRow,
  IonCol,
  IonItemDivider,
  IonItemGroup,
  IonIcon,
  IonPopover,
  IonModal,
  IonButton,
  IonRefresher,
  IonRefresherContent
} from "@ionic/react";
import { Route, Redirect } from 'react-router';
import { RefresherEventDetail } from '@ionic/core';

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
import { chevronForward, chevronForwardOutline, helpCircleOutline, peopleOutline, pricetagsOutline, refresh } from "ionicons/icons";
import { NONAME } from "node:dns";
import FriendsList from "./FriendsList";

/* Theme variables */
// import "../theme/variables.css";

const Profile: React.FC = () => {
    async function getMe() {
        try {
          const data = await aituBridge.getMe();
          setName(data.name + ' ' + data.lastname)
          setPhoto(data.avatar)
        } catch (e) {
          // handle error
          console.log(e);
        }
      }
    
    useEffect(() => {
        if (aituBridge.isSupported()) {
          getMe();
        }
      }, []);

    const [name, setName] = useState('<name>')
    const [photo, setPhoto] = useState('')
    const [popoverState, setShowPopover] = useState({ showPopover: false, event: undefined });
    const [showModal, setShowModal] = useState(false);

    const togglePopover = (e:any) => {
        e.persist();
        setShowPopover({ showPopover: true, event: e })
        console.log('click')
    }

    const row_styles = {
        'justify-content': 'space-between',
        'padding': '10px 0',
        'align-items': 'center'
    }

    const divider_styles = {
        'background-color': '#f7f7f8',
    }

    const icon_styles = {
        'margin-right': '15px',
    }

    const InfoField = (
        <>
        <IonItem lines='none' style={{'border-bottom': 'none'}}>
            <IonAvatar slot='start'><img src={photo} /></IonAvatar>
            <IonLabel>
                <IonRow style={row_styles}>
                    <h2>{name}</h2>
                    <IonPopover
                        cssClass='my-custom-class'
                        event={popoverState.event}
                        isOpen={popoverState.showPopover}
                        onDidDismiss={() => setShowPopover({ showPopover: false, event: undefined })}
                    >
                        <p style={{'margin': '10px'}}>Чтобы заработать очки, приглашайте друзей и близких в совместные игры и развлекайтесь&#128516;<br></br> {'(Очки нельзя потерять, и можно потратить в магазине)'} </p>
                    </IonPopover>
                    <IonItem  lines='none'>
                        <IonBadge style={{'padding': '7px'}} color='warning'>1320</IonBadge>
                        <IonIcon style={{'margin-left': '5px'}} onClick={(e:any) => togglePopover(e)} icon={helpCircleOutline}></IonIcon>
                    </IonItem>
                </IonRow>
            </IonLabel>
        </IonItem>
        </>
    )

    const arr = [];

    async function getContacts() {
        try {
          const data = await aituBridge.getContacts();
          data.contacts.map(contact => arr.push(`${contact.first_name}` + `${contact.last_name ? contact.last_name : ''}\n`));
          arr.map(contact => setList(list => [...list, contact]));
          arr.length = 0;
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

    function doRefresh(event: CustomEvent<RefresherEventDetail>) {      
        setTimeout(async () => {
            const data = await aituBridge.getContacts();
            data.contacts.map(contact => arr.push(`${contact.first_name}` + `${contact.last_name ? contact.last_name : ''}\n`));
            setList([])
            arr.map(contact => setList(list => [...list, contact]));
            event.detail.complete();
        }, 1000);
    }

    const FriendsList = (
        <>
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Друзья в oinau</IonTitle>
                    <IonButton slot='end' fill='clear' onClick={() => setShowModal(false)}>Закрыть</IonButton>
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
                <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                    <IonRefresherContent 
                    pullingText="Потяните чтобы обновить список"
                    refreshingSpinner="lines"
                    refreshingText="Обновляю список..."
                    pullingIcon={refresh}>
                    </IonRefresherContent>
                </IonRefresher>
                <IonList>
                    {searchResults.map(item => {
                        return <IonItem><IonLabel>{item}</IonLabel></IonItem>
                    })}
                </IonList>
            </IonContent>
        </IonPage>
        </>
    )

    return(
        <IonPage>
            <IonHeader>
                <IonToolbar><IonTitle>Мой аккаунт</IonTitle></IonToolbar>
            </IonHeader>
            <IonContent>
                {InfoField}
                <IonReactRouter>
                    <IonRouterOutlet>
                            {/* <Route path="/profile/friendsList" ={FriendsList} exact={true} />
                            <Route path="/profile/store" render={() => <IonContent><FriendsList /></IonContent>} exact={true} /> */}
                    </IonRouterOutlet>
                    <IonItemGroup>
                        <IonItemDivider style={divider_styles}>
                            <IonLabel></IonLabel>
                        </IonItemDivider>

                        <IonRouterLink onClick={() => setShowModal(true)}>
                            <IonItem>
                                <IonIcon style={icon_styles} color='success' icon={peopleOutline}></IonIcon>
                                <IonLabel>
                                    <h3>Список друзей</h3>
                                </IonLabel>
                                <IonIcon icon={chevronForwardOutline}></IonIcon>
                            </IonItem>
                        </IonRouterLink>
                        
                        <IonRouterLink routerLink='/profile/store'>
                            <IonItem>
                                <IonIcon style={icon_styles} color='success' icon={pricetagsOutline}></IonIcon>
                                <IonLabel>
                                    <h3>Магазин</h3>
                                </IonLabel>
                                <IonIcon icon={chevronForwardOutline}></IonIcon>
                            </IonItem>
                        </IonRouterLink>

                        <IonItemDivider style={divider_styles}>
                            <IonLabel></IonLabel>
                        </IonItemDivider>
                    </IonItemGroup>
                </IonReactRouter>
                <IonModal isOpen={showModal} cssClass='my-custom-class'>
                    {FriendsList}
                </IonModal>
            </IonContent>
        </IonPage>
    );
}

export default Profile;