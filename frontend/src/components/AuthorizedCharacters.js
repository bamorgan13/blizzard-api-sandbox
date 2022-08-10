import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectIndexData } from '../store/selectors';
import { setCurrentChar } from '../store/session';
import '../styles/CharacterHistory.scss';

// AuthorizedCharacters creates buttons for each previously viewed character,
// allowing for easily displaying cached content without requiring a refetch
function AuthorizedCharacters() {
	const dispatch = useDispatch();
	const authorizedCharacters = useSelector((state) => selectIndexData(state.session.authorizedChars, state.characters));
	return (
		<div className='char-history'>
			<h3>Account Characters</h3>
			<ul className='char-history-list'>
				{authorizedCharacters.map((char) => (
					<li key={char.charKey} className='char-history-list-item'>
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
		</div>
	);
}

export default AuthorizedCharacters;
