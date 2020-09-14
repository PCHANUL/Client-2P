import React, { Component } from 'react';
import './App.css';

import Login from './Pages/Login/Login';
import SelectGame from './Pages/SelectGame/SelectGame';
import WaitingRoom from './Pages/WaitingRoom/WaitingRoom';
import Signin from './containers/Signin'
import Signup from './containers/Signup'
import Nav from './Components/Nav/Nav'
import SelectRoom from './Pages/SelectRoom/SelectRoom'
import MakeGame from './Components/SelectRoom/MakeGame'


class App extends Component {
  render() {
    return (
      <div className='App'>
        {/* <Login />
        <SelectGame /> */}
        <WaitingRoom />
        <MakeGame />
        <Nav></Nav>
        <SelectRoom></SelectRoom>
      </div>
    );
  }
}

export default App;
