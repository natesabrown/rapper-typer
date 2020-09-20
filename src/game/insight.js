import React, { useEffect } from "react";
import styled from "styled-components";

function Insight(props) {
  const letters = props.wrongLetters;
  const wpmarr = props.wpmarr || [78, 55];
  
  const getLastWPM = (arr) => {
    return Math.round(Number(arr[arr.length - 1]));
  };

  const getLetterMessage = () => {
    console.log("Hello!")
    console.log(letters);
    if (!letters || letters == "") {
      return "So far, you haven't missed a single letter!";
    } else {
      let arr = letters.split("");
      let occurrences = {};
      for (var i = 0, j = arr.length; i < j; i++) {
        occurrences[arr[i]] = (occurrences[arr[i]] || 0) + 1;
      }
      let most_arr = Object.entries(occurrences).map((key, value) => {
        return key;
      });
      
      most_arr.sort((x,y) => {
        if (x[1] > y[1]) {
          return -1;
        } else if (x[1] < y[1]) {
          return 1;
        } else {
          return 0;
        }
      });
      if (most_arr.length >= 3) {
        return `Letters you should work on are ${most_arr[0][0]}, ${most_arr[1][0]}, and ${most_arr[2][0]}.`
      } else if (most_arr.length == 2) {
        return `Letters you should work on are ${most_arr[0][0]} and ${most_arr[1][0]}.`
      } else if (most_arr.length == 1) {
        return `One letter you should work on is ${most_arr[0][0]}.`
      }
    }
  };

  return (
    <InsightDiv>
      Your WPM for that session was <b>{getLastWPM(wpmarr)}</b>.{getLetterMessage()}
    </InsightDiv>
  );
}

const InsightDiv = styled.div`
  background-color: darkgray;
  opacity: 0.8;
  padding: 23px;
  border-radius: 12px;
  position: fixed;
  width: 400px;
  bottom: 24px;
  left: 24px;
  font-size: 20px;
`;

export default Insight;
