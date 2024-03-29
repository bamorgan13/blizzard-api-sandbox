import React from 'react';

import wowhead from '../images/logos/wowhead.png';
import blizzard from '../images/logos/blizzard.png';
import '../styles/Welcome.scss';

function Welcome() {
	return (
		<div className='welcome border'>
			<div className='intro'>
				<h3>Thanks for checking out the Blizzard API Sandbox!</h3>
				<p>
					The purpose of this application is to interface with the Blizzard World of Warcraft Game Data and Profile APIs as
					well as incorporate Wowhead tooltips.
				</p>
				<br />
				<p>This app is currently able to:</p>
				<ul className='intro-capabilities'>
					<li>Fetch realm data based off of selected region</li>
					<li>Fetch basic character information, such as level, class, avatar, etc.</li>
					<li>Display currently equipped gear, with Wowhead tooltips for each piece</li>
					<li>Display history of viewed characters to aid in caching demonstration</li>
					<li>Display collection information, including pets and mounts</li>
					<li>Display instance progression for raids and dungeons</li>
					<li>Log in with Battle.net OAuth to retrieve account characters</li>
					<li>Cache previously retrieved character and equipment data to prevent unnecessary requests</li>
					<li>Obscure developer keys behind a Flask backend</li>
				</ul>
			</div>

			<div className='future'>
				<p>Future plans for the app include:</p>
				<ul className='future-capabilities'>
					<li>Displaying character dungeon mythic+ data</li>
					<li>User account creation, database storage, and saving of favorite characters</li>
				</ul>
			</div>

			<div className='thanks'>
				<p>A huge thank you to Blizzard and Wowhead for providing the tools to make this app possible!</p>
				<div className='images-block'>
					<div className='images-container'>
						<a href='https://www.blizzard.com' target='_blank' rel='noreferrer'>
							<img className='welcome-logo' src={blizzard} alt='Blizzard' />
						</a>
						<a href='https://www.wowhead.com' target='_blank' rel='noreferrer'>
							<img className='welcome-logo' src={wowhead} alt='Wowhead' />
						</a>
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
				<br />
				<p>You may also log in to your Battle.net account to automatically fetch your account's characters.</p>
				<p>Simply click the 'Login with Battle.net' button in the upper left to be redirected to the login page.</p>
				<br />
				<h3>Don't have a World of Warcraft character?</h3>
				<p>No problem! Click the "Random Character" button in the form on the left.</p>
				<p>A random character from a few preselects will be chosen for you!</p>
			</div>
		</div>
	);
}

export default Welcome;
