import { useEffect, useRef, useState } from "react";
import aituBridge from "@btsd/aitu-bridge";
import {
  IonLabel,
  IonList,
  IonItem,
  IonToolbar,
  IonSearchbar,
  IonContent,
  IonHeader,
  IonTitle,
  IonPage,
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
import { chevronForwardOutline, helpCircleOutline, peopleOutline, pricetagsOutline, refresh } from "ionicons/icons";

const Profile: React.FC = () => {
    const [name, setName] = useState('<name>')
    const [photo, setPhoto] = useState('https://loremflickr.com/cache/resized/65535_50819271792_25b4393abc_320_240_nofilter.jpg')
    const [popoverState, setShowPopover] = useState({ showPopover: false, event: undefined });
    const [showModal1, setShowModal1] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
    const [list, setList] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [score, setScore] = useState(0);
    const [color, setColor] = useState('#fff');

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
                'margin': '20px',
                'width': '80px',
                'height': '80px',
                'border': '1px solid',
                'border-radius': '200px',
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
          
          const score_response = await aituBridge.storage.getItem('score');
          setScore(isNaN(+score_response) ? 0 : +score_response)

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
          const data = await aituBridge.share(`?????????????? ?????????????? ???????????? ?? ???????? ???? ?????? ?? ${await aituBridge.storage.getItem('username')}`);

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
            <img src={photo} style={card_styles(color)} />
            <IonLabel>
                <IonRow style={row_styles}>
                    <h2>{name}</h2>
                    <IonPopover
                        cssClass='my-custom-class'
                        event={popoverState.event}
                        isOpen={popoverState.showPopover}
                        onDidDismiss={() => setShowPopover({ showPopover: false, event: undefined })}
                    >
                        <p style={{'margin': '10px'}}>?????????? ???????????????????? ????????, ?????????????????????? ???????????? ?? ?????????????? ?? ???????????????????? ???????? ?? ??????????????????????????&#128516;<br></br> {'(???????? ???????????? ????????????????, ?? ?????????? ?????????????????? ?? ????????????????)'} </p>
                    </IonPopover>
                    <IonItem  lines='none'>
                        <IonBadge style={{'padding': '7px'}} color='warning'>{score}</IonBadge>
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
                    <IonButton slot='start' fill='clear' onClick={() => inviteFriend()}>????????????????????</IonButton>
                    <IonTitle>???????????? ?? oinau</IonTitle>
                    <IonButton slot='end' fill='clear' onClick={() => setShowModal1(false)}>??????????????</IonButton>
                </IonToolbar>
                <IonToolbar>
                    <IonSearchbar
                        value={searchText} 
                        onIonChange={e => setSearchText(e.detail.value!)} 
                        placeholder={'??????????'}>
                    </IonSearchbar>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                    <IonRefresherContent 
                    pullingText="???????????????? ?????????? ???????????????? ????????????"
                    refreshingSpinner="lines"
                    refreshingText="???????????????? ????????????..."
                    pullingIcon={refresh}>
                    </IonRefresherContent>
                </IonRefresher>
                <IonList>
                    {searchResults.map(item => {
                        return <IonItem><IonLabel>{item}</IonLabel><IonBadge style={{'padding': '7px'}} color='warning'>0</IonBadge></IonItem>
                    })}
                </IonList>
            </IonContent>
        </IonPage>
        </>
    )

    async function handleBuy() {
        const id = await aituBridge.storage.getItem('id')
        const response = await fetch(await aituBridge.storage.getItem('url') + '/rest/oinow/profile/shop/', {
            method: 'POST',
            body: 
                JSON.stringify({
                    'aituID': id,
                    'style': 1,
                    'price': 10
                })
        });

        setScore(score - 10);
        setColor('#0ff');
    }

    const Store = (
        <>
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonLabel>????????????:</IonLabel>
                    <IonBadge style={{'margin': '10px'}} color='warning'>{score}</IonBadge>
                    <IonTitle>??????????????</IonTitle>
                    <IonButton slot='end' fill='clear' onClick={() => setShowModal2(false)}>??????????????</IonButton>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                {/* <IonCard>
                    <IonCardHeader>
                        <IonCardTitle>Fire Red</IonCardTitle>
                    </IonCardHeader>
                    <IonRow>
                        <IonCardContent>
                            <IonCol>
                                <img src={photo} style={card_styles('red')}/>
                            </IonCol>
                            <IonCol>
                                <IonBadge style={{'padding': '10px'}} color='warning'>10</IonBadge>
                                <IonButton onClick={() => handleBuy()} style={{'margin-left': '20px'}} fill='outline' color='secondary'>????????????</IonButton>
                            </IonCol>
                        </IonCardContent>
                    </IonRow>
                </IonCard> */}
                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle>Neon Blue</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <IonCol>
                            <img src={photo} style={card_styles('#0ff')}/>
                        </IonCol>
                        <IonCol>
                            <IonBadge style={{'padding': '10px'}} color='warning'>10</IonBadge>
                            <IonButton onClick={() => handleBuy()} style={{'margin-left': '20px'}} fill='outline' color='secondary'>????????????</IonButton>
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
                <IonToolbar><IonTitle>?????? ??????????????</IonTitle></IonToolbar>
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
                                <h3>???????????? ????????????</h3>
                            </IonLabel>
                            <IonIcon icon={chevronForwardOutline}></IonIcon>
                        </IonItem>
                    </IonRouterLink>
                    
                    <IonRouterLink onClick={() => setShowModal2(true)}>
                        <IonItem>
                            <IonIcon style={icon_styles} color='success' icon={pricetagsOutline}></IonIcon>
                            <IonLabel>
                                <h3>??????????????</h3>
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