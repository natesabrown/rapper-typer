import React from 'react';
import styled from 'styled-components';
import Keyboard from './keyboard';

function Game(props) {
  const gameID = props.match.params.gameID;

  return (
    <Keyboard />
  )
}

export default Game;