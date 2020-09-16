import React, { useState, useEffect } from 'react';
import {
  Fab,
  Grid,
  Paper,
  Button,
  Tooltip,
  Typography,
  Card,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RefreshIcon from '@material-ui/icons/Refresh';
import cookie from 'react-cookies';

const axios = require('axios');

const mobileStyle = {
  Grid: {
    marginTop: '3vw',
    // height: '400px',
  },
  Card: {
    width: '100vw',
    height: '100vw',
  },
  Text: {
    margin: '15vw 0 20px 0',
    fontSize: '20px',
  },
  Button: {
    marginRight: '50px',
  },
  PracticeButton: {
    width: '150px',
    height: '50px',
    marginTop: '40px'
  },
  PracticeButtonFont: {
    fontSize: '20px',
  },
}

const laptopStyle = {
  Grid: {
    marginTop: '1vw',
    height: '100vw',
  },
  Card: {
    width: '500px',
    height: '500px',
  },
  Text: {
    margin: '120px 0 20px 0',
    fontSize: '20px',
  },
  Button: {
    marginRight: '50px',
  },
  PracticeButton: {
    width: '150px',
    height: '50px',
    marginTop: '40px'
  },
  PracticeButtonFont: {
    fontSize: '20px',
  },
}

function EmptyRoom ({ makeRooms, getRooms, refreshRoomList, history }) {
  const [styleName, setStyleName] = useState({});

  useEffect(() => {
    resize();
    window.addEventListener('resize', resize, false);
    return () => {
      window.removeEventListener('resize', resize, false);
    }
  }, [styleName])

  const resize = () => {
    if (window.innerWidth > 750) {
      setStyleName(laptopStyle);
    } else {
      setStyleName(mobileStyle);
    }
  };


  return (
    <Grid container direction='column' justify='flex-start' alignItems='center' style={styleName.Grid}>
      <Card style={styleName.Card}>
        <Typography style={styleName.Text}>
          대기중인 방이 없습니다.
          <br />
          방을 생성해보세요
        </Typography>
        <Grid container direction='row' justify='center' alignItems='center'>
          <Tooltip title='방만들기' aria-label='add' onClick={() => makeRooms()} style={styleName.Button}>
            <Fab color='secondary'>
              <AddIcon/>
            </Fab>
          </Tooltip>
          <Tooltip title='새로고침' aria-label='add' onClick={() => refreshRoomList()}>
            <Fab color='primary'>
              <RefreshIcon />
            </Fab>
          </Tooltip>
        </Grid>
        <Button disableElevation variant="contained" style={styleName.PracticeButton}
          onClick={() => history.push('/playgame')}
        >
          <Typography style={styleName.PracticeButtonFont}>
            연습하기
          </Typography>
        </Button>
      </Card>
    </Grid>
  )
}



export default EmptyRoom;
  