import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import AuthorizedCharacters from './components/AuthorizedCharacters';
import CharacterDetails from './components/CharacterDetails';
import CharacterHistory from './components/CharacterHistory';
import CharacterSearchForm from './components/CharacterSearchForm';
import Header from './components/Header';
import { fetchAuthorizedChars } from './store/characters';
import { setToken, setAuthorizedToken } from './store/session';
import './styles/App.scss';

function App() {
	const dispatch = useDispatch();
	const [searchParams, setSearchParams] = useSearchParams();
	const code = searchParams.get('code')
	const authorizedChars = useSelector((state) => state.session.authorizedChars);
	const authorized = useSelector((state) => state.session.authorized);
	const authScope = useSelector((state) => state.session.scope);
	const oAuth = useSelector((state) => state.session.oAuth);


	// Retrieve oAuth access token on initial app load
	// Request routed to python server to protect Blizzard credentials
	useEffect(
		() => {
			async function authorize() {
				if (code) {
					const res = await fetch(`/blizz_auth?code=${code}`);
					const parsed = await res.json();
					const {access_token, scope, id_token, account_name} = parsed;
					if (access_token) {
						dispatch(setAuthorizedToken({access_token, scope, id_token, account_name}));
						setSearchParams({})
						return;
					}
				}
				const res = await fetch('/blizz_auth');
				const parsed = await res.json();
				dispatch(setToken(parsed.access_token));
			}
			authorize();
		},
		[ setSearchParams, dispatch, code ]
	);
	
	// Retrieve oAuth access token on initial app load
	// Request routed to python server to protect Blizzard credentials
	useEffect(
		() => {
			if (authScope?.includes('wow.profile') && !authorizedChars.length){
				dispatch(fetchAuthorizedChars(oAuth));
			}
		},
		[ dispatch, authScope, authorizedChars, oAuth ]
	);

	return (
		<div className='app'>
			<Header />
			<div className='main-content'>
				<nav className='character-nav'>
					<CharacterSearchForm />
					<CharacterHistory />
					{ authorized && <AuthorizedCharacters /> }
				</nav>
				<CharacterDetails />
			</div>
		</div>
	);
}

export default App;
