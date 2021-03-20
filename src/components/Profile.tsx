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
  IonRefresherContent,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle
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
    const [name, setName] = useState('<name>')
    const [photo, setPhoto] = useState('')
    const [popoverState, setShowPopover] = useState({ showPopover: false, event: undefined });
    const [showModal1, setShowModal1] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
    const [list, setList] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([])

    const arr = [];

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

    const card_styles = (color) => {
        return(
            {
                'border': '1px solid',
                'border-radius': '100px',
                'background-color': '#fff',
                'box-shadow': `0px 0px 20px 10px ${color}`,
            }
        )
    }

    const togglePopover = (e:any) => {
        e.persist();
        setShowPopover({ showPopover: true, event: e });
    }

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

    useEffect(() => {
        if (aituBridge.isSupported()) {
          getContacts();
        }
      }, []);

    useEffect(() => {
        setSearchResults(list);
    }, [list])

    useEffect(() => {
        const result = list.filter(item => item.toLowerCase().includes(searchText.toLowerCase()));
        setSearchResults(result)
    }, [searchText])

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
    
    async function inviteFriend() {
        try {
          const data = await aituBridge.share(`Поехали сыграем вместе в одну из игр в ${await aituBridge.storage.getItem('username')}`);

        } catch (e) {
          // handle error
          console.log(e);
        }
    }

    function doRefresh(event: CustomEvent<RefresherEventDetail>) {      
        setTimeout(async () => {
            const data = await aituBridge.getContacts();
            data.contacts.map(contact => arr.push(`${contact.first_name}` + ' ' + `${contact.last_name ? contact.last_name : ''}\n`));
            setList([])
            arr.map(contact => setList(list => [...list, contact]));
            event.detail.complete();
        }, 1000);
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

    const FriendsList = (
        <>
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButton slot='start' fill='clear' onClick={() => inviteFriend()}>Пригласить</IonButton>
                    <IonTitle>Друзья в oinau</IonTitle>
                    <IonButton slot='end' fill='clear' onClick={() => setShowModal1(false)}>Закрыть</IonButton>
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
                        return <IonItem><IonLabel>{item}</IonLabel><IonBadge style={{'padding': '7px'}} color='warning'>1320</IonBadge></IonItem>
                    })}
                </IonList>
            </IonContent>
        </IonPage>
        </>
    )

    const Store = (
        <>
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonLabel>Баланс:</IonLabel>
                    <IonBadge style={{'margin': '10px'}} color='warning'>1320</IonBadge>
                    <IonTitle>Магазин</IonTitle>
                    <IonButton slot='end' fill='clear' onClick={() => setShowModal2(false)}>Закрыть</IonButton>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle>штучка 1</IonCardTitle>
                    </IonCardHeader>
                    <IonRow>
                        <IonCardContent>
                            <IonCol>
                                <img src={photo} style={card_styles('red')}/>
                            </IonCol>
                            <IonCol>
                                <IonBadge style={{'padding': '10px'}} color='warning'>10</IonBadge>
                                <IonButton fill='outline' color='secondary'>купить</IonButton>
                            </IonCol>
                        </IonCardContent>
                    </IonRow>
                </IonCard>
                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle>штучка 2</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <IonCol>
                            <img src={photo} style={card_styles('#0ff')}/>
                        </IonCol>
                        <IonCol>
                            <IonBadge style={{'padding': '10px'}} color='warning'>10</IonBadge>
                            <IonButton fill='outline' color='secondary'>купить</IonButton>
                        </IonCol>
                    </IonCardContent>
                </IonCard>
                
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
                <IonItemGroup>
                    <IonItemDivider style={divider_styles}>
                        <IonLabel></IonLabel>
                    </IonItemDivider>

                    <IonRouterLink onClick={() => setShowModal1(true)}>
                        <IonItem style={{'padding': '10px 0'}}>
                            <IonIcon style={icon_styles} color='success' icon={peopleOutline}></IonIcon>
                            <IonLabel>
                                <h3>Список друзей</h3>
                            </IonLabel>
                            <IonIcon icon={chevronForwardOutline}></IonIcon>
                        </IonItem>
                    </IonRouterLink>
                    
                    <IonRouterLink onClick={() => setShowModal2(true)}>
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
                <IonModal isOpen={showModal1} cssClass='my-custom-class'>
                    {FriendsList}
                </IonModal>
                <IonModal isOpen={showModal2} cssClass='my-custom-class'>
                    {Store}
                </IonModal>
            </IonContent>
        </IonPage>
    );
}

export default Profile;