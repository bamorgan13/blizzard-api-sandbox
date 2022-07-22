import React, { useEffect } from 'react';
import ReactTooltip from '@huner2/react-tooltip';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDungeonData } from '../store/dungeons';
import fallbackIcon from '../images/logos/wow-icon.png';
import '../styles/DetailIndexItem.scss';
import '../styles/InstanceIndexItem.scss';

function DungeonInstanceIndexItem({ instance: { id, name, modes } }) {
	const dispatch = useDispatch();
	const oAuth = useSelector((state) => state.session.oAuth);
	const dungeon = useSelector((state) => state.dungeons[id]);

	useEffect(
		() => {
			if (!dungeon) {
				dispatch(fetchDungeonData(id, oAuth));
			}
		},
		[ dungeon, id, oAuth, dispatch ]
	);

  function useFallbackIcon(error) {
    error.target.src = fallbackIcon;
    error.target.onError = null; 
    console.error(`World of Warcraft Game Data API provided an invalid media link for ${name}. Using fallback WoW icon.`)
  }

	// If we've fetched the additional dungeon data, we can show the media, otherwise
	// we use only have the basic data passed from props.
	return (
    <div className='instance-container'>
      { dungeon && 
        <a href={`https://www.wowhead.com/${dungeon.wowheadTitle}`} target='_blank' rel='noreferrer' className='index-link'>
          <img data-tip={'Wowhead article for ' + name} src={dungeon.media.href} alt={name} className='index-img dungeon' onError={useFallbackIcon}/>
          <ReactTooltip place='top' effect='solid' />
        </a>
      }
      <p className='index-name'>{name}</p>
      {Object.entries(modes).map(([modeName, mode]) => {
        return <React.Fragment key={modeName}>
          <p className={mode.status.toLowerCase()} data-tip={'Last ' + modeName + ' kill: ' + mode.lastKill}>
            {modeName} - {mode.completedCount} Completion{mode.completedCount > 1 ? 's' : ''}
          </p>
          <ReactTooltip place='top' effect='solid' />
        </React.Fragment>
      })}
    </div>
	);
}

export default DungeonInstanceIndexItem;
