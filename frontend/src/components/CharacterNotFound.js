import React from 'react';

import '../styles/CharacterNotFound.scss';

function CharNotFound() {
	return (
		<div className='no-char border none'>
			<h3>Character Not Found</h3>
			<p>Check character spelling and selected Realm</p>
			<br />
			<br />
			<h3>Don't have a World of Warcraft character?</h3>
			<p>Try clicking the "Random Character" button!</p>
		</div>
	);
}

export default CharNotFound;
