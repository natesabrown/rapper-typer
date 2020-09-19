import React from 'react';
import styled from 'styled-components';
import { Route, Switch } from 'react-router-dom';

import Home from './home';
import Game from './game';

function App() {
  return (
    <Switch>
      <Route path="/" component={Home} exact />
      <Route path="/game" component={Game} exact />
      <Route path="/game/:gameID" component={Game} exact />
    </Switch>
  );
}

export default App;
