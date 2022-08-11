import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactTooltip from '@huner2/react-tooltip';
import { clearActiveChar } from '../store/session';
import '../styles/Header.scss';

function Header() {
	const dispatch = useDispatch();
	const authorized = useSelector((state) => state.session.authorized);
	const accountName = useSelector((state) => state.session.accountName);

	const redirectURI = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_REDIRECT_URI_PRODUCTION : process.env.REACT_APP_REDIRECT_URI_DEVELOPMENT;

	return (
		<header className='app-header'>
			{
				authorized ? 
					<a className='header-auth-link' href={`https://battle.net/login/logout?ref=${redirectURI}`}>Logout {accountName}</a>
					: <a className='header-auth-link' href={`https://oauth.battle.net/authorize?client_id=720e0cff60924f55b9685927ba82d7c8&scope=${encodeURIComponent('openid wow.profile')}&response_type=code&redirect_uri=${redirectURI}`}>Login with Battle.net</a>
			}
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
