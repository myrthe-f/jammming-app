import React from 'react';
import Tracklist from '../Tracklist/Tracklist.js';
import './Playlist.css';

class Playlist extends React.Component {

	constructor(props) {

		super(props);
		this.onNameChange=this.onNameChange.bind(this);

	}

	onNameChange(event) {
		this.props.onNameChange(event.target.value);
	}

	render() {
		return (
			<div className="Playlist">
				<input onChange={this.onNameChange} defaultValue={this.props.playlistName} />
				<Tracklist tracks={this.props.playlistTracks} />
			    <a onClick={this.props.onSave} className="save-playlist">SAVE TO SPOTIFY</a>
			</div>
			)
	}
}

export default Playlist;