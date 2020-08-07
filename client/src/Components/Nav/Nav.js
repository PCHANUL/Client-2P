import React, { Component } from 'react';
import cookie from 'react-cookies'

import { AppBar, Toolbar, Typography, Button, IconButton, withStyles } from '@material-ui/core';
import { ArrowBack, ContactSupport, Menu } from '@material-ui/icons';

import { Modal } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';

import Mypage from './Mypage';

const axios = require('axios');

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    position: "fixed",
    width: "100%",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
});

class Nav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    }

    window.addEventListener('keydown', (e) => {
      if(e.keyCode === 90 && e.ctrlKey){
        this.props.history.push('/')
      }
      if(e.keyCode === 88 && e.ctrlKey){
        this.props.history.push('/selectgame')
      }
      if(e.keyCode === 67 && e.ctrlKey){
        this.props.history.push('/selectroom')
      }
      if(e.keyCode === 86 && e.ctrlKey){
        this.props.history.push('/waitingroom')
      }
      if(e.keyCode === 66 && e.ctrlKey){
        this.props.history.push('/playgame')
      }
      if(e.keyCode === 116){
        console.log('awefawefawef')
      }
    })

  }

  signout = async() => {
    await this.logout()
    cookie.remove('username', {path:'/'})
    cookie.remove('avatarId', {path:'/'})
    cookie.remove('selectedGame', {path:'/'})
    cookie.remove('selectedRoom', {path:'/'})
    window.location.reload()
  }

  logout = async() => {
    try {
      const response = await axios({
        method: 'post',
        url: 'http://3.34.178.78:3001/users/signout',
        withCredentials: true,
      })
      console.log(response)
    } catch (err) {
      console.log(err)
    }
  }

  getData = async() => {
    try {
      const response = await axios({
        method: 'get',
        url: 'http://3.34.178.78:3001/users/mypage',
        withCredentials: true,
      })
      console.log(response)
      return response
    } catch (err) {
      console.log(err)
    }
  }

  handleOpenClose = () => {
    this.setState({ open: !this.state.open })
  };

  render() {
    const { classes, history } = this.props;

    return (
      <div className={classes.root}>
        <AppBar position='static'>
            {
              cookie.load('isPlaying')
              ? (   // 게임화면일때 
              <Toolbar>
                <IconButton edge='start' className={classes.menuButton} color='inherit' aria-label='menu' 
                  onClick={() => {
                    cookie.remove('isPlaying', { path: '/' })
                    history.push('/waitingroom')
                  }}
                >
                  <ArrowBack />
                </IconButton>
              </Toolbar>
              ) : (   // 게임화면이 아닐때
              <Toolbar>
                <IconButton edge='start' className={classes.menuButton} color='inherit' aria-label='menu' 
                    onClick={() => {
                      if(cookie.load('selectedGame') && cookie.load('selectedRoom')){
                        cookie.remove('selectedRoom', { path: '/' })
                      } else if(cookie.load('selectedGame')){
                        cookie.remove('selectedGame', { path: '/' })
                      }
                      history.goBack()
                    }}
                  >
                    <ArrowBack />
                  </IconButton>
                  <Typography variant='h6' className={classes.title}></Typography>
                    {
                      cookie.load('username')
                      ? <div>
                          <Button color='inherit' onClick={async () => {
                            this.resData = await this.getData()
                            this.handleOpenClose()
                          }}>
                            Mypage
                          </Button>
                          <Button
                          color='inherit'
                          onClick={() => {
                            this.signout();
                          }}
                          > Logout
                          </Button>
                        </div>
                      : <Button
                          color='inherit'
                          onClick={() => {
                            history.push('/');
                          }}
                          >
                            Login
                        </Button>
                      }
                  <IconButton color='inherit'>
                    <ContactSupport />
                  </IconButton>
                  <Modal open={this.state.open} onClose={this.handleOpenClose}>
                    <Mypage userData={this.resData} />
                  </Modal>
                </Toolbar>
              )
            }
          
        </AppBar>
      </div>
    );
  }

}

export default withRouter(withStyles(styles)(Nav));
