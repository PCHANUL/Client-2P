import React from 'react';
import { connect } from 'react-redux';
import cookie from 'react-cookies';
import { useHistory } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import RefreshIcon from '@material-ui/icons/Refresh';
import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';

import * as actionTypes from '../../store/actions';
import RoomList from '../../Components/SelectRoom/RoomList';

const axios = require('axios');

const useStyles = makeStyles((theme) => ({
  absolute: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(3),
  },
  refresh: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(11),
  },
  section1: {
    margin: theme.spacing(3, 2),
  },
  emptyAlert: {
    width: theme.spacing(80),
    height: theme.spacing(70),
  },
  alertText: {
    margin: theme.spacing(20, 0, 10, 0),
  },
  root: {
    padding: theme.spacing(8, 0, 0, 0),
  },
}));

function SelectRoom({ login, roomList, getRooms, makeRooms, isMaking }) {
  const classes = useStyles();
  const history = useHistory();
  const [currentGame, selectedGame] = React.useState(0);
  const [rooms, getRoomList] = React.useState([{}]);

  React.useEffect(() => {
    console.log(history);
    if (!cookie.load('username')) {
      history.push('/');
    } else if (!cookie.load('selectedGame')) {
      history.push('/selectgame');
    } else if (cookie.load('selectedRoom')) {
      history.push('/waitingroom');
    }
    getRooms(getRoomList);
    selectedGame(Number(cookie.load('selectedGame')));
  }, [currentGame]);

  const handleChange = (event, newValue) => {
    selectedGame(newValue);
    cookie.save('selectedGame', newValue, { path: '/' });
  };

  const leaveRoomHandler = () => {};

  const emptyRoomList = (
    <Grid
      container
      container
      direction='column'
      justify='space-evenly'
      alignItems='center'
      className={classes.section1}
    >
      <Paper className={classes.emptyAlert}>
        <Grid item>
          <Typography variant='h4' className={classes.alertText}>
            대기중인 방이 없습니다.
            <br />
            방을 생성해보세요
          </Typography>
        </Grid>
        <Grid container direction='row' justify='space-evenly' alignItems='center'>
          <Tooltip
            title='방만들기'
            aria-label='add'
            onClick={() => {
              makeRooms();
            }}
          >
            <Fab color='secondary'>
              <AddIcon />
            </Fab>
          </Tooltip>
          <Tooltip
            title='새로고침'
            aria-label='add'
            onClick={() => {
              getRooms(getRoomList);
            }}
          >
            <Fab color='primary'>
              <RefreshIcon />
            </Fab>
          </Tooltip>
        </Grid>
      </Paper>
    </Grid>
  );

  return (
    <div>
      <Paper className={classes.root}>
        <Tabs
          value={currentGame}
          onChange={handleChange}
          onClick={getRooms}
          indicatorColor='primary'
          textColor='primary'
          centered
        >
          <Tab label='게임 설명' />
          <Tab label='두더지 게임' />
          <Tab label='구슬 동자' />
          <Tab label='숫자 야구' />
        </Tabs>
      </Paper>
      {cookie.load('selectedGame') === '0' ? (
        <div>게임설명</div>
      ) : rooms[0] === undefined ? ( // 생성된 방이 없다
        emptyRoomList
      ) : (
        <div>
          <div className={classes.section1}>
            {rooms.map((room, idx) => (
              <RoomList
                key={idx}
                roomName={room.roomName}
                isWait={room.isWait}
                isLocked={room.isLocked}
                isFull={room.userNum}
                login={login}
                roomId={room.roomId}
                gameCode={room.gameCode}
              />
            ))}
          </div>
          <Tooltip
            title='방만들기'
            aria-label='add'
            onClick={() => {
              makeRooms();
            }}
          >
            <Fab color='secondary' className={classes.absolute}>
              <AddIcon />
            </Fab>
          </Tooltip>
          <Tooltip
            title='새로고침'
            aria-label='add'
            onClick={() => {
              getRooms(getRoomList);
            }}
          >
            <Fab color='primary' className={classes.refresh}>
              <RefreshIcon />
            </Fab>
          </Tooltip>
        </div>
      )}
    </div>
  );
}

const mapReduxStateToReactProps = (state) => {
  return {
    roomList: state.selectedRoom.roomList,
    isMaking: state.selectedRoom.isMaking,
    login: state.login,
  };
};

const mapReduxDispatchToReactProps = (dispatch) => {
  return {
    getRooms: async function (cb) {
      try {
        if (cookie.load('selectedGame') !== '0') {
          const response = await axios({
            method: 'get',
            url: 'http://3.34.178.78:3001/rooms/roomlist',
            params: {
              gameCode: cookie.load('selectedGame'),
            },
            withCredentials: true,
            params: {
              gameCode: cookie.load('selectedGame'),
            },
          });
          cb(response.data);
          dispatch({ type: 'GET_ROOMS', payload: response.data });
        }
      } catch (err) {
        console.log(err);
      }
    },
    makeRooms: function () {
      dispatch({ type: 'MAKE_ROOM' });
    },
  };
};

export default connect(mapReduxStateToReactProps, mapReduxDispatchToReactProps)(SelectRoom);
