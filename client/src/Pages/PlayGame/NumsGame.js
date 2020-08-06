import React, { Component } from 'react';
import io from 'socket.io-client';
import PropTypes from 'prop-types';
import cookie from 'react-cookies';
import Gameover from '../../Components/PlayGame/Gameover';
import MoleScoreCard from '../../Components/PlayGame/MoleScoreCard';

import Paper from '@material-ui/core/Paper';
import { 
  Grid, 
  Typography,
  Tooltip,
  Fab,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { isDeleteExpression } from 'typescript';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import { KeyPad } from './keyPad';
import hemmer from '../../images/hemmer.png';
import clicked from '../../images/clicked.png';

import avatar from '../../images/bald.png'
import avatar2 from '../../images/gas-mask.png'
import E1 from '../../images/emoji/1.gif'
import E2 from '../../images/emoji/2.gif'
import E3 from '../../images/emoji/3.gif'
import E4 from '../../images/emoji/4.gif'

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';




const styles = (theme) => ({
  Paper: {
    // border: '20px solid #06cdd4',
    borderRadius: '40px',
    // boxShadow: theme.shadows[20],
    backgroundColor: 'white',
    margin: theme.spacing(3, 3),
    background: '#00babd'
  },
  root: {
    padding: theme.spacing(2, 4, 4, 4),
    backgroundColor: 'white',
    borderRadius: '30px',
    height: '100%',
  },
  avatar: {
    width: theme.spacing(15), 
    height: theme.spacing(13), 
    marginLeft: '10px'
  },
  pos: {
    color: '#000',
    marginBottom: '10px'
  },
  table: {
    width: '100%',
    font: '5px'
  },
  absolute: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(3),
  },
  rootroot: {
    position: 'fixed',
    right: '1%',
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
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },

});


class NumsGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      winner: '',
      myScore: 0,
      opponentScore: 0,
      opponentUsername: '',
      width: (document.body.clientWidth / 4),
      height: (document.body.clientWidth / 2),
      currentMole: 0,
      clickedNums: 0,
      count: 60,

      resultPad: [],
      rounds: [],

      RivalNums: [],
      myNums: [],

      board: true,
      myTurn : true,
      wrongInput: false,

      open: false,
      userAvatar: avatar,
      rivalAvatar: avatar2,
      showEmojis: false,
      isActive: false,

      warning: 0,
      warningRival: 0,
    };
    this.canvas = null;
    this.ctx = null;
    this.stageWidth = null;
    this.stageHeight = null;

    this.clicked = true;
    this.radius = this.state.width / 12;

    this.cursorX = null;
    this.cursorY = null;
    this.cursorEnter = false;
    this.cursorClick = false;

    this.out = false;
    this.result = false;

    this.numPad = [];

    let gifImages = [];

    let getGifImages = require.context('../../images/emoji', false, /.*\.gif$/);
    getGifImages.keys().forEach(function (key) {
      gifImages.push(getGifImages(key));
    })

    this.tileData = []
    gifImages.map((item) => {
      this.tileData.push({ img: item })
    })
    

    // socket connection endpoint
    this.socket = io('http://3.35.37.171:3006');

    for (let i = 0; i < 14; i++) {
      this.numPad.push(
        new KeyPad(this.state.width, this.state.height, this.state.width/10, i)
      );
    }
  }

  componentDidMount() {
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.hemmer = document.getElementById('hemmer');
    this.clickedCursor = document.getElementById('clicked');

    let rows = [
      this.createDate(2344, 1, 2, 1),
      this.createDate(2344, 1, 2, 1),
      this.createDate(2344, 1, 2, 1),
      // this.createDate(2344, 1, 2, 1),
      // this.createDate(2344, 1, 2, 1),
    ]

    this.setState({ rounds: rows })

    // 화면크기 재설정 이벤트
    this.resize();
    window.requestAnimationFrame(this.animate.bind(this));

    // 마우스 클릭이벤트
    this.canvas.addEventListener(
      'mousedown',
      (e) => {
        if(this.state.myTurn){
          this.mousePressed(e.layerX, e.layerY);
        }
      },
      false
    );

    this.canvas.addEventListener(
      'mouseup',
      (e) => {
      },
      false
    );

    // 마우스 움직임
    this.canvas.addEventListener('mousemove', (e) => {
      this.cursorEnter = true;
      this.cursorX = e.layerX;
      this.cursorY = e.layerY;
    });

    this.canvas.addEventListener('mouseleave', (e) => {
      this.cursorEnter = false;
    });

    // 키입력 이벤트
    document.addEventListener('keydown', (e) => {
      if(e.keyCode === 81){
        this.out = !this.out
      }
      if(e.keyCode === 87){
        this.result = !this.result
      }
      if(e.keyCode === 84){
        let a = !this.state.myTurn
        this.turnChange(a)
      }
      if(e.keyCode === 69){
        this.activeRivalEmoji(this.tileData[1].img)
      }

      // 처리된 데이터를 받는다.
      if(e.keyCode === 65){   // Rival data
        // let input = { number: 1234, result: '1S 3B'}
        let input = { number: '----', result: '-- --'}
        this.getRivalData(input)
      }
      if(e.keyCode === 83){   // My data
        let input = { number: 1234, result: '1S 3B'}
        this.getMyData(input)
      }
      if(e.keyCode === 68){   // No data
        let input = { number: '----', result: '-- --'}
        this.getMyData(input)
      }
      
    });

    // socket connection
    this.socket.emit('gameStart', cookie.load('username'), 'someRoomId');
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
      this.numPad[data.index].hideMole();
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
    
    this.socket.on('init', ([usernames, currentMole, score]) => {
      const opponentUsername = usernames.filter((username) => cookie.load('username') !== username);
      const players = Object.keys(score);
      let myScore, opponentScore;
      players.forEach((player) => {
        if (player === cookie.load('username')) {
          myScore = score[player];
        } else {
          opponentScore = score[player];
        }
      });
      this.setState({ opponentUsername, currentMole, myScore, opponentScore });
    });
  }

  

  componentWillUnmount() {
    this.numPad = [];
    this.socket.disconnect();
  }

  eraseAll() {
    this.state.resultPad.map((item) => {
      if(item === 0) item = 10
      this.numPad[item].removed()
    })
    this.setState({ resultPad: [] })
  }

  mousePressed(mouseX, mouseY) {
    for (let i = 0; i < this.numPad.length; i++) {
      // 키 패드 클릭
      let clickedMole = this.numPad[i].clicked(mouseX, mouseY, i, (this.state.resultPad.length === 4));
      
      if (clickedMole || clickedMole === 0) {
        if(this.state.resultPad.includes(clickedMole) === false) {
          // 하나의 입력된 숫자를 제거
          if (clickedMole === 11) {
            let del = [...this.state.resultPad]
            let deleted = del.pop()
            if(typeof deleted === 'number'){
              if(deleted === 0) deleted = 10
              this.numPad[deleted].removed();
              this.setState({ resultPad: [...del] })
            }
          } 
          // 모든 입력된 숫자를 제거
          else if (clickedMole === 12) {
            this.eraseAll()
          }
          // 입력된 값들을 서버로 전송
          else if (clickedMole === 13) {
            if(this.state.resultPad.length === 4){  
              let result = ''
              this.state.resultPad.map((item) => {
                result = result + String(item)
              })
              // 서버로 전송
              console.log(result)

              // 입력된 버튼 초기화
              this.eraseAll()
              // 현황판을 끈다
              this.setState({ board: false })
            } else {
              this.setState({ wrongInput: true })
              setTimeout(() => this.setState({ wrongInput: false }), 2000)
            }
          }

          // 입력된 숫자를 화면에 출력
          else if (this.state.resultPad.length !== 4){
            this.setState({ resultPad: [ ...this.state.resultPad, clickedMole]})
          }
        }


        // socket data
        const data = {
          gameRoomId: 'someRoomId',
          currentMole: this.state.currentMole,
          username: cookie.load('username'),
          index: clickedMole,
        };
        this.socket.emit('moleClick', data);
      }
    }
  }

  defineRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  createDate(number, strike, ball, out) {
    return { number, strike, ball, out };
  }

  // 상대방의 데이터 출력
  getRivalData = async (input) => {
    if(input.number === '----') this.setState({ warningRival: this.state.warningRival + 1})

    await this.setState({ board: false })
    await this.setState({ RivalNums: [...this.state.RivalNums, input]})
    this.out = true;
    this.inputResult()
  }

  // 유저의 데이터 출력
  getMyData = async (input) => {
    if(input.number === '----') this.setState({ warning: this.state.warning + 1})

    await this.setState({ board: false })
    await this.setState({ myNums: [...this.state.myNums, input]})
    this.result = true;
    this.inputResult()
  }

  // 처리된 결과값
  inputResult() {
    if (this.result) {
      let text = this.state.myNums[this.state.myNums.length - 1].result
      this.ctx.fillText(`${text}`, this.state.width / 4.5, this.state.height / 3)
      setTimeout(async () => {
        await this.setState({ board: true });
        this.result = false;
      }, 2000)
    }
    if (this.out) {
      let text = this.state.RivalNums[this.state.RivalNums.length - 1].result
      this.ctx.fillText(`${text}`, this.state.width / 4.5, this.state.height / 3)
      setTimeout(async () => {
        await this.setState({ board: true });
        this.out = false;
      }, 2000)
    }

  }
  
  // 일정 시간 후에 현황판 출력
  printBoard() {
    // 유저가 입력한 게임결과 출력
    this.state.myNums.map((item, index) => {
      this.ctx.font = `700 ${this.radius * 0.9}px san serif`;
      this.ctx.fillText(`${ item.number }`, this.state.width / 1.8, this.state.height / 8 + (this.state.height/13 * index));
      
      this.ctx.font = `300 ${this.radius * 0.6}px san serif`;
      this.ctx.fillText(`${ item.result }`, this.state.width / 1.4, this.state.height / 8 + (this.state.height/13 * index));
    })

    // 상대방이 입력한 게임결과 출력
    this.state.RivalNums.map((item, index) => {
      this.ctx.font = `700 ${this.radius * 0.9}px san serif`;
      this.ctx.fillText(`${ item.number }`, this.state.width / 7, this.state.height / 8 + (this.state.height/13 * index))
      
      this.ctx.font = `300 ${this.radius * 0.6}px san serif`;
      this.ctx.fillText(`${ item.result }`, this.state.width / 3.3, this.state.height / 8 + (this.state.height/13 * index))
    })
  }


  // 화면그리기
  animate(t) {
    window.requestAnimationFrame(this.animate.bind(this));
    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

    // this.numPad의 모든 요소를 각자의 위치에 생성
    for (let i = 0; i < this.numPad.length; i++) {
      this.numPad[i].draw(this.ctx, this.canvas.width, this.canvas.height, i);
    }

    this.ctx.fillStyle = '#fff'
    this.ctx.lineWidth = 1;
    this.ctx.shadowColor = '#c9c9c9';
    this.ctx.shadowBlur = 8;
    this.ctx.fillRect(this.state.width / 12, this.state.height / 15, this.state.width / 1.2, this.state.height / 2.5)
    
    this.ctx.shadowBlur = 0;

    this.ctx.fillStyle = '#000';
    this.ctx.font = `900 ${this.radius * 3}px san serif`;


    // 채점결과출력
    this.inputResult()
    
    if(this.state.board){
      this.printBoard()
    }


    // 클릭된 숫자 출력
    this.state.resultPad.map(( num, index ) => {
      let x = this.state.width / 6.5 + (this.state.width / 7) * (index)
      let y = this.state.height / 1.8;

      this.ctx.fillStyle = '#fff'
      this.ctx.beginPath();
      this.ctx.arc(x, y, this.radius, 0, 2 * Math.PI);
      this.ctx.fill();

      this.ctx.shadowBlur = 0;
      // 텍스트
      this.ctx.fillStyle = '#000';
      this.ctx.font = `${this.radius * 1.5}px serif`;
      this.ctx.fillText(`${num}`, x - this.radius/2.7, y + this.radius/2.7)
    })
   


    // 마우스가 canvas에 들어온 경우 망치이미지 생성
    // if (this.cursorEnter) {
    //   if (this.cursorClick) {
    //     this.ctx.drawImage(this.clickedCursor, this.cursorX - 20, this.cursorY - 40, 50, 50);
    //   } else {
    //     this.ctx.drawImage(this.hemmer, this.cursorX - 20, this.cursorY - 40, 50, 50);
    //   }
    // }
  }

  // 화면크기 재설정 함수
  resize() {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;

    this.canvas.width = Math.floor(this.stageWidth / 4);
    this.canvas.height = Math.floor(this.stageWidth / 2.4);

    this.setState({ width: this.canvas.width, height: this.canvas.height });
  }

  turnChange(isMyturn) {
    this.setState({ myTurn: isMyturn})
    this.countdown()
  }

  countdown() {
    // 이전 카운트다운을 취소, 초기화
    clearInterval(this.timer)
    this.setState({ count: 60 })

    // 카운트다운 시작
    this.timer = setInterval(() => {
      this.setState({ count: this.state.count - 1})
      if(this.state.count === 0){
        clearInterval(this.timer)
      }
    }, 1000);
  }

  activeEmoji(gif) {
    this.setState({ userAvatar: gif });
    setTimeout(() => {
      this.setState({ userAvatar: avatar, isActive: !this.state.isActive });
    }, 2500);
  }

  activeRivalEmoji(gif) {
    this.setState({ rivalAvatar: gif });
    setTimeout(() => {
      this.setState({ rivalAvatar: avatar2 })
    }, 2500)
  }

  render() {
    const { classes } = this.props;

    return (
      <Grid container direction='row' justify='space-evenly' alignItems='center'>
        {this.state.winner !== '' ? <Gameover winner={this.state.winner} /> : null}

        <Grid item>
          <Paper className={classes.root} style={{ 
            marginLeft: '40px', 
            width:`${document.body.clientWidth/9}px`, 
            boxShadow: `0px 0px 20px 0px ${this.state.myTurn ? '#d6d6d6' : '#0067c2'}`,
          }}> 
            <Typography className={classes.pos} variant='h2' component='h2'>
              {
                this.state.myTurn
                ? '대기'
                : this.state.count
              }
            </Typography>
            <Grid container direction='column' justify='center' alignItems='center'>
              <img src={this.state.rivalAvatar} className={classes.avatar}></img>
              <Typography className={classes.pos} variant='h5' component='h2'>
                {'Rival'}
              </Typography>
              {
                this.state.warningRival === 1
                ? <div style={{backgroundColor: 'yellow', width: '20px', height: '30px', border: '3px solid #000'}} />
                : this.state.warningRival === 2
                  ? <div style={{backgroundColor: 'red', width: '20px', height: '30px', border: '3px solid #000'}} />
                  : null
              }
            </Grid>
          </Paper>
        </Grid>

        <Paper id='paper' style={{
            width: this.state.width,
            height: this.state.height,
            // cursor: 'none',
          }} className={classes.Paper} >
          <canvas id='canvas' />
          <img id='hemmer' src={hemmer} style={{ width: '40px', display: 'none' }} />
          <img id='clicked' src={clicked} style={{ width: '40px', display: 'none' }} />
        </Paper>

        <Grid item>
          <Paper className={classes.root} style={{ 
            marginRight: '40px', 
            width:`${document.body.clientWidth/9}px`, 
            boxShadow: `0px 0px 20px 0px ${
              this.state.wrongInput
              ? '#ff5c5c'
              : this.state.myTurn ? '#0067c2' : '#d6d6d6'
            }`,
          }}> 
              {
                this.state.wrongInput
                ? <Typography className={classes.pos} variant='h6'>
                    4자리를<br />입력하세요
                  </Typography>
                : <Typography className={classes.pos} variant='h2' component='h2'>
                    {this.state.myTurn ? this.state.count : '대기'}
                  </Typography>
              }
            <Grid container direction='column' justify='center' alignItems='center'>
                <img src={this.state.userAvatar} className={classes.avatar}></img>
              <Typography className={classes.pos} variant='h5' component='h2'>
                {'you'}
              </Typography>
              {
                this.state.warning === 1
                ? <div style={{backgroundColor: 'yellow', width: '20px', height: '30px', border: '3px solid #000'}} />
                : this.state.warning === 2
                  ? <div style={{backgroundColor: 'red', width: '20px', height: '30px', border: '3px solid #000'}} />
                  : null
              }
            </Grid>
          </Paper>
        </Grid>
        <Tooltip title='이모티콘' aria-label='add' onClick={() => this.setState({ showEmojis: !this.state.showEmojis })}>
          <Fab color='secondary' className={this.props.classes.absolute}>
            <EmojiEmotionsIcon />
          </Fab>
        </Tooltip>

        <div className={classes.rootroot}>
          {
            this.state.showEmojis
            ? <GridList cellHeight={180} className={classes.gridList}>
                {
                  this.tileData.map((tile) => (
                  <GridListTile key={tile.img} style={{ height: '100px' }} 
                    onClick={() => {
                      console.log('this.state.showEmojis: ', this.state.isActive);
                      if(this.state.isActive === false) {
                        this.activeEmoji(tile.img)
                        this.setState({ showEmojis: !this.state.showEmojis, isActive: !this.state.isActive })
                      }
                    }}
                  >
                    <img src={tile.img} alt={tile.title} style={{ width: '70px', height: '70px' }} />
                  </GridListTile>
                  ))
                }
              </GridList>
            : null
          }
        </div>
      </Grid>
    );
  }
}

NumsGame.propsTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NumsGame);
