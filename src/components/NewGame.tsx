import { useState } from "react";
import aituBridge from "@btsd/aitu-bridge";
import {
    IonApp,
    IonRow,
    IonCol,
    IonButton,
    IonText,
    IonAlert,
    IonCard,
    IonInput,
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
import "../theme/variables.css";

import GamePlay from "./GamePlay";

function NewGame() {
    const [status, setStatus] = useState("Присоединитесь к игре, или же создайте новую ");
    const [invite, setInvite] = useState<string>("");
    const [invalidInviteAlert, showInvalidInviteAlert] = useState(false);
    const [showShare, setShowShare] = useState(false);
    const [showGame, setShowGame] = useState(false);
    const [userID, setUserID] = useState("");
    const [username, setUsername] = useState("");

    async function onRoomCreate() {
        const inviteCode = await createRoom();
        setInvite(inviteCode);
        setUserID(await getUserID());
        setUsername(await getUsername());
        setStatus("Ваш инвайт код " + inviteCode + ", разошлите его друзьям, и нажмите на Присоединиться");
        setShowShare(true);
    }


    function getRandomInt(max: number) {
        return Math.floor(Math.random() * Math.floor(max));
    }
    async function getUserID(): Promise<string> {
        const user = await aituBridge.getMe();
        return user.id;
        // return getRandomInt(42).toString();
    }

    async function getUsername(): Promise<string> {
        const user = await aituBridge.getMe();
        return user.name + " " + user.lastname;
        // return "User " + getRandomInt(42).toString()
    }

    async function createRoom(): Promise<string> {
        const resp = await fetch("https://tolego.rocks/rest/oinow/new_game/");
        let content: string = await resp.text();
        content = content.substring(1, content.length - 1)
        console.log(content);
        console.log(content[0]);
        return content;
    }

    async function onInviteShare() {
        await aituBridge.share("Хэй! Заходи в Clicker, инвайт код: " + invite);
    }

    if (!showGame) {
        return <IonApp>
            <IonRow />
            <IonRow>
                <IonCol className="ion-text-center">
                    <IonCard>
                        <IonText><h3>{status}</h3></IonText>
                        {showShare ?
                            <IonButton onClick={() => onInviteShare()}>Поделиться с друзьями</IonButton>
                            : null
                        }

                        {!showShare ?
                            <IonButton onClick={() => onRoomCreate()}>Создать комнату</IonButton>
                            : null
                        }

                        <IonInput
                            style={{'margin': '15px 0'}}
                            value={invite}
                            onIonChange={e => setInvite(e.detail.value!)}
                            placeholder="Инвайт код"
                            required={true}
                            disabled={showShare}
                        />
                        <IonButton
                            onClick={async (e) => {
                                setUserID(await getUserID());
                                setUsername(await getUsername());
                                setShowGame(true);
                            }}
                        >Присоединиться к комнате</IonButton>
                    </IonCard>
                </IonCol>
                <IonAlert
                    isOpen={invalidInviteAlert}
                    header={"Упс!"}
                    message={"Введенный инвайт не валиден"}
                    buttons={["OK"]}
                    onDidDismiss={() => { showInvalidInviteAlert(false); setInvite(""); }}
                />
            </IonRow>
            <IonRow />
        </IonApp >
    } else {
        return <GamePlay userID={userID} username={username} gameID={invite} isAdmin={showShare} />;
    }
}

export default NewGame