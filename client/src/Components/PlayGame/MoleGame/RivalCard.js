import React from 'react';
import cookie from 'react-cookies';
import {
  Paper,
  Grid,
  Button,
  Typography,
} from '@material-ui/core';



function RivalCard({ width, opponentUsername, opponentScore, rivalAvatar, computerModeStart }) {
  const style = {
    root: {
      backgroundColor: 'white',
      marginLeft: '40px',
      borderRadius: `${width / 10}px`,
      width: `${width / 2}px`,
      height: `${width / 1.2}px`,
      padding: `${width / 6}px`,
    },
    font: {
      fontSize: `${width/15}px`,
    },
    countFont: {
      fontSize: `${width/5}px`,
    },
    button: {
      width: `${width / 2}px`,
      height: `${width / 2}px`,
    },
    avatarImg: {
      width: width/2,
      height: width/2.2,
    }
  }

  return (
    <Paper style={style.root}>
      <Grid container direction='column' justify='center' alignItems='center'>

        {!opponentUsername.length ? (
          <Button color="secondary" variant="outlined" style={style.button}  onClick={computerModeStart}>
            <Typography style={style.font}>
              컴퓨터<br/>대결시작
            </Typography>
          </Button>
        ) : (
          <>
            <img src={rivalAvatar} style={style.avatarImg} />
            <Typography style={style.font}>
              {opponentUsername}
            </Typography>
          </>
        )}

        <Typography style={style.countFont}>
          {opponentScore}
        </Typography>
      </Grid>
    </Paper>
  )
}

export default RivalCard;