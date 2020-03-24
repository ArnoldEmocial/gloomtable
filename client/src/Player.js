import React, { Component } from 'react'
import ReactPlayer from 'react-player'
 
export default function Player(props) {

    return (
    	<div className="disabled player">
    		Now Playing
    		<ReactPlayer url={props.url} playing />
    	</div>
    )

}