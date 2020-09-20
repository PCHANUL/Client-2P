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
      padding: '20px',
      backgroundColor: 'white',
      broderRadius: '30px',
      marginLeft: '40px',
      width: `${width / 2}px`,
      height: `${width / 1.2}px`,
    },
    pos: {
      color: '#000',
      fontSize: `${width/15}px`,
    },
    button: {
      width: `${width / 2}px`,
      height: `${width / 2}px`,
    }
  }

  return (
    <Paper style={style.root}>
      <Grid container direction='column' justify='center' alignItems='center'>
        {!opponentUsername.length ? (
          <Button color="secondary" variant="outlined" style={style.button}  onClick={computerModeStart}>
            <Typography style={{fontSize: style.pos.fontSize}}>
              컴퓨터<br/>대결시작
            </Typography>
          </Button>
        ) : (
          <>
            <img 
              src={rivalAvatar} 
              style={{
                width: width/2,
                height: width/2.2,
              }}
            />
            <Typography style={style.pos}>
              {opponentUsername}
            </Typography>
          </>
        )}
        <Typography style={{fontSize: style.pos.fontSize * 3}}>
          {opponentScore}
        </Typography>
      </Grid>
    </Paper>
  )
}

export default RivalCard;