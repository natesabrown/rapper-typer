import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Keyboard from './keyboard';
import { useHistory } from "react-router-dom";
import { useSelector } from 'react-redux';
import { isEmpty, isLoaded, useFirestore, useFirebase } from 'react-redux-firebase';
import { SignInPrompt } from '../home/prompts';
import logo from '../home/logo.svg';
import { FaRegQuestionCircle } from 'react-icons/fa';

function Game(props) {
  const gameID = props.match.params.gameID;
  const firestore = useFirestore();
  const firebase = useFirebase();
  const history = useHistory();
  const profile = useSelector((state) => state.firebase.profile);
  const [rapObj, setRapObj] = useState({});
  const [showSignIn, setShowSignIn] = useState(false);

  useEffect(() => {
    if (isLoaded(profile) && isEmpty(profile)) {
      setShowSignIn(true);
    } else {
      setShowSignIn(false);
    }
  }, [profile]);


  // Ensures user is accessing a valid session, then gets the rap text for that session
  // useEffect(() => {
  //   firestore.collection('sessions').doc(gameID).get().then(snapshot => {
  //     if (!snapshot.exists) {
  //       history.push("/")
  //     } else {
  //       firestore.collection('songs').doc('example').get().then(doc => {
  //         let data = doc.data();
  //         console.log(data);
  //       })
  //     }
  //   })
  // }, []);

  return (
    <MainContainer>
      <TopBar>
        <Logo src={logo} />
        <WPMGoal />
        <Question />
      </TopBar>
      {showSignIn && <SignInPrompt />}
      <Keyboard />
    </MainContainer>
  )
}


const Logo = styled.img`
  width: 230px;
  height: 150px;
`

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
`

const MainContainer = styled.div`

`

function Question() {
  return (
    <QMark title="need help?">
      <FaRegQuestionCircle />
    </QMark>
  )
}

const QMark = styled.div`
  svg {
    fill: blue;
    transform: rotate(12deg);
    height: 80px;
    width: 80px;

    &:hover {
      cursor: pointer;
    }
  }
`

function WPMGoal() {
  return (
    <WPMDiv>
      <Flesh>

      </Flesh>
      <WPMMessage>
        WPM
      </WPMMessage>
    </WPMDiv>
  )
}

const WPMMessage = styled.div`

`

const Flesh = styled.div`

`

const WPMDiv = styled.div`

`

export default Game;