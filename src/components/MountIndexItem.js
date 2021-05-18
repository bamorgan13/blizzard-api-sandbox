import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMountData } from '../store/mounts.js';
import '../styles/MountIndexItem.scss';

function MountIndexItem({ mount: { id, href } }) {
	const dispatch = useDispatch();
	const oAuth = useSelector((state) => state.session.oAuth);
	const mount = useSelector((state) => state.mounts[id]);

	useEffect(
		() => {
			if (!mount) {
				dispatch(fetchMountData(href, oAuth));
			}
		},
		[ mount, href, oAuth, dispatch ]
	);

	return mount ? (
		<div className={`mount-detail ${mount.faction}`}>
			<img src={mount.media.href} alt={mount.name} className='mount-img' />
			<a href={`https://www.wowhead.com/mount/${mount.id}`} className='mount-link'>
				{mount.name}
			</a>
		</div>
	) : (
		<p>"Fetching Mount...</p>
	);
}

export default MountIndexItem;
