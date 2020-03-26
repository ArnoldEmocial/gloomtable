import React from 'react';
import config from './config';
import io from 'socket.io-client';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import BottomBar from './BottomBar';
import ReactPlayer from 'react-player';
import Player from './Player';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chat: [],
      content: '',
      name: '',
      songs: []
    };
  }

  componentDidMount() {
    this.socket = io(config[process.env.NODE_ENV].endpoint);

    // Load the last messages in the window.
    this.socket.on('init', (data) => {
      this.setState((state) => ({
        chat: [...state.chat, ...data.messages.reverse()],
        songs: [...state.songs, ...data.songs]
      }), this.scrollToBottom);

    });

    // Update the chat if a new message is broadcasted.
    this.socket.on('pushMessage', (msg) => {
      this.setState((state) => ({
        chat: [...state.chat, msg],
      }), this.scrollToBottom);
    });

    // Update the queue if a new song is broadcasted.
    this.socket.on('pushSong', (sg) => {
      this.setState((state) => ({
        songs: [...state.songs, sg],
      }), this.scrollToBottom);
    });

    this.socket.on('destroySong', (sg) => {
      this.setState((state) => ({
        songs: sg,
      }), this.scrollToBottom);
    });

  }

  removeFromChat(event){
    console.log(event);

    // Prevent the form to reload the current page.
    event.preventDefault();

    this.setState((state) => {
      console.log(state);
      console.log('this', this.socket);
      // Ask server to delete first message
      this.socket.emit('deleteMessage', {
        name: state.chat[0].name,
        content: state.chat[0].content,
      });

      // Update the chat and remove the deleted message.
      return {
        chat: state.chat.slice(1)
      };
    }, this.scrollToBottom);
  }

  // Save the message the user is typing in the input field.
  handleContent(event) {
    this.setState({
      content: event.target.value,
    });
  }

  //
  handleName(event) {
    this.setState({
      name: event.target.value,
    });
  }

  // When the user is posting a new message.
  handleSubmit(event) {
    console.log(event);

    // Prevent the form to reload the current page.
    event.preventDefault();

    ReactPlayer.canPlay(this.state.content) ? this.newSong() : this.newMessage()
  }

  newMessage(){
    this.setState((state) => {
      // Send the new message to the server.
      this.socket.emit('message', {
        name: state.name,
        content: state.content,
      });

      // Update the chat with the user's message and remove the current message.
      return {
        chat: [...state.chat, {
          name: state.name,
          content: state.content,
        }],
        content: '',
      };
    }, this.scrollToBottom);
  }

  newSong(){
    this.setState((state) => {
      // Send the new song to the server.
      this.socket.emit('song', {
        position: state.songs.length + 1,
        url: state.content,
      });

      // Update the chat with the user's message and remove the current message.
      return {
        songs: [...state.songs, {
          position: state.songs.length + 1,
          url: state.content,
        }],
        content: '',
      };
    }, this.scrollToBottom);
  }

  // Always make sure the window is scrolled down to the last message.
  scrollToBottom() {
    const chat = document.getElementById('chat');
    chat.scrollTop = chat.scrollHeight;
  }

  playNextSong(){
    this.setState((state) => {
      // delete first song
      this.socket.emit('deleteSong', {
        position: state.songs[0].position,
        url: state.songs[0].url,
      });

      return {
        songs: state.songs.slice(1)
      };
    }, this.scrollToBottom);
  }

  render() {
    return (
      <div className="App">
        <Paper id="chat" elevation={3}>
          {this.state.chat.map((el, index) => {
            return (
              <div key={index}>
                <Typography variant="caption" className="name">
                  {el.name}
                </Typography>
                <Typography variant="body1" className="content">
                  {el.content}
                </Typography>
              </div>
            );
          })}
        </Paper>
        <Paper id="queue" elevation={3}>
          {this.state.songs.map((el, index) => {
            return (
              <div key={index}>
                <Typography variant="caption" className="name">
                  {el.position}
                </Typography>
                <Typography variant="body1" className="content">
                  {el.url}
                </Typography>
              </div>
            );
          })}
        </Paper>
        {this.state.songs[0] !== undefined ? 
          <Player url={this.state.songs[0].url} playNextSong={this.playNextSong.bind(this)}/> :
          ""
        }

        <BottomBar
          content={this.state.content}
          handleContent={this.handleContent.bind(this)}
          handleName={this.handleName.bind(this)}
          handleSubmit={this.handleSubmit.bind(this)}
          name={this.state.name}
        />
      </div>
    );
  }
};

export default App;