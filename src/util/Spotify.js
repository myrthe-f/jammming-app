
const redirectUri = 'http://localhost:3000/';
const clientId = '01ace00ee3944ee7bc53d60c63142478';

let accessToken;

const Spotify = {

	getAccessToken() {
		if (accessToken) {
			return accessToken;
		}

		const windowAccessToken = window.location.href.match(/access_token=([^&]*)/);
		const windowExpiresIn = window.location.href.match(/expires_in=([^&]*)/);

		if (windowAccessToken && windowExpiresIn) {
			accessToken = windowAccessToken[1];
			let expiresIn = Number(windowExpiresIn[1]);
			window.setTimeout(() => accessToken = '', expiresIn * 1000);
			window.history.pushState('Access Token', null, '/');
			return accessToken;

		} else {
			window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
		}
	},

	search(term) {

		let accessToken = Spotify.getAccessToken();
		let endPointUrl = 'https://api.spotify.com/v1/search?type=track&q=';
		return fetch(`${endPointUrl}${term}`, {
			headers: {
				'Authorization': `Bearer ${accessToken}`
			}
		}).then(response => {
			if(response.ok) {
				return response.json();
			}
			throw new Error('Request failed!');
		}, networkError => console.log(networkError.message)
	).then(jsonResponse => {
		if (!jsonResponse.tracks) {
			return [];
		}

		return jsonResponse.tracks.items.map(track => ({
			id: track.id,
			name: track.name,
			artist: track.artists[0].name,
			album: track.album.name,
			uri: track.uri
		}));
	});
	},

	savePlaylist(name, trackUris) {
		if (!name || !trackUris) {
			return;
		};

		let accessToken = Spotify.getAccessToken();
		let headers = { Authorization: `Bearer ${accessToken}` };
		let userId;
		let userIdUrl = 'https://api.spotify.com/v1/me';

		return fetch(userIdUrl, {
			headers: headers
		}).then(response => {
			if (response.ok) {
		    	return response.json();
		    }
		}).then(jsonResponse => {
			userId = jsonResponse.id;
		    return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
		    	headers: headers,
		    	method: 'POST',
		    	body: JSON.stringify({name: name})
		}).then(response => response.json()
		).then(jsonResponse => {
		    let playlistId = jsonResponse.id;
		    fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
		    	headers: headers,
		      	method: 'POST',
		      	body: JSON.stringify({uris: trackUris})
		    	});
			});
		});

	}

};

export default Spotify;
