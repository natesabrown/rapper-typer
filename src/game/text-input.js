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

function TextInput(props) {
  const turn = props.turns[props.currentTurn];
  const onNextRow = props.onNextRow;
  const onDone = props.onDone;
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const addStuff = (event) => {
      const key = event.key;
      let letter = turn[index][progress];
      if (key == letter) {
        addProgress();
      }
    };

    document.addEventListener("keydown", addStuff);
    return () => {
      document.removeEventListener("keydown", addStuff);
    };
  }, [progress, index]);

  const addProgress = () => {
    setProgress((progress) => progress + 1);
    if (progress == turn[index].length - 1) {
      setProgress(0);
      if (index + 1 == turn.length) {
        console.log("finish");
        onDone();
      } else {
        onNextRow();
        setIndex(index + 1);
      }
    }
  };

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
            <Letter typed={index < progress}>&nbsp;</Letter>
          ) : (
            <Letter typed={index < progress}> {letter}</Letter>
          );
        })}
      </Row>
      <NextLine>{getNextLine()}</NextLine>
    </Lines>
  );
}

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
          {props.turns[props.currentTurn][props.currentLine]}
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
