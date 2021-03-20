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
  IonPopover
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
import { chevronForward, chevronForwardOutline, helpCircleOutline, peopleOutline, pricetagsOutline } from "ionicons/icons";
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

    return(
        <IonPage>
            <IonHeader>
                <IonToolbar><IonTitle>Мой аккаунт</IonTitle></IonToolbar>
            </IonHeader>
            <IonContent>
                {InfoField}
                <IonReactRouter>
                    <IonRouterOutlet>
                        <Route path="/profile/friendsList" component={FriendsList} exact={true} />
                        <Route path="/profile/store" render={() => <IonContent><FriendsList /></IonContent>} exact={true} />
                    </IonRouterOutlet>
                    <IonItemGroup>
                        <IonItemDivider style={divider_styles}>
                            <IonLabel></IonLabel>
                        </IonItemDivider>

                        <IonRouterLink routerLink='/profile/friendsList'>
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
            </IonContent>
        </IonPage>
    );
}

export default Profile;