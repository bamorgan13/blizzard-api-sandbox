import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectIndexData } from '../store/selectors';
import { setCurrentChar } from '../store/session';
import '../styles/CharacterHistory.scss';

function CharacterHistory() {
	const dispatch = useDispatch();
	const previousChars = useSelector((state) => selectIndexData(state));
	return (
		<div className='char-history'>
			<h3>Previously Viewed</h3>
			<ul className='char-history-list'>
				{previousChars.map((char) => (
					<li key={char.charKey} className='char-history-list-item'>
						<button onClick={() => dispatch(setCurrentChar(char.charKey))}>
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
