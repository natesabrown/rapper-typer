import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const GOOD_LETTERS = `
qwertyuiopasdfghjkl;'zxcvbnm
1234567890!@#$%^&*(),./<>?:"
[]{} 
`;

const ROW_1_NUMS = '5432222345';
const ROW_2_NUMS = '543222234555';
const ROW_3_NUMS = '54322223455';
const ROW_4_NUMS = '5432222345';

function KeyBoard() {
  const [shiftPressed, setShiftPressed] = useState(false);
  const [pressedLetters, setPressedLetters] = useState([]);

  const addToPressedLetters = (letter) => {
    setPressedLetters(pressedLetters.concat(letter));
  }

  const removeFromPressedLetters = (letter) => {
    setPressedLetters(pressedLetters.filter(pressedLetter => pressedLetter != letter));
  }

  const isClicked = (letter) => {
    return pressedLetters.includes(letter);
  }

  useEffect(() => {
    document.addEventListener("keydown", event => {
      if (event.key == "Shift") {
        setShiftPressed(true);
      }
      const key = event.key.toLowerCase();

      if (GOOD_LETTERS.includes(key)) {
        addToPressedLetters(key);
      }
    });
  }, [])

  useEffect(() => {
    document.addEventListener("keyup", event => {
      if (event.key == "Shift") {
        setShiftPressed(false);
      }
      
      if (GOOD_LETTERS.includes(event.key.toLowerCase())) {
        removeFromPressedLetters(event.key.toLowerCase());
      }
    })
  }, [])

  return (
    <KeyBoardDiv>
      <Row style={{marginRight: "145px"}}>
        {(shiftPressed ? "!@#$%^&*()" : "1234567890").split("").map((letter, index) => {
          return <Key clicked={isClicked(letter.toLowerCase())} key={letter}>
            {letter}
        <Specifier right={index > 4}>{ROW_1_NUMS[index]}</Specifier>
            </Key>
        })}
      </Row>
      <Row style={{marginLeft: "30px"}}>
        {(shiftPressed ? "QWERTYUIOP{}" : "qwertyuiop[]").split("").map((letter, index) => {
          return <Key clicked={isClicked(letter.toLowerCase())} key={letter}>{letter}
          <Specifier right={index > 4}>{ROW_2_NUMS[index]}</Specifier>
          </Key>
        })}
      </Row>
      <Row>
        {(shiftPressed ? "ASDFGHJKL:\"" : "asdfghjkl;'").split("").map((letter, index) => {
          return <Key clicked={isClicked(letter.toLowerCase())} key={letter}>{letter}
            <Specifier right={index > 4}>{ROW_3_NUMS[index]}</Specifier>
          </Key>
        })}
      </Row>
      <Row>
        <Key shift clicked={shiftPressed}>shift<Specifier>5</Specifier></Key>
        {(shiftPressed ? "ZXCVBNM<>?" : "zxcvbnm,./").split("").map((letter, index) => {
          return <Key clicked={isClicked(letter.toLowerCase())} key={letter}>{letter}<Specifier right={index > 4}>{ROW_2_NUMS[index]}</Specifier></Key>
        })}
        <Key shift clicked={shiftPressed}>shift<Specifier right>5</Specifier></Key>
      </Row>
      <Row>
        <Key clicked={isClicked(" ")} style={{marginRight: "58px"}} space><Specifier style={{transform: "translateX(-50px)"}}>1</Specifier><Specifier right style={{transform: "translateX(50px)"}}>1</Specifier></Key>
      </Row>
    </KeyBoardDiv>
  )
}

const SPEC_HEIGHT = 20;

const Specifier = styled.div`
  background-color: white;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${SPEC_HEIGHT}px;
  width: ${SPEC_HEIGHT}px;
  border-radius: ${SPEC_HEIGHT}px;
  color: ${props => props.right ? 'red' : 'blue'};
  border: 2px solid ${props => props.right ? 'red' : 'blue'};
  font-weight: 600;
  position: absolute;
  bottom: -${(SPEC_HEIGHT / 2) + 3}px;
`

const Key = styled.div`
  background-color: #DDDDDD;
  height: 50px;
  width: 50px;
  border-radius: 3px;
  font-size: 28px;
  font-weight: 500;
  margin: 5px 5px;
  border-bottom: 5px solid #444444;

  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  ${props => props.clicked && `
    border-bottom-width: 2px;
    transform: translateY(3px);
  `}
  ${props => props.shift && `
    width: 130px;
    font-size: 22px;
  `}
  ${props => props.space && `
    width: 300px; 
  `}
`

const Row = styled.div`
  display: flex;
  flex-direction: row;

`

const KeyBoardDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

export default KeyBoard;