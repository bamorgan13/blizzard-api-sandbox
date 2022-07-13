import React, { useEffect } from 'react';
import ReactTooltip from '@huner2/react-tooltip';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRaidData } from '../store/raids';
import '../styles/DetailIndexItem.scss';
import '../styles/RaidInstanceIndexItem.scss';

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

	// If we've fetched the additional raid data, we can show the media, otherwise
	// we use only have the basic data passed from props.
	return (
    <div className='instance-container'>
      { raid && 
        <a href={`https://www.wowhead.com/${raid.wowheadTitle}`} target='_blank' rel='noreferrer' className='index-link'>
          <img data-tip={'Wowhead article for ' + name} src={raid.media.href} alt={name} className='index-img raid' />
          <ReactTooltip place='top' effect='solid' />
        </a>
      }
      <p className='index-name'>{name}</p>
      {Object.entries(modes).map(([modeName, mode]) => {
        return <p key={modeName} className={mode.status}>{modeName} - {mode.progress.completed}/{mode.progress.total}</p>
      })}
    </div>
	);
}

export default RaidInstanceIndexItem;
