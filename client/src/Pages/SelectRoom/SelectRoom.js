import React from 'react';
import { connect } from 'react-redux';
import cookie from 'react-cookies';
import { useHistory } from 'react-router-dom';

import { 
  Tab,
  Tabs,
  Paper,
  makeStyles,
} from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';
import RefreshIcon from '@material-ui/icons/Refresh';
import FitnessCenterIcon from '@material-ui/icons/FitnessCenter';
import MenuIcon from '@material-ui/icons/Menu';

import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';

import RoomList from '../../Components/SelectRoom/RoomList';
import EmptyRoomList from '../../Components/SelectRoom/emptyRoom';
import GameDescList from '../../Components/SelectRoom/GameDesc';


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
  root: {
    padding: theme.spacing(8, 0, 0, 0),
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  speedDial: {
    position: 'absolute',
    '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
    '&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
      top: theme.spacing(2),
      left: theme.spacing(2),
    },
  },
}));

function SelectRoom({ login, getRooms, makeRooms }) {
  const classes = useStyles();
  const history = useHistory();
  const [currentGame, selectedGame] = React.useState(0);
  const [rooms, getRoomList] = React.useState([{}]);
  const [open, setOpen] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };


  React.useEffect(() => {
    getRooms(getRoomList);
    selectedGame(Number(cookie.load('selectedGame')));
  }, [currentGame]);

  const handleChange = (event, newValue) => {
    selectedGame(newValue);
    cookie.save('selectedGame', newValue, { path: '/' });
  };

  const refreshRoomList = () => {
    getRooms(getRoomList);
  };

  const actions = [
    { 
      icon: <RefreshIcon />, 
      name: '새로고침', 
      callback: refreshRoomList 
    },
    { 
      icon: <AddIcon />, 
      name: '방만들기', 
      callback: makeRooms 
    },
    { 
      icon: <FitnessCenterIcon />, 
      name: '연습모드', 
      callback: () => history.push('/playgame') 
    },
  ];

  return (
    <>
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
      {cookie.load('selectedGame') === '0' ? (  // 게임설명 페이지
        <GameDescList />
      ) : rooms[0] === undefined ? ( // 생성된 방이 없다
        <EmptyRoomList refreshRoomList={refreshRoomList} makeRooms={makeRooms} history={history}/>
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
          <div className={classes.exampleWrapper}>
            <SpeedDial
              ariaLabel="SpeedDial"
              className={classes.speedDial}
              hidden={hidden}
              icon={<MenuIcon />}
              onClose={handleClose}
              onOpen={handleOpen}
              open={open}
            >
              {actions.map((action) => (
                <SpeedDialAction
                  key={action.name}
                  icon={action.icon}
                  tooltipTitle={action.name}
                  onClick={action.callback}
                />
              ))}
            </SpeedDial>
          </div>
        </div>
      )}
    </>
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
      console.log('refresh')
      try {
        if (cookie.load('selectedGame') !== '0') {
          const response = await axios({
            method: 'get',
            url: 'http://localhost:3001/rooms/roomlist',
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
