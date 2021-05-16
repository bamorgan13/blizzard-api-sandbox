import React from 'react';
import '../styles/Header.scss';

function Header() {
	return (
		<header className='app-header'>
			<h1>Blizz Sandbox - Wowhead Demo</h1>
			<ul className='header-links-list'>
				<li>
					<div className='header-links-list-header'>
						<p>Created by Bryce Morgan</p>
						<p>Connect with me:</p>
					</div>
				</li>
				<li>
					<a href='https://www.linkedin.com/in/bryce-morgan-a8792138/'>
						<div className='logo linkedin' alt='linkedin' />
					</a>
				</li>
				<li>
					<a href='https://angel.co/bryce-morgan-1'>
						<div className='logo angellist' alt='angellist' />
					</a>
				</li>
				<li>
					<a href='https://github.com/bamorgan13'>
						<div className='logo github' alt='github' />
					</a>
				</li>
				<li>
					<a href='mailto:bamorgan13@gmail.com'>
						<div className='logo email' alt='email' />
					</a>
				</li>
			</ul>
		</header>
	);
}

export default Header;
