import React from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import ReadyBtn from '../ReadyBtn';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    minHeight: 200,
    margin: 15,
  },
  avatar: {
    maxWidth: 100,
    maxHeight: 100,
  },
});

function Users({ user, readyHandler, avatar }) {
  const classes = useStyles();

  return (
    <Card className={classes.root} variant='outlined'>
      <CardContent>
        <img src={avatar[user.userInfo.avatar]} alt='user avatar' className={classes.avatar} />
        <Typography variant='h5' component='h2'>
          {user.userInfo.username}
        </Typography>
      </CardContent>
      <ReadyBtn
        isReady={user.userInfo.isReady}
        readyHandler={readyHandler}
        username={user.userInfo.username}
      />
    </Card>
  );
}

const mapStateToProps = (state) => {
  return {
    avatar: state.login.avatar,
  };
};

export default connect(mapStateToProps)(Users);
