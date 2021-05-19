import React from 'react';
import { useDispatch } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { clearActiveChar } from '../store/session';
import '../styles/Header.scss';

function Header() {
	const dispatch = useDispatch();

	return (
		<header className='app-header'>
			<h1
				data-tip
				data-for='welcomeTip'
				onClick={() => {
					dispatch(clearActiveChar());
				}}
			>
				Blizz Sandbox - Wowhead Demo
			</h1>
			<ReactTooltip id='welcomeTip' place='bottom' effect='solid'>
				Return to Welcome Screen
			</ReactTooltip>
			<ul className='header-links-list'>
				<li>
					<div className='header-links-list-header'>
						<p>Created by Bryce Morgan</p>
						<p>Connect with me:</p>
					</div>
				</li>
				<li>
					<a data-tip data-for='linkedinTip' href='https://www.linkedin.com/in/bryce-morgan-a8792138/'>
						<div className='logo linkedin' alt='linkedin' />
					</a>
					<ReactTooltip id='linkedinTip' place='bottom' effect='solid'>
						Visit my LinkedIn Profile
					</ReactTooltip>
				</li>
				<li>
					<a data-tip data-for='personalTip' href='https://www.brycemorgan.dev/'>
						<div className='logo laptop' alt='laptop' />
					</a>
					<ReactTooltip id='personalTip' place='bottom' effect='solid'>
						Visit my personal portfolio site
					</ReactTooltip>
				</li>
				<li>
					<a data-tip data-for='githubTip' href='https://github.com/bamorgan13'>
						<div className='logo github' alt='github' />
					</a>
					<ReactTooltip id='githubTip' place='bottom' effect='solid'>
						Visit my GitHub Profile
					</ReactTooltip>
				</li>
				<li>
					<a data-tip data-for='emailTip' href='mailto:bamorgan13@gmail.com'>
						<div className='logo email' alt='email' />
					</a>
					<ReactTooltip id='emailTip' place='bottom' effect='solid'>
						Reach out via email
					</ReactTooltip>
				</li>
			</ul>
		</header>
	);
}

export default Header;
