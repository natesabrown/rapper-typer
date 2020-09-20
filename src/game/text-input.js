import React, { useState, useEffect } from "react";
import styled from "styled-components";

const TURNS = {
  0: [
    "This is a rap song",
    "And I hope it don't last long",
    "Cause when we are through",
    "Your pride will be long gone",
    // "When I get finished, the crowd will go through the roof",
    // "You'll just look like you have seen a ghost!",
    // "And when we get done, you will discover",
    // "That my bars are by far loved the most.",
  ],
  1: [
    "Oh yeah? What you talk about",
    "Like you have something to say;",
    "It feels like every darn day, you just get in my way",
    "with what you say, but that's okay,",
    "Because we know that practice, it pays",
    "And we know my bars, they slays",
    "Slays dragons, slays monsters, and your career too",
    "You won't want to look in a mirror when I'm through with you.",
  ],
};

const GOOD_LETTERS = `
qwertyuiopasdfghjkl;'zxcvbnm
1234567890!@#$%^&*(),./<>?:"
[]{} 
`;

function TextInput(props) {
  const turn = props.turns[props.currentTurn];
  const onNextRow = props.onNextRow;
  const onDone = props.onDone;
  const wpmArr = props.wpmArr;
  const setwpmArr = props.setwpmArr;
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [startTime, setStart] = useState();
  const [showError, setShowError] = useState(false);
  const numErrors = props.numErrors;
  const setNumErrors = props.setNumErrors;
  const wrongLetters = props.wrongLetters;
  const setWrongLetters = props.setWrongLetters;

  useEffect(() => {
    const addStuff = (event) => {
      const key = event.key;
      let letter = turn[index][progress];
      if (key == letter) {
        addProgress();
        conditionalTimeStart();
      } else if (startTime && (letter.toLowerCase() != "shift")){
        addError(letter);
      }
    };

    document.addEventListener("keydown", addStuff);
    return () => {
      document.removeEventListener("keydown", addStuff);
    };
  }, [progress, index, numErrors, showError, wrongLetters]);

  const addProgress = () => {
    setProgress((progress) => progress + 1);
    if (progress == turn[index].length - 1) {
      setProgress(0);
      if (index + 1 == turn.length) {
        // user done with their turn 
        addTimeToArr();
        onDone();
      } else {
        onNextRow();
        setIndex(index + 1);
        console.log(`Index is now $${index}`);
        console.log(turn)
      }
    }
  };

  const addError = (letter) => {
    console.log("adding error")
    setNumErrors((numErrors) => numErrors + 1);
    setWrongLetters((wrongLetters) => (wrongLetters + letter));
    console.log(`Wrong letters are now ${wrongLetters}`)

    setShowError(true);
    setTimeout(() => {
      setShowError(false);
    }, 1000);
  }

  const addTimeToArr = () => {
    // for laziness' sake
    // setWrongLetters("")

    let arr = [...wpmArr]
    let seconds = (((new Date()) - startTime) / 1000)
    let minutes = seconds / 60;
    console.log(`Took ${minutes} minutes in total.`);
    let numWords = calcNumberOfWords();
    console.log(`This turn had ${numWords} words.`);
    let wpm = numWords/minutes;
    console.log(`Works out to ${wpm} wpm.`)
    arr.push(wpm);
    setwpmArr(arr);
  }

  const calcNumberOfWords = () => {
    let num = 0;
    for (let line of turn) {
      for (let word of line.split(" ")) {
        num += 1;
      }
    }
    return num;
  }

  const conditionalTimeStart = () => {
    if (!startTime) {
      setStart(new Date())
    }
  }

  const getNextLine = () => {
    if (index + 1 == turn.length) {
      return undefined;
    } else {
      return turn[index + 1];
    }
  };

  return (
    <Lines>
      <Row>
        {turn[index].split("").map((letter, index) => {
          return letter == " " ? (
            <Letter typed={index < progress} active={progress == index}>&nbsp;</Letter>
          ) : (
            <Letter typed={index < progress} active={progress == index}> {letter}</Letter>
          );
        })}
      </Row>
      {/* TODO: Fix this and show errors */}
      {/* {showError && generateError()} */}
      <NextLine>{getNextLine()}</NextLine>
    </Lines>
  );
}

function generateError() {
  return <Error 
  size={Math.max(Math.random() * 50, 25)}
  hrDistance={(Math.random() * 1000) - 250}
>-1</Error>
}

const Error = styled.div`
  font-size: ${props => props.size}px;
  animation: fade-in-out 0.5s;
  color: red;
  position: absolute;
  left: ${props => props.hrDistance}px;

  @keyframes fade-in-out {
    0% {
      opacity: 0%;
      transform: scale(0.3);
    }
    25% {
      opacity: 100%;
      transform: scale(1.1);
    }
    100% {
      opacity: 0%;
      transform: scale(0.3);
    }
  }
`

function ShowOtherInput(props) {

  return (
    <Lines>
      <Row>
        <div style={{
          fontSize: "25px",
          fontWeight: "600",
          color: "orange",
          textAlign: "center"
        }}>
          {props.currentTurn ? props.turns[props.currentTurn][props.currentLine] : props.turns["0"][0]}
        </div>
      </Row>
    </Lines>
  );
}

const NextLine = styled.div`

mask-image: linear-gradient(to top, rgba(169, 169, 169, 0), rgba(169, 169, 169, 1));

 );
`;

const Letter = styled.div`
  color: ${(props) => (props.typed ? "black" : "rgba(169, 169, 169)")};
  font-size: 28px;
  ${props => props.active && `
    animation: blink 1s infinite;
  `}
  @keyframes blink {
    0% {
      background-color: gray;
    }
    25% {
      background-color: white;
    }
    50% {
      background-color: white;
    }
    100% {
      background-color: gray;
    }
  }
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

const Lines = styled.div`
  position: absolute;
  left: 50%;
  top: 30%;
  transform: translateX(-50%) translateY(-30%);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export { ShowOtherInput, TextInput as default};
