import React from 'react';
import { useDispatch } from 'react-redux';
import ReactTooltip from '@huner2/react-tooltip';
import { clearActiveChar } from '../store/session';
import '../styles/Header.scss';

function Header() {
	const dispatch = useDispatch();

	return (
		<header data-tip={''} className='app-header'>
			<div className='header-spacer' />
			<h1
				data-tip='Return to Welcome Screen'
				onClick={() => {
					dispatch(clearActiveChar());
				}}
			>
				Blizz Sandbox - Wowhead Demo
			</h1>
			<ul className='header-links-list'>
				<li>
					<div className='header-links-list-header'>
						<p>Created by Bryce Morgan</p>
						<p>Connect with me:</p>
					</div>
				</li>
				<li>
					<a data-tip='Visit my LinkedIn Profile' href='https://www.linkedin.com/in/bryce-morgan-a8792138/'>
						<div className='logo linkedin' alt='linkedin' />
					</a>
				</li>
				<li>
					<a data-tip='Visit my personal portfolio site' href='https://www.brycemorgan.dev/'>
						<div className='logo laptop' alt='laptop' />
					</a>
				</li>
				<li>
					<a data-tip='Visit my GitHub Profile' href='https://github.com/bamorgan13'>
						<div className='logo github' alt='github' />
					</a>
				</li>
				<li>
					<a data-tip='Reach out via email' href='mailto:bamorgan13@gmail.com'>
						<div className='logo email' alt='email' />
					</a>
				</li>
			</ul>
			<ReactTooltip place='bottom' effect='solid' />
		</header>
	);
}

export default Header;
