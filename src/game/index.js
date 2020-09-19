import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Keyboard from "./keyboard";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  isEmpty,
  isLoaded,
  useFirestore,
  useFirebase,
} from "react-redux-firebase";
import { SignInPrompt, HelpPrompt } from "../home/prompts";
import logo from "../home/logo.svg";
import { FaRegQuestionCircle } from "react-icons/fa";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import curtain from "./curtain_medium.jpg";
import lefthand from './lefthand.svg';
import righthand from './righthand.svg';
import { IoIosHand } from 'react-icons/io';
import hihat from './hihat.svg';
import { MdNotInterested } from 'react-icons/md';
import yourgoal from './yourgoal.svg';

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

  useEffect(() => {
    if (isEmpty(profile)) {
      setShowSignIn(true);
    } else {
      setShowSignIn(false);
      initiateGame();
    }
  }, [profile]);

  // Ensures user is accessing a valid session, then gets the rap text for that session
  const initiateGame = () => {
    firestore.collection('sessions').doc(gameID).get().then(snapshot => {
      let data = snapshot.data();
      let { player1 } = data;
      let { player2 } = data;
      let userIsPlayer = (profile.uid == player1.uid) || (player2 && (profile.uid == player2.uid));

      if (!snapshot.exists) {
        history.push("/");
        return;
      } else if ((snapshot.data().status != "WAITING") && !userIsPlayer) {
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
        firestore.collection('sessions').doc(gameID).update({
          player2: {
            animal: player2choice,
            uid: profile.uid
          },
          status: "ONGOING"
        })
      } 

      firestore.collection('songs').doc('example').get().then(doc => {
        let data = doc.data();
        setRapObj(data);
      })
    })
  }

  return (
    <MainContainer>
      <TopBar>
        <Logo src={logo} />
        <Question />
      </TopBar>
      <WPMGoal />
      {showSignIn && <SignInPrompt />}
      <Keyboard />
      {!handsOff && 
      <Hand src={lefthand}/>
      }
      {!handsOff && 
      <Hand src={righthand} right/>
      }
      <ButtonRow>
        <OnOffButton onClick={() => setMusicOff(!musicOff)}><img src={hihat}/>
          {musicOff && <NoImage><MdNotInterested /></NoImage>}
        </OnOffButton>
        <OnOffButton onClick={() => setHandsOff(!handsOff)} style={{marginLeft: "10px"}}><IoIosHand />
          {handsOff && <NoImage><MdNotInterested /></NoImage>}
        </OnOffButton>
      </ButtonRow>
      {/* <BackgroundDiv>
        <LazyLoadImage
          effect="blur"
          src={curtain}
          height="100%"
          width="100%"
        />
      </BackgroundDiv> */}
    </MainContainer>
  );
}

const NoImage = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  margin-top: 25px;
  margin-left: 25px;

  svg {
    fill: red;
  }
`

const ButtonRow = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  padding: 12px;
  display: flex;
  flex-direction: row;
`

const OnOffButton = styled.div`
  background-color: darkgray;
  opacity: 0.8;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border-radius: 12px;
  position: relative;

  svg, img {
    height: 90px;
    width: 90px;
  }

  &:hover {
    cursor: pointer;
    opacity: 1.0;
  }
`

const Hand = styled.img`
  height: 50vh;
  position: fixed;
  bottom: 0;

  ${props => props.right ? `
    right: 4%;
  ` : `left: 4%`}

  @media screen and (max-width: 1400px) {
    ${props => props.right ? `
    right: 0;
  ` : `left: 0`}
  }

  @media screen and (max-width: 1000px) {
    display: none;
  }
`

const BackgroundDiv = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -2;
  filter: saturate(50%) brightness(180%);
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
      <FaRegQuestionCircle onClick={() => setHelpShown(true)}/>
    </QMark>
    {helpShown && <HelpPrompt setShown={setHelpShown}/>}
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

function WPMGoal() {
  return (
    <WPMDiv>
      <Flesh>68</Flesh>
      <WPMMessage>WPM<img src={yourgoal} /></WPMMessage>
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
