import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectIndexData } from '../store/selectors';
import { setCurrentChar } from '../store/session';
import '../styles/CharacterIndex.scss';

// CharacterHistory creates buttons for each previously viewed character,
// allowing for easily displaying cached content without requiring a refetch
function CharacterHistory() {
	const dispatch = useDispatch();
	const previousChars = useSelector((state) => selectIndexData(state.session.charHistory, state.characters));
	return (
		<div className='char-index'>
			<h3>Previously Viewed</h3>
			<ul className='char-index-list'>
				{previousChars.map((char) => (
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
		</div>
	);
}

export default CharacterHistory;
