const express = require('express');
const app = express();
const http = require('http').Server(app);
const path = require('path');
const io = require('socket.io')(http);

const uri = process.env.MONGODB_URI;
const port = process.env.PORT || 5000;

const Message = require('./Message');
const Song = require('./Song');
const mongoose = require('mongoose');

mongoose.connect(uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

io.on('connection', (socket) => {

  // Get the last messages from the database.
  Message.find().sort({createdAt: -1}).exec((err, messages) => {
    if (err) return console.error(err);
    Song.find().sort({position: 1}).exec((err, songs) => {
      if (err) return console.error(err);
      // Send the messages and songs to the user.
      socket.emit('init', {"messages": messages, "songs": songs});
    });
  });

  // Listen to connected users for a new message.
  socket.on('message', (msg) => {
    // Create a message with the content and the name of the user.
    const message = new Message({
      content: msg.content,
      name: msg.name,
    });

    // Save the message to the database.
    message.save((err) => {
      if (err) return console.error(err);
    });

    // Notify all other users about a new message.
    socket.broadcast.emit('pushMessage', msg);
  });

  socket.on('deleteMessage', (msg) => {
    // Delete a message with the content and the name of the user.
    Message.deleteOne(msg,function (err){
      if (err) return console.error(err);
    });

    // Notify all other users about a deleted message and send messages left.
    Message.find().sort({createdAt: -1}).exec((err, messages) => {
      if (err) return console.error(err);

      // Send the last messages to the user.
      socket.broadcast.emit('destroyMessage', messages);
    });
  });

  socket.on('song', (sg) => {
    // Create a message with the content and the name of the user.
    const song = new Song({
      url: sg.url,
      position: sg.position,
    });

    // Save the song to the database.
    song.save((err) => {
      if (err) return console.error(err);
    });

    // Notify all other users about a new message.
    socket.broadcast.emit('pushSong', song);

  });

  socket.on('deleteSong', (song) => {
    // Delete a message with the content and the name of the user.
    Song.deleteOne(song,function (err){
      if (err) return console.error(err);
      Song.where().updateMany({},{$inc : {position : -1}},function (er){
        if (er) return console.error(er);
      });
    });

    // Notify all other users about a deleted message and send messages left.
    Song.find().sort({position: 1}).exec((err, songs) => {
      if (err) return console.error(err);

      // Send the last messages to the user.
      socket.broadcast.emit('destroySong', songs);
    });
  });

});

http.listen(port, () => {
  console.log('listening on *:' + port);
});