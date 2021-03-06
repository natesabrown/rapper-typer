import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import bearhead from "./bearhead.svg";
import rabbithead from "./rabbithead.svg";
import "./styles.css";
import { LoaderDots } from "@thumbtack/thumbprint-react";
import { BsBoxArrowRight } from "react-icons/bs";
import { useFirestore, useFirebase, useFirestoreConnect } from "react-redux-firebase";
import GoogleButton from "react-google-button";
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { isEmpty } from 'react-redux-firebase';
import { FaRegCheckCircle } from 'react-icons/fa';

const BEAR = 0;
const RABBIT = 1;

function getRandomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function CreatePrompt(props) {
  const { setShown } = props;
  const textAreaRef = useRef(null);
  const [choiceSelected, setChoiceSelected] = useState(false);
  const [hideInitial, setHideInitial] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const firestore = useFirestore();
  const firebase = useFirebase();
  const profile = useSelector((state) => state.firebase.profile);
  const history = useHistory();

  const watchForStatus = (code) => {
    console.log(`Access code is ${code}`)
    firestore.collection("sessions").doc(code).onSnapshot(doc => {
      console.log("Snapshotted!")
      let data = doc.data();
      let status = data.status;
      if (status == 'ONGOING') {
        history.push(`/game/${code}`);
      }
    })
  }

  const handleChoice = (choice) => {
    setChoiceSelected(true);

    const creatureChoice = choice == BEAR ? "bear" : "rabbit";

    firestore
      .collection("sessions")
      .add(Object.assign({
        status: "WAITING",
        songChoice: getRandomFrom(["example", "song1", "dummy"]),
        turn: 1
      }, {player1: {
        animal: creatureChoice,
        uid: profile.uid,
        name: profile.displayName
      }}))
      .then((docRef) => {
        let sessionID = docRef.id;
        setAccessCode(sessionID);
        watchForStatus(docRef.id);
        firebase.ref(docRef.id).set({
          currentLine: 0,
          currentTurn: 0
        })
      });

    setTimeout(() => {
      setHideInitial(true);
    }, 500);
  };

  const copyToClipboard = async () => {
    try {
      // CHANGE ME
      let url = `https://hungry-albattani-7f8050.netlify.app/game/${accessCode}`;
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
          <CopyButton onClick={copyToClipboard}>Copy URL</CopyButton>
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
  const firestore = useFirestore();
  const [code, setCode] = useState("");
  const [joinErr, setJoinErr] = useState(undefined);
  const profile = useSelector((state) => state.firebase.profile);
  const history = useHistory();

  const handleClick = () => {
    firestore.collection('sessions').doc(code).get().then(snapshot => {
      if (!snapshot.exists) {
        setJoinErr("Game doesn't exist; please check that you have the correct code.")
        return;
      }

      let data = snapshot.data();
      let { player1 } = data;
      let { player2 } = data;
      let userIsPlayer = (profile.uid == player1.uid) || (player2 && (profile.uid == player2.uid));

        if (userIsPlayer) {
        history.push(`/game/${code}`);
        return;
      } else if (!userIsPlayer && data.status == 'WAITING') {
        history.push(`/game/${code}`);
        return;
      } else {
        setJoinErr("Game is being played by other people.")
      }
    });
  };

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
        <JoinButton onClick={handleClick}>
          <BsBoxArrowRight />
          Join
        </JoinButton>
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
  text-align: center;
`;

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
`;

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
      .then(() => {});
  };

  return (
    <FillContainer>
      <Prompt
        style={{
          justifyContent: "center",
          background:
            "linear-gradient(23deg, rgba(205,0,255,1) 0%, rgba(255,0,0,1) 47%, rgba(249,155,53,1) 100%)",
        }}
      >
        <Message
          style={{ fontSize: "40px", fontWeight: "500", marginBottom: "60px" }}
        >
          Please Sign In to Play!
        </Message>
        <GoogleButton
          type="light"
          onClick={signInWithFirebase}
          style={{ transform: "scale(1.3)", marginBottom: "80px" }}
        />
      </Prompt>
    </FillContainer>
  );
}

function HelpPrompt(props) {
  const { setShown } = props;
  return (
    <FillContainer>
      Hello world.
      <HelpDiv>
        <Explanation>
        <h1>How to play</h1>
        <p>
          When it's your turn, simply type in what you see in the prompt.
        </p>
        <h1>
          How is my goal WPM calculated?
        </h1>
        <p>
          Your goal score is 5 higher than the average wpm for your last game. 
        </p>

        </Explanation>
        <Credits>
          Made by Nathaniel Brown at <b>HackMIT</b> 2020
        </Credits>
        <XButton
          style={{ color: "darkred", borderColor: "darkred" }}
          onClick={() => setShown(false)}
        >
          ✕
        </XButton>
      </HelpDiv>
    </FillContainer>
  );
}

const Credits = styled.div`
  position: absolute; 
  bottom: 30px;
  text-align: center;
`

const Explanation = styled.div`
  margin-top: 30px;
  text-align: center;
  h1 {
    margin-bottom: 10px;
    margin-top: 40px;
  }
`

const HelpDiv = styled.div`
  background: rgb(255, 0, 174);
  background: linear-gradient(
    23deg,
    rgba(255, 0, 174, 1) 2%,
    rgba(255, 0, 0, 1) 40%,
    rgba(249, 94, 53, 1) 100%
  );
  box-shadow: 0px 10px 15px 1px rgba(0, 0, 0, 0.4);
  width: 70%;
  height: 80%;
  opacity: 0.88;
  border-radius: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  color: white;
  padding: 30px;
`;

function FinishPrompt(props) {
  const wpm = props.wpm || 64;
  const errorNum = props.errorNum || 13;
  const winAnimal = props.winAnimal || "bear";
  const won = props.won || false;
  const firebase = useFirebase();
  const [pctDiff, setpctDiff] = useState();
  const profile = useSelector((state) => state.firebase.profile);
  const history = useHistory();

  useEffect(() => {
    if (!isEmpty(profile) && !pctDiff) {
    let previousWPM = profile.averageWPM;
    let newWPM = wpm;
    console.log(profile)
    let diff = (((newWPM - previousWPM) / previousWPM) * 100).toFixed(1)
    setpctDiff(diff);

    firebase.updateProfile({
      averageWPM: wpm
    })
  }
  }, [profile])

  return (
    <FillContainer>
      <Prompt style={{height: "800px"}}>
        <WinnerDiv>
      <Animal
        src={winAnimal == 'bear' ? bearhead : rabbithead}
        style={winAnimal == 'bear' ? { transform: "translateX(27px)" } : {}}
      />
      {winAnimal == 'bear' ? 'Bear McCool won!' : 'Rapper Rabbit won!'}
      </WinnerDiv>
        <Message style={{fontWeight: "500"}}>Your Stats</Message>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "14px"
        }}>
          <Stat><Line/><Num>{wpm}</Num> wpm <Line long /> </Stat>
          <Stat><Line long/><Num>{errorNum}</Num> errors <Line/> </Stat>
          <Stat><Line/><Num>{pctDiff}%</Num> <div>improvement</div> <Line/> </Stat>
          <EncouragingMessage>
            {won ? "You're a Master Rapper." : "You'll get 'em next time!"}
          </EncouragingMessage>
        </div>
        <DoneButton onClick={() => history.push('/')}>
          <FaRegCheckCircle />
          I'm Done!
        </DoneButton>
      </Prompt>
    </FillContainer>
  )
}

