import React, { useState, useRef } from "react";
import styled from "styled-components";
import bearhead from "./bearhead.svg";
import rabbithead from "./rabbithead.svg";
import "./styles.css";
import { LoaderDots } from "@thumbtack/thumbprint-react";
import { BsBoxArrowRight } from 'react-icons/bs';
import { useFirestore, useFirebase } from 'react-redux-firebase';
import GoogleButton from "react-google-button";

const BEAR = 0;
const RABBIT = 1;

function CreatePrompt(props) {
  const { setShown } = props;
  const textAreaRef = useRef(null);
  const [choiceSelected, setChoiceSelected] = useState(false);
  const [hideInitial, setHideInitial] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const firestore = useFirestore();

  const handleChoice = (choice) => {
    setChoiceSelected(true);

    firestore.collection("sessions").add({
      status: "WAITING"
    }).then(docRef => {
      let sessionID = docRef.id;
      setAccessCode(sessionID);
    })

    setTimeout(() => {
      setHideInitial(true);
    }, 500);
  };

  const copyToClipboard = async () => {
    try {
      // CHANGE ME
      let url = `http://localhost:3000/game/${accessCode}`;
      await navigator.clipboard.writeText(url);
    } catch (err) {}
  };

  const handleExit = () => {
    setShown(false);
  };

  return (
    <FillContainer>
      <Prompt>
        <Content
          className={"fadein"}
          style={hideInitial ? {} : { display: "none" }}
        >
          <Message style={{ fontWeight: "600" }}>Your Access Code:</Message>
          <AccessCode>{accessCode}</AccessCode>
          <CopyButton onClick={copyToClipboard}>Copy Link</CopyButton>
          <LoaderDots size="medium" theme="inverse" />
          <div
            style={{
              color: "white",
              fontSize: "16px",
              fontWeight: "500",
              marginTop: "30px",
            }}
          >
            Waiting for opponent to join...
          </div>
        </Content>
        <Content
          className={choiceSelected ? "fadeout" : ""}
          style={hideInitial ? { display: "none" } : {}}
        >
          <Message>
            Choose <span style={{ fontWeight: "600" }}>Your</span> Rapper
          </Message>
          <div
            style={{
              width: "90%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
              marginTop: "40px",
            }}
          >
            <AnimalDiv onClick={() => handleChoice(BEAR)}>
              <Animal
                src={bearhead}
                style={{ transform: "translateX(10px)" }}
              />
              <div>Bear McCool</div>
            </AnimalDiv>
            <Divider />
            <AnimalDiv onClick={() => handleChoice(RABBIT)}>
              <Animal src={rabbithead} />
              <div>Rapper Rabbit</div>
            </AnimalDiv>
          </div>
        </Content>
        <XButton onClick={handleExit}>✕</XButton>
      </Prompt>
    </FillContainer>
  );
}

const CopyButton = styled.div`
  background-color: darkblue;
  width: 250px;
  height: 50px;
  border-radius: 12px;
  border: 3px solid white;
  color: white;
  font-weight: 600;
  font-size: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 5px;
  margin-bottom: 150px;
  transform: scale(0.8);

  &:hover {
    cursor: pointer;
  }
`;

const AccessCode = styled.div`
  background-color: white;
  width: 60%;
  height: 70px;
  margin-top: 10px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 25px;
`;

const Content = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const XBUTHGT = 50;

const XButton = styled.div`
  background-color: white;
  border: 2px solid blue;
  color: blue;
  width: ${XBUTHGT}px;
  height: ${XBUTHGT}px;
  border-radius: ${XBUTHGT}px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  font-weight: 700;
  position: absolute;
  top: -${XBUTHGT / 2}px;
  left: -20px;
  transition: transform 0.7s ease-in-out;

  &:hover {
    cursor: pointer;
    transform: rotate(360deg);
  }
`;

const AnimalDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: background-color 0.3s;

  div {
    color: white;
    font-size: 24px;
    font-weight: 500;
  }

  &:hover {
    background-color: #ffffff65;
    border-radius: 20px;
    cursor: pointer;
  }
`;

const Divider = styled.div`
  width: 20px;
  height: 100%;
  background-color: #ffffff75;
  border-radius: 15px;
`;

const Message = styled.div`
  color: white;
  font-size: 48px;
  font-weight: 400;
  margin-top: 40px;
`;

const ANIMAL_HGT = 200;

const Animal = styled.img`
  height: ${ANIMAL_HGT}px;
  width: ${ANIMAL_HGT}px;
`;

const Prompt = styled.div`
  background: rgb(31, 0, 193);
  background: linear-gradient(
    13deg,
    rgba(31, 0, 193, 1) 0%,
    rgba(69, 252, 240, 1) 100%
  );
  box-shadow: 0px 10px 15px 1px rgba(0, 0, 0, 0.4);
  width: 600px;
  height: 500px;
  border-radius: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const FillContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #22222250;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
`;

function JoinPrompt(props) {
  const { setShown } = props;
  const [code, setCode] = useState("");
  const [joinErr, setJoinErr] = useState(undefined);

  const handleClick = () => {

  }

  return (
    <FillContainer>
      <Prompt
        style={{
          background:
            "linear-gradient(354deg, rgba(3,149,20,1) 19%, rgba(53,249,102,1) 100%)",
        }}
      >
        <Message style={{ fontWeight: "600" }}>Enter Join Code:</Message>
        <CodeInput
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <JoinButton onClick={handleClick}><BsBoxArrowRight/>Join</JoinButton>
        {joinErr && <ErrMessage>{joinErr}</ErrMessage>}
        <XButton
          style={{ color: "green", borderColor: "green" }}
          onClick={() => setShown(false)}
        >
          ✕
        </XButton>
      </Prompt>
    </FillContainer>
  );
}

const ErrMessage = styled.div`
  color: white;
  font-size: 22px;
  font-weight: 500;
  margin-top: 50px;
`

const JoinButton = styled.div`
  width: 150px;
  height: 60px;
  margin-top: 30px;
  border-radius: 10px;
  color: white;
  background-color: darkgreen;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  font-weight: 500;
  border-bottom: 3px solid olivedrab;

  svg {
    height: 35px;
    width: 35px;
    margin-right: 5px;
  }
  &:hover {
    cursor: pointer;

    svg {
      animation: softbounce 0.5s ease-in-out infinite;
    }
  }
`

const CodeInput = styled.input`
  background-color: white;
  width: 60%;
  height: 70px;
  margin-top: 30px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 30px;
  box-sizing: border-box;
  text-align: center;
`;

function SignInPrompt() {
  const firebase = useFirebase();

  const signInWithFirebase = () => {
    firebase
      .login({
        provider: "google",
        type: "popup",
      })
      .then(() => {

      })
  }

  return (
    <FillContainer>
      <Prompt style={{justifyContent: "center"}}>
        <Message style={{fontSize: "40px", fontWeight: "500", marginBottom: "60px"}}>Please Sign In to Play!</Message>
        <GoogleButton type="light" onClick={signInWithFirebase} style={{transform: "scale(1.3)", marginBottom: "80px"}}/>
      </Prompt>
    </FillContainer>
  )
}

export { CreatePrompt, JoinPrompt, SignInPrompt };
