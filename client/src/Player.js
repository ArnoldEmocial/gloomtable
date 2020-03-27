import React, { Component } from 'react'
import ReactPlayer from 'react-player'
 
export default function Player(props) {

    return (
    	<div className="player">
    		<ReactPlayer className="react-player" 
    		url={props.url} onEnded={props.playNextSong} width='100%' height='100%' playing />
    	</div>
    )

}