const EncouragingMessage = styled.div`
  color: black;
  font-weight: 600;
  font-size: 21px;
  margin-top: 15px;
`

const DoneButton = styled.div`
  width: 250px;
  height: 90px;
  margin-top: 30px;
  border-radius: 10px;
  color: white;
  background-color: darkblue;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  font-weight: 500;
  border-bottom: 5px solid white;

  svg {
    height: 50px;
    width: 50px;
    margin-right: 12px;
  }
  &:hover {
    cursor: pointer;

    svg {
      animation: softbounce 0.5s ease-in-out infinite;
    }
  }
`;

const WinnerDiv = styled.div`
  display: flex;
  flex-direction: column;
  color: white;
  font-weight: 400;
  text-align: center;
  font-size: 30px;
  align-items: center;

  img {
    width: 250px;
    height: 250px;
  }
`

const Line = styled.div`
  width: 60px;
  ${props => props.long && 'width: 140px;'}
  height: 5px;
  border-radius: 5px;
  background-color: white;
  align-self: center;
  margin: 0px 14px;
`

const Num = styled.div`
  font-weight: 700;
  font-size: 45px;
  margin-right: 12px;
`

const Stat = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  color: white;
  font-size: 35px;
`

export { CreatePrompt, JoinPrompt, SignInPrompt, HelpPrompt, FinishPrompt };
