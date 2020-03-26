import React, { Component } from 'react'
import ReactPlayer from 'react-player'
 
export default function Player(props) {

    return (
    	<div className="player">
    		<ReactPlayer url={props.url} onEnded={props.playNextSong} playing />
    	</div>
    )

}