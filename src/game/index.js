import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Keyboard from "./keyboard";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  isEmpty,
  isLoaded,
  useFirestore,
  useFirebase,
  useFirebaseConnect,
  useFirestoreConnect
} from "react-redux-firebase";
import { SignInPrompt, HelpPrompt } from "../home/prompts";
import logo from "../home/logo.svg";
import { FaRegQuestionCircle } from "react-icons/fa";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import city1 from './city.jpg';
import city2 from './city2.jpg';
import city3 from './city3.jpg';
import lefthand from "./lefthand.svg";
import righthand from "./righthand.svg";
import { IoIosHand } from "react-icons/io";
import hihat from "./hihat.svg";
import { MdNotInterested } from "react-icons/md";
import yourgoal from "./yourgoal.svg";
import leftbubble from "./leftbubble2.svg";
import rightbubble from "./rightbubble2.svg";
import bearhead from "../home/bearhead.svg";
import rabbithead from "../home/rabbithead.svg";
import TextInput, { ShowOtherInput } from './text-input';
import { FinishPrompt } from '../home/prompts';
import Insight from './insight';
import music from './hihat2.mp3'

function getRandomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function Game(props) {
  const gameID = props.match.params.gameID;
  const firestore = useFirestore();
  const firebase = useFirebase();
  const history = useHistory();
  const profile = useSelector((state) => state.firebase.profile);
  const [rapObj, setRapObj] = useState({});
  const [showSignIn, setShowSignIn] = useState(false);
  const [musicOff, setMusicOff] = useState(false);
  const [handsOff, setHandsOff] = useState(false);
  const [myTurn, setMyTurn] = useState(true);
  const [isBear, setIsBear] = useState(false);
  const [otherName, setOtherName] = useState("");
  const [wpmArr, setwpmArr] = useState([]);
  const [isDone, setIsDone] = useState(false);
  const [didWin, setDidWin] = useState();
  const [numErrors, setNumErrors] = useState(0);
  const [wrongLetters, setWrongLetters] = useState("");
  let [isPlayer1, setIsPlayer1] = useState(false);

  const [bgSrc, setbgSrc] = useState(getRandomFrom([city1,city2,city3]));

  useFirebaseConnect(gameID);
  useFirestoreConnect(`sessions/${gameID}`);
  const currentLine = useSelector(state => state.firebase.data[gameID] && state.firebase.data[gameID].currentLine);
  const currentTurn = useSelector(state => state.firebase.data[gameID] && state.firebase.data[gameID].currentTurn);
  const status = useSelector(
    (state) => state.firestore.data.sessions && state.firestore.data.sessions[gameID] && state.firestore.data.sessions[gameID].status
  );
  const soundRef = useRef(null);

  useEffect(() => {
    if (musicOff) {
      soundRef.current.muted = true;
    } else {
      soundRef.current.muted = false;
    }
  }, [musicOff])

  useEffect(() => {
    setSoundSpeed();
  }, [rapObj])

  const setSoundSpeed = () => {
    if (rapObj.turns) {
      soundRef.current.playbackRate = calculateSpeed();
    }
  }

  const calculateSpeed = () => {
    let wps = (profile.averageWPM + 5) / 60
    let wordCount = 0;
    let charCount = 0;

    console.log(`Words per second: ${wps}`);
    for (let turn of Object.values(rapObj.turns)) {
      for (let turney of turn) {
      console.log(`Turn: ${turney}`)
      for (let word of turney.split(" ")) {
        wordCount += 1;
        for (let char of word.split("")) {
          charCount += 1;
        }
      }
    }
    }
    console.log(`Char count: ${charCount}`);
    console.log(`Word count: ${wordCount}`);
    let charsPerWord = charCount / wordCount;
    let charsPerSecond = charsPerWord * wps;
    console.log(`Chars per second: ${charsPerSecond}`);
    return (charsPerSecond / 4);
  }

  useEffect(() => {
    setSoundSpeed();
    if (status == "FINISHED") {
      let update_obj = {};
      console.log(`Final is ${calcWPMAverage()} - ${numErrors}`)
      if (isPlayer1) {
        update_obj = {
          player1score: calcWPMAverage() - numErrors
        }
      } else {
        update_obj = {
          player2score: calcWPMAverage() - numErrors
        }
      }
      firestore.collection("sessions").doc(gameID).update(update_obj).then(() => {
        setTimeout(() => {
          firestore.collection("sessions").doc(gameID).get().then(doc => {
            const data = doc.data();
            const { player1score, player2score } = data;
            if (player1score > player2score) {
              if (isPlayer1) {
                setDidWin(true);
              } else {
                setDidWin(false);
              }
            } else {
              if (isPlayer1) {
                setDidWin(false);
              } else {
                setDidWin(true);
              }
            }
            setIsDone(true);
          })
        }, 1000)
      })
    }
  }, [status])

  const getName = () => {
    if (!isEmpty(profile)) {
      return convertName(profile.displayName);
    }
  };

  const convertName = (name) => {
    return name.split(" ")[0];
  };

  useEffect(() => {
    if (isEmpty(profile)) {
      setShowSignIn(true);
    } else {
      setShowSignIn(false);
      initiateGame();
    }
  }, [profile]);

  const getOtherPlayersName = (player1, player2) => {
    if (profile.uid == player1.uid) {
      console.log("set name 1");
      return player2.name;
    } else if (profile.uid == (player2 ? player2.uid : profile.uid)) {
      console.log("set name 2");
      return player1.name;
    }
  };

  useEffect(() => {
    if (isPlayer1) {
      setMyTurn(currentTurn % 2 == 0);
    } else {
      setMyTurn(currentTurn % 2 == 1);
    }
  }, [currentTurn]);

  const calcWPMAverage = () => {
    let total = 0;
    console.log(`I see wpm arr as ${wpmArr}`)
    for (let value of wpmArr) {
      total += value;
    }
    let avg = total / wpmArr.length;
    console.log(`We have determined a ${avg} wpm average for all the parts.`)
    return Math.round(avg);
  }

  // Ensures user is accessing a valid session, then gets the rap text for that session
  const initiateGame = async () => {
    firestore
      .collection("sessions")
      .doc(gameID)
      .get()
      .then((snapshot) => {
        let data = snapshot.data();
        let { player1 } = data;
        let { player2 } = data;
        let userIsPlayer =
          profile.uid == player1.uid || (player2 && profile.uid == player2.uid);

        if (!snapshot.exists) {
          history.push("/");
          return;
        } else if (snapshot.data().status != "WAITING" && !userIsPlayer) {
          history.push("/");
          return;
        }

        let player2choice = "";
        if (!userIsPlayer) {
          if (data.player1.animal == "bear") {
            player2choice = "rabbit";
          } else {
            player2choice = "bear";
          }
          firestore
            .collection("sessions")
            .doc(gameID)
            .update({
              player2: {
                animal: player2choice,
                uid: profile.uid,
                name: profile.displayName,
              },
              status: "ONGOING",
            })
            .then(() => {
              // find out which animal the user is
              console.log("User is player 2");
              setMyTurn(false);
              if (player2choice == "bear") {
                setIsBear(true);
              } else {
                setIsBear(false);
              }

              setOtherName(convertName(getOtherPlayersName(player1, player2)));
            });
        } else {
          // find out which animal the user is
          if (data.player1.uid == profile.uid) {
            setIsPlayer1(true);
            console.log("User is player 1");
            if (data.player1.animal == "bear") {
              setIsBear(true);
            } else {
              setIsBear(false);
            }
          } else if (data.player2.uid == profile.uid) {
            console.log("User is player 2");
            setMyTurn(false);
            if (data.player2.animal == "bear") {
              setIsBear(true);
            } else {
              setIsBear(false);
            }
          }

          setOtherName(convertName(getOtherPlayersName(player1, player2)));
        }

        let { songChoice } = data;

        firestore
          .collection("songs")
          .doc(songChoice) // todo: change
          .get()
          .then((doc) => {
            let data = doc.data();
            setRapObj(data);
            console.log(JSON.stringify(data.turns))
          });
      });
  };

  return (
    <MainContainer>
      <audio autoPlay loop ref={soundRef}>
        <source src={music}></source>
      </audio>
      <TopBar>
        <Logo src={logo} />
        <Question />
      </TopBar>
      <WPMGoal goal={profile.averageWPM + 5}>
        <PlayerDiv>
          {isBear ? (
            <AnimalImage
              src={bearhead}
              style={{ transform: "translateX(8px)" }}
            />
          ) : (
            <AnimalImage src={rabbithead} />
          )}
          <p>{getName()}</p>
        </PlayerDiv>
        <PlayerDiv right>
          {!isBear ? (
            <AnimalImage
              src={bearhead}
              style={{ transform: "translateX(8px)" }}
            />
          ) : (
            <AnimalImage src={rabbithead} />
          )}
          <p>{otherName}</p>
        </PlayerDiv>
      </WPMGoal>
      {/* TODO: Replace with something that check for all stuff then allows user to type */}
      {rapObj.turns && <MessageDiv>
        {myTurn ? <img src={leftbubble} /> : <img src={rightbubble} />}
        {myTurn && <TextInput onNextRow={() => {
          firebase.ref(gameID).update({currentLine: currentLine + 1});
        }} onDone={() => {
          if ((currentTurn + 1) != Object.keys(rapObj.turns).length) {
            setMyTurn(false);
            firebase.ref(gameID).update({currentLine: 0, currentTurn: currentTurn + 1});
          } else {
            console.log("Done")
            firestore.collection("sessions").doc(gameID).update({
              status: "FINISHED"
            })
          }
        }}
        turns={rapObj.turns}
        currentTurn={currentTurn}
        wpmArr={wpmArr}
        setwpmArr={setwpmArr}
        numErrors={numErrors}
        setNumErrors={setNumErrors}
        wrongLetters={wrongLetters}
        setWrongLetters={setWrongLetters}
        />}
        {!myTurn && <ShowOtherInput
          turns={rapObj.turns}
          currentTurn={currentTurn || '0'}
          currentLine={currentLine || 0}
        />}
      </MessageDiv>
      } 
      {showSignIn && <SignInPrompt />}
      {isDone && <FinishPrompt 
        wpm={calcWPMAverage()}
        errorNum={numErrors}
        winAnimal={didWin ? (isBear ? 'bear' : 'rabbit') : (isBear ? 'rabbit' : 'bear')}
        won={didWin}
      />}
      <Keyboard />
      {!handsOff && <Hand src={lefthand} />}
      {!handsOff && <Hand src={righthand} right />}
      <ButtonRow>
        <OnOffButton onClick={() => setMusicOff(!musicOff)}>
          <img src={hihat} />
          {musicOff && (
            <NoImage>
              <MdNotInterested />
            </NoImage>
          )}
        </OnOffButton>
        <OnOffButton
          onClick={() => setHandsOff(!handsOff)}
          style={{ marginLeft: "10px" }}
        >
          <IoIosHand />
          {handsOff && (
            <NoImage>
              <MdNotInterested />
            </NoImage>
          )}
        </OnOffButton>
      </ButtonRow>
      {!myTurn && (currentTurn != 0) && <Insight wpmarr={wpmArr} wrongLetters={wrongLetters} />}
      <BackgroundDiv>
        <LazyLoadImage
          effect="blur"
          src={bgSrc}
          height="100%"
          width="100%"
        />
      </BackgroundDiv>
    </MainContainer>
  );
}

