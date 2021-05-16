import React from 'react';

import wowhead from '../images/logos/wowhead.png';
import blizzard from '../images/logos/blizzard.png';
import '../styles/Welcome.scss';

function Welcome() {
	return (
		<div className='welcome'>
			<div className='intro'>
				<h3>Thanks for checking out the Blizzard API Sandbox!</h3>
				<p>
					The purpose of this application is to provide a quick demonstration of interfacing with the Blizzard API as
					well as incorporating Wowhead tooltips.
				</p>
				<br />
				<p>This app is currently able to:</p>
				<ul className='intro-capabilities'>
					<li>Fetch realm data based off of selected region</li>
					<li>Fetch basic character information, such as level, class, avatar, etc.</li>
					<li>Display currently equipped gear, with Wowhead tooltips for each piece</li>
					<li>Cache previously retrieved character and equipment data to prevent unnecessary requests</li>
					<li>Display history of viewed characters to aid in caching demonstration</li>
				</ul>
			</div>

			<div className='future'>
				<p>Future plans for the app include displaying such data as:</p>
				<ul className='future-capabilities'>
					<li>Character raid progression</li>
					<li>Character dungeon and mythic+ data</li>
					<li>Collection information, such as pets and mounts</li>
				</ul>
			</div>

			<div className='thanks'>
				<p>A huge thank you to Blizzard and Wowhead for providing the tools to make this app possible!</p>
				<div className='images-block'>
					<div className='images-container'>
						<img className='welcome-logo' src={blizzard} alt='Blizzard' />
						<img className='welcome-logo' src={wowhead} alt='Wowhead' />
					</div>
					<footer>
						Blizzard Entertainment is a trademark or registered trademark of Blizzard Entertainment, Inc., in the U.S.
						and/or other countries.
					</footer>
				</div>
			</div>

			<div className='directions'>
				<h3>Using the App</h3>
				<p>To get started with the app, select a region and realm on the left, then search for a character by name.</p>
				<p>The character's information will be displayed in this area, with a history tracked to the left.</p>
			</div>
		</div>
	);
}

export default Welcome;
