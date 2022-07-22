import React, { useEffect } from 'react';
import ReactTooltip from '@huner2/react-tooltip';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInstanceData } from '../store/instances';
import fallbackIcon from '../images/logos/wow-icon.png';
import '../styles/DetailIndexItem.scss';
import '../styles/InstanceIndexItem.scss';

function InstanceIndexItem({ instance: { id, name, modes }, type}) {
	const dispatch = useDispatch();
	const oAuth = useSelector((state) => state.session.oAuth);
	const instance = useSelector((state) => state[type + 's'][id]);

	useEffect(
		() => {
			if (!instance) {
				dispatch(fetchInstanceData(id, oAuth, type));
			}
		},
		[ instance, type, id, oAuth, dispatch ]
	);

  function useFallbackIcon(error) {
    error.target.src = fallbackIcon;
    error.target.onError = null; 
    console.error(`World of Warcraft Game Data API provided an invalid media link for ${name}. Using fallback WoW icon.`)
  }

	// If we've fetched the additional instance data, we can show the media, otherwise
	// we use only have the basic data passed from props.
	return (
    <div className='instance-container'>
      { instance && 
        <a href={`https://www.wowhead.com/${instance.wowheadTitle}`} target='_blank' rel='noreferrer' className='index-link'>
          <img data-tip={'Wowhead article for ' + name} src={instance.media.href} alt={name} className={'index-img ' + type} onError={useFallbackIcon}/>
          <ReactTooltip place='top' effect='solid' />
        </a>
      }
      <p className='index-name'>{name}</p>
      {Object.entries(modes).map(([modeName, mode]) => {
        return (
          type === 'raid' ? 
            <p key={modeName} className={mode.status.toLowerCase()}>{modeName} - {mode.progress.completed}/{mode.progress.total}</p> 
          : 
            <React.Fragment key={modeName}>
              <p className={mode.status.toLowerCase()} data-tip={'Last ' + modeName + ' kill: ' + mode.lastKill}>
                {modeName} - {mode.completedCount} Completion{mode.completedCount > 1 ? 's' : ''}
              </p>
              <ReactTooltip place='top' effect='solid' />
            </React.Fragment>
        )
      })}
    </div>
	);
}

export default InstanceIndexItem;
