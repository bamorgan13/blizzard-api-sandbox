import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMountData } from '../store/mounts.js';
import '../styles/MountIndexItem.scss';

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

	// The mount represents the fully populated data after the fetch for details
	// If this isn't present, we can use the basic mount name and id from props,
	// but no media will be shown.
	return mount ? (
		<li className='mount-index-item'>
			<a href={`https://www.wowhead.com/mount/${mount.id}`} className='mount-link'>
				<div className='mount-shadow'>
					<img src={mount.media.href} alt={mount.name} className='mount-img' />
					<p className='mount-name'>{mount.name}</p>
				</div>
			</a>
		</li>
	) : (
		<li className='mount-index-item'>
			<a href={`https://www.wowhead.com/mount/${id}`} className='mount-link'>
				<div className='mount-shadow'>
					<p className='mount-name'>{name}</p>
				</div>
			</a>
		</li>
	);
}

export default MountIndexItem;
