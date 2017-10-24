import React from 'react';
import './SearchResults.css';
import Tracklist from '../Tracklist/Tracklist.js';

class SearchResults extends React.Component {
	render() {
		return (
			<div className="SearchResults">
			  <h2>Results</h2>
			  <Tracklist onAdd={this.props.onAdd} tracks={this.props.searchResults} />
			</div>
			)
	}
}

export default SearchResults;