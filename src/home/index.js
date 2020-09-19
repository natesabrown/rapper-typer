import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useSelector } from 'react-redux';
import { isEmpty, isLoaded, useFirebase } from 'react-redux-firebase';
import GoogleButton from "react-google-button";

import logo from "./logo.svg";
import city1 from "./city1.svg";
import city2 from "./city2.svg";
import city3 from "./city3.svg";
import tprightdots from "./tprightdots.svg";
import btleftdots from "./btleftdots.svg";
import { GiExitDoor } from 'react-icons/gi';
import { FaPlus } from 'react-icons/fa';
import { FaGithub } from 'react-icons/fa';

import { JoinPrompt, CreatePrompt } from './prompts';

function Home() {
  const firebase = useFirebase();
  const profile = useSelector((state) => state.firebase.profile);
  const [signedIn, setSignedIn] = useState(false);
  const [messageShown, setMessageShown] = useState(false);

  const [joinShown, setJoinShown] = useState(false);
  const [createShown, setCreateShown] = useState(false);

  useEffect(() => {
    if (!isEmpty(profile)) {
      setSignedIn(true);
    }
  }, [profile]);

  useEffect(() => {
    setTimeout(() => {
      if (isEmpty(profile)) {
        setMessageShown(true);
      }
    }, 2000)
  }, [])

  const signOut = () => {
    firebase.logout().then(() => {
      setSignedIn(false);
    })
  }

  const signInWithFirebase = () => {
    firebase
      .login({
        provider: "google",
        type: "popup",
      })
      .then(() => {
        setSignedIn(true);
      })
  }

  return (
    <Container>
      <BackgroundContainer>
        <BackgroundImg src={city3} seconds={300} height={450} />
        <BackgroundImg src={city2} seconds={250} height={450} backwards />
        <BackgroundImg src={city1} seconds={200} height={350} />
      </BackgroundContainer>
      <BTLeftDots src={btleftdots} />
      <TPRightDots src={tprightdots} />
      <MainContent>
        <Logo src={logo}></Logo>
        <Buttons>
          <Button signedIn={signedIn} color={"green"} onClick={() => {
            signedIn && setJoinShown(true);
          }}><GiExitDoor/>Join</Button>
          <Button signedIn={signedIn} color={"red"} onClick={() => {
            signedIn && setCreateShown(true);
          }}><FaPlus/>Create</Button>
          {messageShown && !signedIn && <div style={{
            color: "white",
            fontSize: "20px",
            zIndex: "2",
            textAlign: "center",
            marginTop: "10px",
            fontWeight: "600"
          }}>
            Please sign in to play.
          </div>}
        </Buttons>
      </MainContent>
      <GitHubLink href="https://github.com/natesabrown/rapper-typer" target="_blank">
        <FaGithub />
      </GitHubLink>
      {!signedIn && <GoogleButton
            type="dark"
            onClick={signInWithFirebase}
            style={{
              position: "absolute",
              top: "10px",
              left: "10px"
            }}
          />
        }
      {signedIn && <LogOutButton onClick={signOut} style={{
        position: "absolute",
        top: "10px",
        left: "10px",
        zIndex: "2"
      }}>Log Out</LogOutButton>}
      {joinShown && <JoinPrompt setShown={setJoinShown}/>}
      {createShown && <CreatePrompt setShown={setCreateShown}/>}
    </Container>
  );
}

const LogOutButton = styled.div`
  color: blue;
  background-color: white;
  padding: 12px 20px;
  border: 3px solid blue;
  border-radius: 5px;

&:hover {
  cursor: pointer;
}
`

const GitHubLink = styled.a`
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: #555555;
  padding: 15px;
  border-radius: 10px;
  opacity: 0.75;

  svg {
    height: 80px;
    width: 80px;
  }

  &:hover {
    cursor: pointer;
    opacity: 1;
  }

  &:link, &:hover, &:active, &:visited {
    text-decoration: none;
    color: black;
  }
`

const Button = styled.div`
  padding: 30px;
  width: 150px;
  background-color: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  border: 4px solid white;
  border-radius: 20px;
  position: relative;
  box-shadow: 0px 10px 15px 1px rgba(0,0,0,0.3);
  ${props => !props.signedIn && `
    opacity: 0.5;
  `}

  svg {
    width: 50px;
    height: 50px;
    margin-right: 20px;
  }

  &:nth-child(2) {
    margin-top: 20px;
  }
  ${props => props.signedIn && `
  &:hover {
    cursor: pointer;
    animation: softbounce 0.5s infinite;
    box-shadow: 0px 10px 15px -9px rgba(0,0,0,0.3);
  }`}
`

const Buttons = styled.div`
  display: flex;
  flex-direction: column;
  color: white;
`

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const BTLeftDots = styled.img`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 300px;
`;

const TPRightDots = styled.img`
  position: fixed;
  top: 0;
  right: 0;
  height: 300px;
`;

const Container = styled.div`
  position: relative;
  background: orange;
  background: linear-gradient(
    45deg,
    rgba(131, 58, 180, 1) 0%,
    rgba(255, 0, 34, 1) 35%,
    rgba(252, 176, 69, 1) 100%
  );
  height: 100vh;
`;

const Logo = styled.img`
  max-width: 900px;
  display: block;
  transform: translateX(40px);
  animation: intro 0.6s ease-in;
  transform-origin: center center;
  width: 80vw;
  margin-top: 50px;

  @keyframes intro {
    0% {
      width: 0%;
      transform: rotate(0deg);
    }
    15% {
      transform: rotate(360deg);
    }
    30% {
      transform: rotate(720deg);
    }
    45% {
      transform: rotate(1080deg);
      width: 10%;
    }
    60% {
      transform: rotate(1440deg);
    }
    75% {
      transform: rotate(1800deg);
    }
    90% {
      transform: rotate(2160deg);
    }
    100% {
      transform: rotate(2520deg);
    }
  }
`;

const BackgroundContainer = styled.div`
  overflow: hidden;
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 100%;
`;

const BackgroundImg = styled.div`
  background: url("${(props) => props.src}") repeat-x;
  height: ${(props) => props.height}px;
  width: 15000px;
  animation: ${(props) => (props.backwards ? "reversedSlide" : "slide")}
    ${(props) => props.seconds}s linear infinite;
  background-size: contain;
  position: absolute;
  bottom: 0;

  @keyframes slide {
    0% {
      transform: translate3d(0, 0, 0);
    }
    100% {
      transform: translate3d(-5000px, 0, 0);
    }
  }

  @keyframes reversedSlide {
    0% {
      transform: translate3d(-10000px, 0, 0);
    }
    100% {
      transform: translate3d(-5000px, 0, 0);
    }
  }
`;

export default Home;
