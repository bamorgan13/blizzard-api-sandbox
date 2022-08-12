import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectIndexData } from '../store/selectors';
import { setCurrentChar } from '../store/session';
import '../styles/CharacterIndex.scss';
import LoadingEye from './LoadingEye';

// AuthorizedCharacters creates buttons for each character associated with the 
// logged in user's Battle.net account
function AuthorizedCharacters({loadingAuthChars}) {
	const dispatch = useDispatch();
	const authorizedCharacters = useSelector((state) => selectIndexData(state.session.authorizedChars, state.characters));
	return (
		<div className='char-index'>
			<h3>Account Characters</h3>
			{
				loadingAuthChars ? 
					<LoadingEye loadingMessage='Fetching Account Characters...' />
					:
					<ul className='char-index-list'>
						{authorizedCharacters.map((char) => (
							<li key={char.charKey} className='char-index-list-item'>
								<button className='border' onClick={() => dispatch(setCurrentChar(char.charKey))}>
									<img src={char.avatarHref} alt={`${char.name} avatar`} />
									<div className='index-details'>
										<p className={char.class}>
											{char.name} - {char.class}
										</p>
										<p>
											{char.realm} - {char.region.toUpperCase()}
										</p>
									</div>
								</button>
							</li>
						))}
					</ul>
			}
		</div>
	);
}

export default AuthorizedCharacters;
