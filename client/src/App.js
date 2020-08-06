import React, { Component } from 'react';
import { withRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import { connect } from 'react-redux';
import * as actionTypes from './store/actions';
import cookie from 'react-cookies';

import Login from './containers/Login';
import SelectGame from './Pages/SelectGame/SelectGame';
import WaitingRoom from './Pages/WaitingRoom/WaitingRoom';
import SelectRoom from './Pages/SelectRoom/SelectRoom';
import Nav from './Components/Nav/Nav';

import MakeGame from './Components/SelectRoom/MakeGame';
import PlayGame from './Pages/PlayGame/PlayGame';

const axios = require('axios');

class App extends Component {
  componentDidMount() {
    if (!cookie.load('username')) {
      this.props.history.push('/');
    }
  }

  render() {
    return (
      <div className='App'>
        <Nav />
        <Switch>
          <Route exact path='/'>
            <Login />
          </Route>
          <Route path='/selectgame'>
            <SelectGame />
          </Route>
          <Route path='/selectroom'>
            <SelectRoom />
          </Route>
          <Route path='/waitingroom'>
            <WaitingRoom />
          </Route>
          <Route path='/playgame'>
            <PlayGame />
          </Route>
        </Switch>

        <MakeGame />
      </div>
    );
  }
}

// redux container
function mapReduxStateToReactProps(state) {
  return {
    isLogin: state.login.isLogin,
  };
}

function mapReduxDispatchToReactProps(dispatch) {
  return {
    loginStatus: async () => {
      try {
        const response = await Mypage();
        if (response) {
          const username = response.data.nickname;
          const avatar = response.data.avatarId;
          dispatch({ type: actionTypes.LOGIN, payload: { username, avatar } });
        }
      } catch (err) {
        // 로그인되어있지 않은 상태
        console.log(err);
      }
    },
  };
}

const Mypage = async () => {
  try {
    const response = await axios({
      method: 'get',
      url: 'http://3.34.178.78:3001/users/mypage',
      withCredentials: true,
    });
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export default connect(mapReduxStateToReactProps, mapReduxDispatchToReactProps)(withRouter(App));