const PlayerDiv = styled.div`
  position: absolute;
  ${(props) => (props.right ? "right: -300px" : "left: -300px")};
  display: flex;
  flex-direction: column;
  align-items: center;
  color: black;
  font-weight: 500;

  p {
    transform: translateY(-10px);
  }
`;

const AnimalImage = styled.img`
  height: 120px;
  width: 120px;
`;

const MessageDiv = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  position: relative;

  img {
    width: 800px;
    transform: translateY(-50px);
  }
`;

const NoImage = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  margin-top: 25px;
  margin-left: 25px;

  svg {
    fill: red;
  }
`;

const ButtonRow = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  padding: 12px;
  display: flex;
  flex-direction: row;
`;

const OnOffButton = styled.div`
  background-color: darkgray;
  opacity: 0.8;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border-radius: 12px;
  position: relative;
  user-select: none;

  svg,
  img {
    height: 90px;
    width: 90px;
  }

  &:hover {
    cursor: pointer;
    opacity: 1;
  }
`;

const Hand = styled.img`
  height: 50vh;
  position: fixed;
  bottom: 0;
  user-select: none;

  ${(props) =>
    props.right
      ? `
    right: 4%;
  `
      : `left: 4%;`}

  @media screen and (max-width: 1400px) {
    ${(props) =>
      props.right
        ? `
    right: 0;
  `
        : `left: 0`}
  }

  @media screen and (max-width: 1000px) {
    display: none;
  }
