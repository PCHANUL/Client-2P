import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import cookie from 'react-cookies';

import Mypage from './Mypage';

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  withStyles,
  Modal,
  Grid,
} from '@material-ui/core';

import { ArrowBack, ContactSupport, Menu } from '@material-ui/icons';

const axios = require('axios');

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    position: 'fixed',
    width: '100%',
    zIndex: 6,
  },
  menuButton: {
    position: 'fixed',
    right: '30px',
    top: '15px',
  },
  title: {
    flexGrow: 1,
  },
  gobackButton: {
    position: 'fixed',
    left: '20px',
    top: '10px',
  },
});

class Nav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };

    window.addEventListener('keydown', (e) => {
      if (e.keyCode === 90 && e.ctrlKey) {
        this.props.history.push('/');
      }
      if (e.keyCode === 88 && e.ctrlKey) {
        this.props.history.push('/selectgame');
      }
      if (e.keyCode === 67 && e.ctrlKey) {
        this.props.history.push('/selectroom');
      }
      if (e.keyCode === 86 && e.ctrlKey) {
        this.props.history.push('/waitingroom');
      }
      if (e.keyCode === 66 && e.ctrlKey) {
        this.props.history.push('/playgame');
      }
    });
  }

  signout = async () => {
    await this.logout();
    cookie.remove('username', { path: '/' });
    cookie.remove('avatarId', { path: '/' });
    cookie.remove('selectedGame', { path: '/' });
    cookie.remove('selectedRoom', { path: '/' });
    cookie.remove('load', { path: '/' })
    window.location.reload();
  };

  logout = async () => {
    try {
      const response = await axios({
        method: 'post',
        url: 'http://localhost:3001/users/signout',
        withCredentials: true,
      });
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  getData = async () => {
    try {
      const response = await axios({
        method: 'get',
        url: 'http://localhost:3001/users/mypage',
        withCredentials: true,
      });
      console.log(response);
      return response;
    } catch (err) {
      console.log(err);
    }
  };

  handleOpenClose = () => {
    this.setState({ open: !this.state.open });
  };

  leaveRoomHandler = async () => {
    axios({
      method: 'post',
      url: 'http://localhost:3001/rooms/leaveroom',
      data: {
        roomId: cookie.load('selectedRoom'),
        gameCode: cookie.load('selectedGame'),
        username: cookie.load('username'),
      },
      withCredentials: true,
    })
      .then((res) => {
        if (res.data.message) {
          cookie.remove('selectedRoom', { path: '/' });
          this.props.history.push('./selectroom');
        }
      })
      .catch((err) => {
        alert(err);
      });
  };

  clickGoback = () => {
    let location = this.props.history.location.pathname;
    if (location === '/selectroom') {
      this.props.history.push('/selectgame');
      cookie.remove('selectedGame', { path: '/' });
    } else if (location === '/waitingroom') {
      this.leaveRoomHandler();
      this.props.history.push('/selectroom');
      cookie.remove('selectedRoom', { path: '/' });
    } else if (location === '/playgame') {
      this.props.history.push('/waitingroom');
      cookie.remove('isPlaying', { path: '/' });
    }
  };

  render() {
    const { classes, history } = this.props;

    return (
      <div className={classes.root}>
        <AppBar position='static'>
          {cookie.load('isPlaying') ? (
            // 게임화면일때
            <Toolbar>
              <IconButton
                color='inherit'
                className={classes.gobackButton}
                onClick={() => {
                  cookie.remove('isPlaying', { path: '/' });
                  history.push('/waitingroom');
                }}
              >
                <ArrowBack />
              </IconButton>
            </Toolbar>
          ) : (
            // 게임화면이 아닐때
            <Toolbar>
              {cookie.load('username') ? (
                // 로그인된 경우
                <div>
                  {cookie.load('selectedGame') ? (
                    // 게임을 선택한 경우
                    <IconButton
                      color='inherit'
                      className={classes.gobackButton}
                      onClick={() => this.clickGoback()}
                    >
                      <ArrowBack />
                    </IconButton>
                  ) : // 게임을 선택하지않은 경우
                  null}
                  <div className={classes.menuButton}>
                    <Button
                      color='inherit'
                      onClick={async () => {
                        this.resData = await this.getData();
                        this.handleOpenClose();
                      }}
                    >
                      Mypage
                    </Button>
                    <Button
                      color='inherit'
                      onClick={() => {
                        this.signout();
                      }}
                    >
                      Logout
                    </Button>
                  </div>
                </div>
              ) : (
                // 로그인되지 않은 경우
                <Button
                  color='inherit'
                  className={classes.menuButton}
                  onClick={() => {
                    history.push('/login');
                  }}
                >
                  Login
                </Button>
              )}
              <Modal open={this.state.open} onClose={this.handleOpenClose}>
                <Mypage userData={this.resData} />
              </Modal>
            </Toolbar>
          )}
        </AppBar>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(Nav));
