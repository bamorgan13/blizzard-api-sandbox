import React from 'react';
import { useSelector } from 'react-redux';
import '../styles/CharacterBasics.scss';

function CharacterBasics() {
	const currentChar = useSelector((state) => state.characters[state.session.currentChar]);
	return (
		<div className='stats'>
			<header>Character Details</header>
			<p>
				<b>Name:</b> {currentChar.name}
			</p>
			<p>
				<b>Level:</b> {currentChar.level}
			</p>
			<p>
				<b>Faction:</b> {currentChar.faction}
			</p>
			<p>
				<b>Gender:</b> {currentChar.gender}
			</p>
			<p>
				<b>Race:</b> {currentChar.race}
			</p>
			<p>
				<b>Spec:</b> {currentChar.spec}
			</p>
			<p>
				<b>Class:</b> {currentChar.class}
			</p>
			<p>
				<b>Equipped Item Level:</b> {currentChar.ilvl}
			</p>
			<p>
				<b>Guild:</b> {currentChar.guild}
			</p>
			<p>
				<b>Last Login:</b> {currentChar.lastLogin}
			</p>
		</div>
	);
}

export default CharacterBasics;