`;

const BackgroundDiv = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -2;
  filter: saturate(50%) brightness(110%);
`;

const Logo = styled.img`
  width: 230px;
  height: 150px;
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
`;

const MainContainer = styled.div`
  position: relative;
`;

function Question() {
  const [helpShown, setHelpShown] = useState(false);

  return (
    <div>
      <QMark title="need help?">
        <FaRegQuestionCircle onClick={() => setHelpShown(true)} />
      </QMark>
      {helpShown && <HelpPrompt setShown={setHelpShown} />}
    </div>
  );
}

const QMark = styled.div`
  background-color: white;
  border: 3px solid white;
  border-radius: 100px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    fill: blue;
    transform: rotate(12deg);
    height: 80px;
    width: 80px;

    &:hover {
      cursor: pointer;
    }
  }

  &:hover {
    animation: funnytilt 0.6s ease-in-out infinite;
  }
`;

function WPMGoal(props) {
  const goal = props.goal || "00";
  
  return (
    <WPMDiv>
      <Flesh>{goal}</Flesh>
      <WPMMessage>
        WPM
        <img src={yourgoal} />
      </WPMMessage>
      {props.children}
    </WPMDiv>
  );
}

const WPMMessage = styled.div`
  // color: white;
  font-weight: 600;
  font-size: 22px;
  position: relative;

  img {
    height: 100px;
    width: 120px;
    position: absolute;
    right: -130px;
    transform: rotate(6deg);
    top: -50px;
  }
`;

const Flesh = styled.div`
  background-color: darkgray;
  font-weight: 700;
  font-size: 60px;
  padding: 12px;
  border-radius: 10px;
  margin-top: 10px;
`;

const WPMDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
`;

export default Game;
