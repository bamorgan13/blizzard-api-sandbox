import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMountData } from '../store/mounts.js';
import '../styles/MountIndexItem.scss';

function MountIndexItem({ mount: { id, name, href } }) {
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
				<p className='mount-name'>{name}</p>
			</a>
		</li>
	);
}

export default MountIndexItem;
