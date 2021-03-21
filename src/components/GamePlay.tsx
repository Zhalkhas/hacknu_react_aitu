import { useEffect, useRef, useState } from "react";
import {
  IonTitle,
  IonApp,
  IonRow,
  IonContent,
  IonButton,
  IonAlert,
  IonList,
  IonItem,
  IonFooter,
  IonToolbar,
  IonGrid,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
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
import "../theme/variables.css";

interface GamePlayProps {
  isAdmin: boolean,
  username: string,
  userID: string,
  gameID: string,
}

const gameName = "clicker";

function GamePlay(props: GamePlayProps) {
  const socket = useRef(new WebSocket("wss://tolego.rocks/ws"));

  const [state, setGameState] = useState<Array<any>>([]);
  const [showNotEnoughUsersAlert, setShowNotEnoughUsersAlert] = useState<boolean>(false);
  const [showWinnerAlert, setShowWinnerAlert] = useState<boolean>(false);
  const [lobby, setLobby] = useState<boolean>(true);
  const [users, setUsers] = useState<Array<string>>([]);

  useEffect(() => {
    socket.current.onmessage = (msg) => {
      if (!showWinnerAlert) {
        console.log("new msg");
        const payload = JSON.parse(msg.data);
        const cmd = payload.cmd;
        console.log(payload);
        switch (cmd) {
          case "update":
            if (payload.data.state.findIndex((el: any) => el.score > 50) != -1) {
              setShowWinnerAlert(true);
            } else {
              setGameState(() => payload.data.state);
            }
            break;
          case "new_user":
            console.log("new user");
            setUsers((users) => payload.data.users);
            break;
          case "start":
            setLobby((lobby) => false);
            setGameState(() => payload.data.state);
            break;
          default:
            console.log("invalid command " + cmd);
        }
      }
    };
    socket.current.onopen = () => {
      console.log("Websocket started");
      socket.current.send(JSON.stringify({ cmd: "connect", data: { "username": props.username }, id: props.gameID }));
      console.log("sent connect to server");
    };

    return () => {
      //eslint-disable-next-line
      socket.current.close();
    };
  }, []);

  function startGame() {
    if (users.length == 1) {
      setShowNotEnoughUsersAlert(true);
    }
    if (props.isAdmin) {
      const payload = JSON.stringify({
        id: props.gameID,
        cmd: "start",
        data: { state: users.map((e) => { return { username: e, score: 0 }; }) },
      })
      socket.current.send(payload);
    }
  }

  function onInGameTap() {
    const idx = state.findIndex((e: any) => e.username == props.username);
    state[idx].score++;
    const payload = JSON.stringify({ id: props.gameID, data: { state: state }, cmd: "update" });
    socket.current.send(payload);
  }

  function getScores() {
    return state.find((e) => e.username == props.username).score;
  }

  function onGameFinish() {
    setShowWinnerAlert(false)
    const score = getScores();
    console.log("final score " + score);
    fetch("/rest/oinow/profile/results/",
      {
        method: "POST", body: JSON.stringify({
          user: props.userID,
          game_name: gameName,
          score: score
        }),
      }
    ).then(() => {
      window.location.reload();
    });
  }


  function getWinner(): string {
    if (state.length > 0) {
      let max = state[0];
      state.forEach((el) => {
        if (max.score < el.score) {
          max = el;
        }
      });
      return max.username;
    } else {
      return "";
    }
  }

  if (lobby) {
    return <IonApp>
      <IonContent>
        <IonTitle >Игроки в игре</IonTitle>

        <IonList>
          {users.map((username, index) => <div><IonItem key={index}>{username}</IonItem></div>)}
        </IonList>

      </IonContent>

      <IonFooter mode="md">
        <IonToolbar>
          <IonButton disabled={!props.isAdmin} onClick={() => startGame()} expand={"full"}>{props.isAdmin ? 'Начать игру' : 'Ждем остальных...'}</IonButton>
        </IonToolbar>
      </IonFooter>

      <IonAlert isOpen={showNotEnoughUsersAlert} header={"Прастити ;("} message={'Вы не можете играть один, позовите своих друзей'} buttons={["OK"]} onDidDismiss={() => setShowNotEnoughUsersAlert(false)} />

    </IonApp>;
  } else {
    const gridWidth = Math.sqrt(state.length);
    const stateMat = listToMatrix(state, gridWidth);

    return <IonApp>
      <IonGrid>{
        stateMat.map((row) =>
          <IonRow>
            {
              row.map((el) =>
                <IonCard>
                  <IonCardHeader>
                    <IonCardTitle>
                      {el.username}
                    </IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    {el.score}
                  </IonCardContent>
                </IonCard>
              )
            }
          </IonRow>)
      }</IonGrid>
      <IonButton onClick={() => onInGameTap()}>TAAAAAAAAAAAAAAAAAAP</IonButton>
      <IonAlert isOpen={showWinnerAlert} header={"УРА!"} message={"И победителем в этой потной схватке вышел " + getWinner()} onDidDismiss={() => onGameFinish()} buttons={["ОК"]}></IonAlert>
    </IonApp>;
  }
}

function listToMatrix(list: Array<any>, elementsPerSubArray: number): Array<Array<any>> {
  let matrix = new Array<Array<any>>(), i, k;

  for (i = 0, k = -1; i < list.length; i++) {
    if (i % elementsPerSubArray === 0) {
      k++;
      matrix[k] = [];
    }

    matrix[k].push(list[i]);
  }

  return matrix;
}

export default GamePlay;