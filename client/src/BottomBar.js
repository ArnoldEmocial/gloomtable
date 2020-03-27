import React from 'react';

import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import InputBase from '@material-ui/core/InputBase';
import Toolbar from '@material-ui/core/Toolbar';

import ChatIcon from '@material-ui/icons/Chat';
import FaceIcon from '@material-ui/icons/Face';

const useStyles = makeStyles(theme => ({
  appBar: {
    bottom: 0,
    top: 'auto',
  },
  inputContainer: {
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    borderRadius: theme.shape.borderRadius,
    position: 'relative',
    width: '100%',
  },
  icon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
    display: "flex"
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    width: '100%',
  },
}));

export default function BottomBar(props) {
  const classes = useStyles();

  let handleKeyPress = (e) => {
   if(e.keyCode === 13){
     e.target.blur(); 
    }
  }

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <div className="nameInput inputWrapper">
          <div className={classes.inputContainer}>
            <div className={classes.icon}>
              <FaceIcon />
            </div>
            <InputBase
              onChange={props.handleName}
              onBlur={props.handleNameSub}
              onKeyDown={handleKeyPress}
              value={props.name}
              placeholder="Name"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'name' }}
            />
          </div>
        </div>
        <div className="urlInput inputWrapper">
          <div className={classes.inputContainer}>
            <form onSubmit={props.handleSubmit}>
              <div className={classes.icon}>
                <ChatIcon />
              </div>
              <InputBase
                onChange={props.handleContent}
                value={props.content}
                placeholder="Type your message..."
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ 'aria-label': 'content' }}
              />
            </form>
          </div>
        </div>
      </Toolbar>
    </AppBar>
  );
}