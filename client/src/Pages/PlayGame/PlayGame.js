import React from 'react';
import { connect } from 'react-redux';
import Game from './Game';
import MoleGame from './MoleGame';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import CardMedia from '@material-ui/core/CardMedia';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';

import user1 from '../../images/avatar.png'
import user2 from '../../images/avatar2.png'

const useStyles = makeStyles((theme) => ({
  Paper: {
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #000',
    boxShadow: theme.shadows[5],
    // padding: theme.spacing(2, 4, 3),
    width: 1000,
    height: 700,
    margin: theme.spacing(3, 3),
  },
  gameover: {
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #000',
    boxShadow: theme.shadows[5],
    // padding: theme.spacing(2, 4, 3),
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    width: 500,
    height: 200,
    margin: theme.spacing(3, 3),
  },
  userCard: {
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #000',
    boxShadow: theme.shadows[5],
    // padding: theme.spacing(2, 4, 3),
    alignItems: 'center',
    width: 200,
    height: 240,
    margin: theme.spacing(3, 3),
  },
  space: {
    display: 'flex',
    // alignItems: 'center',
    justifyContent: 'center',
  },
  user1: {
    height: 200,
    width: 200,
  },
  user2: {
    height: 200,
    width: 200,
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    // flexGrow: 1,
  },
}))

const PlayGame = ({ currentGame }) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.space}>
      <Paper style={{height: '500px'}}>
        <Game />

        
          {/* {
            currentGame === 1
            ? <MoleGame />
            : <Game />
              
            
          } */}

        
        {/* <Grid container direction="row" justify="space-evenly" alignItems="center">
          <Paper>
            <Grid item xs>
              <Typography variant="h1" color="primary">
                10
              </Typography>
              <Card style={{
                left: '10%',
                bottom: '5%',
              }} className={classes.userCard}>
                <CardMedia
                  className={classes.user1}
                  image={user1}
                />
                <Typography variant="h4">
                  오마이갇
                </Typography>
              </Card>
            </Grid>
            <Grid item xs>
            </Grid>
          </Paper>
          <Typography variant="h4">
            10:00
          </Typography>
          <Paper>
            <Grid item xs>
              <Typography variant="h1">
                6
              </Typography>
            </Grid>
            <Grid item xs>
              <Card style={{
                right: '5%',
                bottom: '5%',
              }}className={classes.userCard}>
                <CardMedia
                  className={classes.user2}
                  image={user2}
                />
                <Typography variant="h4">
                  사탕주세요
                </Typography>
              </Card>
            </Grid>
          </Paper>
        </Grid>
        <Grid container direction="row" justify="space-evenly" alignItems="center">
          <Paper type="button" onClick={handleOpen} style={{'width': '600px', 'margin-top': '30px'}}>
            <Typography variant="h4">
              기권
            </Typography>
          </Paper>
        </Grid>

        <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Paper className={classes.gameover}>
            <Grid item container direction="row" justify="center" alignItems="center">
              <Typography variant="h4">
                게임종료되었습니다
              </Typography>
              <Typography variant="h6">
                오마이갇 님이 승리하였습니다
              </Typography>
              <Grid item>
              <Typography variant="h2">
                {
                  
                }
              </Typography>

              </Grid>
            </Grid>
          </Paper>
        </Fade>
      </Modal> */}
      </Paper>
    </div>
  );
};

function mapReduxStateToReactProps(state) {
  return {
    currentGame: state.currentGame.currentGame,
  };
}

export default connect(mapReduxStateToReactProps)(PlayGame);
