import React, { useState } from 'react';
import {
  Fab,
  Grid,
  Paper,
  Button,
  Tooltip,
  Typography,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RefreshIcon from '@material-ui/icons/Refresh';
import cookie from 'react-cookies';

const axios = require('axios');

const mobileStyle = {
  emptyRoomGrid: {
    marginTop: '1vw',
    height: '100vw',
  },
  emptyRoomCard: {
    width: '100vw',
    height: '100vw',
  },
  emptyRoomText: {
    margin: '5vw',
    fontSize: '20px',
  },
  emptyRoomPracticeButton: {
    width: '150px',
    height: '50px',
    marginTop: '7vw'
  },
}

function EmptyRoom ({ makeRooms, getRooms, refreshRoomList, history }) {

  return (
    <Grid
    container
    direction='column'
    justify='flex-start'
    alignItems='center'
    style={mobileStyle.emptyRoomGrid}
  >
    <Paper style={mobileStyle.emptyRoomCard}>
      <Typography style={mobileStyle.emptyRoomText}>
        대기중인 방이 없습니다.
        <br />
        방을 생성해보세요
      </Typography>
      <Grid container direction='row' justify='center' alignItems='center'>
        <Tooltip title='방만들기' aria-label='add' onClick={() => makeRooms()} style={{marginRight: '10vw'}}>
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
      <Button disableElevation variant="contained" style={mobileStyle.emptyRoomPracticeButton}
        onClick={() => history.push('/playgame')}
      >
        <Typography style={{fontSize: '20px'}}>
          연습하기
        </Typography>
      </Button>
    </Paper>
  </Grid>
  )
}



export default EmptyRoom;
  