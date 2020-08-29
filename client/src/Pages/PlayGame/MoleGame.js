import React, { Component } from 'react';
import { connect } from 'react-redux';
import socketio from 'socket.io-client';
import PropTypes from 'prop-types';
import cookie from 'react-cookies';
import Gameover from '../../Components/PlayGame/Gameover';
import MoleScoreCard from '../../Components/PlayGame/MoleScoreCard';

import { Paper, Button, Grid, Fab, Tooltip, GridList, GridListTile, Typography } from '@material-ui/core';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import { withStyles } from '@material-ui/core/styles';
import { isDeleteExpression } from 'typescript';

import { Mole } from './mole';
import hemmer from '../../images/hemmer.png';
import clicked from '../../images/clicked.png';

const styles = (theme) => ({
  Paper: {
    
    backgroundColor: 'white',
    margin: theme.spacing(3, 3),
    background: '#00babd',
  },
  root: {
    width: theme.spacing(25),
    padding: theme.spacing(4),
    backgroundColor: 'white',
    borderRadius: '30px',
  },
  avatar: {
    width: theme.spacing(15),
    height: theme.spacing(13),
    marginLeft: '10px',
  },
  pos: {
    color: '#000',
  },
  absolute: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(3),
  },
  rootroot: {
    position: 'fixed',
    right: '1%',
    bottom: '100px',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 200,
    height: 450,
  },
});

let blockX;
let dx = 10;
let preKey;
let moles = [];

class MoleGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      winner: '',
      myScore: 0,
      opponentScore: 0,
      opponentUsername: '',
      width: document.body.clientWidth / 4,
      height: document.body.clientWidth / 4,
      currentMole: 0,

      // emoji
      userAvatar: '',
      rivalAvatar: '',
      showEmojis: false,
      isActive: false,
    };
    this.canvas = null;
    this.ctx = null;
    this.stageWidth = null;
    this.stageHeight = null;

    this.clicked = true;

    this.cursorX = null;
    this.cursorY = null;
    this.cursorEnter = false;
    this.cursorClick = false;

    this.gifCount = 0;

    // computer
    this.computer = {
      avatarId: 'https://image.flaticon.com/icons/svg/603/603506.svg',
      username: 'COMPUTER',
    }

    // socket connection endpoint
    this.socket = socketio.connect('http://localhost:3009');

    for (let i = 0; i < 16; i++) {
      moles.push(new Mole(this.state.width, this.state.height, 15, i));
    }

    this.tileData = [];
    this.props.gifEmoji.map((item) => {
      this.tileData.push({ img: item });
    });
  }

  componentDidMount() {
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.hemmer = document.getElementById('hemmer');
    this.clickedCursor = document.getElementById('clicked');

    // 화면크기 재설정 이벤트
    // window.addEventListener('resize', this.resize.bind(this), false);
    this.resize();
    window.requestAnimationFrame(this.animate.bind(this));

    this.canvas.addEventListener(
      'mousedown',
      (e) => {
        this.mousePressed(e.layerX, e.layerY);
        // for(let i=0; i<16; i++){
        //   this.randomMole(i)
        // }
        this.cursorClick = true;
      },
      false
    );

    this.canvas.addEventListener(
      'mouseup',
      (e) => {
        this.cursorClick = false;
      },
      false
    );

    this.canvas.addEventListener('mousemove', (e) => {
      this.cursorEnter = true;
      this.cursorX = e.layerX;
      this.cursorY = e.layerY;
    });

    this.canvas.addEventListener('mouseleave', (e) => {
      this.cursorEnter = false;
    });

    // socket connection
    this.socket.emit(
      'gameStart',
      cookie.load('username'),
      cookie.load('selectedRoom'),
      cookie.load('avatarId')
    );

    this.socket.on('generateMole', (index) => {
      this.setState({ currentMole: this.state.currentMole + 1 });
      this.randomMole(index);
    });

    this.socket.on('updateScore', (data) => {
      /**
       * data = {
       *    index: 0~15,
       *    score: {
       *      player1: 0,
       *      player2: 10,
       *    }
       * }
       */
      moles[data.index].hideMole();
      const [player1, player2] = Object.keys(data.score);
      if (player1 === cookie.load('username')) {
        this.setState({ myScore: data.score[player1], opponentScore: data.score[player2] });
      } else {
        this.setState({ myScore: data.score[player2], opponentScore: data.score[player1] });
      }
    });

    this.socket.on('gameover', (data) => {
      // data = username
      this.setState({ winner: data });
    });

    this.socket.on('init', ([usernames, currentMole, score, avatarIds]) => {
      console.log('usernames, currentMole, score, avatarIds: ', usernames, currentMole, score, avatarIds);

      const opponentUsername = usernames.filter((username) => cookie.load('username') !== username);
      console.log('opponentUsername: ', opponentUsername);

      const players = Object.keys(score);
      let myScore, opponentScore;
      players.forEach((player) => {
        if (player === cookie.load('username')) {
          myScore = score[player];
        } else {
          opponentScore = score[player];
        }
      });
      this.setState({
        opponentUsername,
        currentMole,
        myScore,
        opponentScore,
        userAvatar: this.props.avatar[avatarIds[cookie.load('username')]],
        rivalAvatar: this.props.avatar[avatarIds[opponentUsername]],
      });
    });

    this.socket.on('opponentGif', (gif) => {
      this.activeRivalEmoji(gif);
    });
  }

  componentWillUnmount() {
    moles = [];
    this.socket.disconnect();
  }

  mousePressed(mouseX, mouseY) {
    for (let i = 0; i < moles.length; i++) {
      let clickedMole = moles[i].clicked(mouseX, mouseY, i, this.ctx);
      if (clickedMole) {
        const data = {
          gameRoomId: cookie.load('selectedRoom'),
          currentMole: this.state.currentMole,
          username: cookie.load('username'),
          index: clickedMole,
        };
        this.socket.emit('moleClick', data);
      }
    }
  }

  // moles배열에서 랜덤한 인덱스의 mole이 나옴
  randomMole(index) {
    moles[index].showMole();
  }

  // 화면그리기
  animate(t) {
    window.requestAnimationFrame(this.animate.bind(this));
    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

    // moles의 모든 요소를 각자의 위치에 생성
    for (let i = 0; i < moles.length; i++) {
      moles[i].draw(this.ctx, this.canvas.width, this.canvas.height, this.gifCount);
    }

    // 마우스가 canvas에 들어온 경우 망치이미지 생성
    if (this.cursorEnter) {
      if (this.cursorClick) {
        this.ctx.drawImage(this.clickedCursor, this.cursorX - 10, this.cursorY - 30, 50, 50);
      } else {
        this.ctx.drawImage(this.hemmer, this.cursorX - 10, this.cursorY - 30, 50, 50);
      }
    }
  }

  // 화면크기 재설정 함수
  resize() {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;

    this.canvas.width = Math.floor(this.stageWidth / 4);
    this.canvas.height = Math.floor(this.stageWidth / 4);

    this.setState({ width: this.canvas.width, height: this.canvas.height });
  }

  activeEmoji(gif) {
    const avatarBeforeChange = this.state.userAvatar;
    const data = { gameRoomId: cookie.load('selectedRoom'), gif };
    this.socket.emit('activateGif', data);
    this.setState({ userAvatar: gif });
    // this.socket.emit('sendEmoji', (JSON.stringify(gif)));

    setTimeout(() => {
      this.setState({
        userAvatar: avatarBeforeChange,
        isActive: !this.state.isActive,
      });
    }, 2500);
  }

  activeRivalEmoji(gif) {
    const avatarBeforeChange = this.state.rivalAvatar;

    this.setState({ rivalAvatar: gif });
    setTimeout(() => {
      this.setState({ rivalAvatar: avatarBeforeChange });
    }, 2500);
  }

  computerModeStart() {
    this.socket.emit(
      'gameStart',
      this.computer.username,
      cookie.load('selectedRoom'),
      12,
    );
    // this.setState({
    //   rivalAvatar: this.computer.avatarId,
    //   opponentUsername: this.computer.username,
    //   opponentScore: 0,
    // });
  }


  render() {
    const { classes, avatar } = this.props;
    console.log(cookie.load('avatarId'))

    return (
      <Grid container direction='row' justify='space-evenly' alignItems='center' style={{ marginTop: `${this.state.width/4}px`}}>
        {this.state.winner !== '' ? <Gameover winner={this.state.winner} /> : null}

        <Grid item>
          <Paper 
            className={classes.root} 
            style={{ 
              marginLeft: '40px',
              width: `${this.state.width / 2}px`,
              height: `${this.state.width / 1.2}px`,
            }}
          >
            <Grid container direction='column' justify='center' alignItems='center'>
              {
                !this.state.opponentUsername.length
                ? <Button color="secondary" 
                    disableElevation 
                    style={{
                      width: `${this.state.width / 2}px`,
                      height: `${this.state.width / 2}px`,
                    }} 
                    variant="outlined" 
                    onClick={() => {
                      console.log('clicked')
                      this.computerModeStart();
                  }}>
                    <Typography style={{ 
                      fontSize: `${this.state.width/15}px`
                    }}>
                      컴퓨터<br/>대결시작
                    </Typography>
                  </Button>
                : 
                <>
                  <img 
                    src={this.state.rivalAvatar} 
                    style={{
                      width: this.state.width/2,
                      height: this.state.width/2.2,
                    }}
                  />
                  <Typography 
                    className={classes.pos} 
                    style={{
                      fontSize: `${this.state.width/15}px`
                    }}
                  >
                    {this.state.opponentUsername}
                  </Typography>
                </>
              }

              <Typography 
                className={classes.pos} 
                style={{
                  fontSize: `${this.state.width/5}px`
                }}  
              >
                {this.state.opponentScore}
              </Typography>

            </Grid>
          </Paper>
        </Grid>

        <Paper
          id='paper'
          style={{
            width: this.state.width,
            height: this.state.height,
            borderRadius: `${this.state.width/6}px`,
            border: `${this.state.width/11}px solid #06cdd4`,
            cursor: 'none',
          }}
          className={classes.Paper}
        >
          <canvas id='canvas' />
          <img id='hemmer' src={hemmer} style={{ width: '40px', display: 'none' }} />
          <img id='clicked' src={clicked} style={{ width: '40px', display: 'none' }} />
        </Paper>

        <Grid item>
          <Paper 
            className={classes.root} 
            style={{ 
              marginRight: '40px',
              width: `${this.state.width / 2}px`,
              height: `${this.state.width / 1.2}px`,
            }}
          >
            <Grid container direction='column' justify='center' alignItems='center'>
              <img 
                src={this.state.userAvatar} 
                style={{
                  width: this.state.width/2,
                  height: this.state.width/2.2,
                }}
              ></img>
              <Typography 
                className={classes.pos}
                style={{
                  fontSize: `${this.state.width/15}px`
                }}
              >
                {cookie.load('username')}
              </Typography>
              <Typography 
                className={classes.pos} 
                style={{
                  fontSize: `${this.state.width/5}px`
                }}
              >
                {this.state.myScore}
              </Typography>
            </Grid>
          </Paper>
        </Grid>

        <Tooltip
          title='이모티콘'
          aria-label='add'
          onClick={() => this.setState({ showEmojis: !this.state.showEmojis })}
        >
          <Fab color='secondary' className={this.props.classes.absolute}>
            <EmojiEmotionsIcon />
          </Fab>
        </Tooltip>

        <div className={classes.rootroot}>
          {this.state.showEmojis ? (
            <GridList cellHeight={180} className={classes.gridList}>
              {this.tileData.map((tile) => (
                <GridListTile
                  key={tile.img}
                  style={{ height: '100px' }}
                  onClick={() => {
                    if (this.state.isActive === false) {
                      this.activeEmoji(tile.img);
                      this.setState({
                        showEmojis: !this.state.showEmojis,
                        isActive: !this.state.isActive,
                      });
                    }
                  }}
                >
                  <img src={tile.img} alt={tile.title} style={{ width: '70px', height: '70px' }} />
                </GridListTile>
              ))}
            </GridList>
          ) : null}
        </div>
      </Grid>
    );
  }
}

MoleGame.propsTypes = {
  classes: PropTypes.object.isRequired,
};

const mapReduxStateToReactProps = (state) => {
  return {
    avatar: state.login.avatar,
    gifEmoji: state.currentGame.gif,
  };
};
export default connect(mapReduxStateToReactProps)(withStyles(styles)(MoleGame));
