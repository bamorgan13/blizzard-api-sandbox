import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMountData } from '../store/mounts.js';
import '../styles/DetailIndexItem.scss';

function MountIndexItem({ mount: { id, name } }) {
	const dispatch = useDispatch();
	const oAuth = useSelector((state) => state.session.oAuth);
	const mount = useSelector((state) => state.mounts[id]);

	useEffect(
		() => {
			if (!mount) {
				dispatch(fetchMountData(id, oAuth));
			}
		},
		[ mount, id, oAuth, dispatch ]
	);

	// If we've fetched the additional mount data, we can show the media, otherwise
	// we use only have the basic data passed from props.
	return (
		<li className='index-item border'>
			<a href={`https://www.wowhead.com/mount/${id}`} target='_blank' rel='noreferrer' className='index-link'>
				<div className='index-shadow'>
					{mount && <img src={mount.media.href} alt={name} className='index-img mount' />}
					<p className='index-name'>{name}</p>
				</div>
			</a>
		</li>
	);
}

export default MountIndexItem;
