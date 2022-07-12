import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRaidData } from '../store/raids';
import '../styles/DetailIndexItem.scss';

function RaidInstanceIndexItem({ instance: { id, name, modes } }) {
	const dispatch = useDispatch();
	const oAuth = useSelector((state) => state.session.oAuth);
	const raid = useSelector((state) => state.raids[id]);

	useEffect(
		() => {
			if (!raid) {
				dispatch(fetchRaidData(id, oAuth));
			}
		},
		[ raid, id, oAuth, dispatch ]
	);

	// If we've fetched the additional mount data, we can show the media, otherwise
	// we use only have the basic data passed from props.
	return (
    <li>
      <div className='index-shadow'>
        <p className='index-name'>{name}</p>
        <div>
          {raid && <img src={raid.media.href} alt={name} className='index-img mount' />}
          {Object.entries(modes).map(([modeName, mode]) => {
            return <p key={modeName}>{modeName} - {mode.progress.completed}/{mode.progress.total}</p>
          })}
        </div>
      </div>
    </li>
	);
}

export default RaidInstanceIndexItem;
