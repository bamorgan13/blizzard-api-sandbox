import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRaids } from '../store/raids';

function CharacterRaids() {
	const dispatch = useDispatch();
	const currentCharKey = useSelector((state) => state.session.currentChar);
	const currentChar = useSelector((state) => state.characters[currentCharKey]);
	const charRaids = useSelector((state) => state.raids[currentCharKey]);
	const oAuth = useSelector((state) => state.session.oAuth);

	useEffect(
		() => {
			// Prevents refetching of raids if already present in Redux store
			if (!charRaids) {
				dispatch(fetchRaids(currentChar.region, currentChar.realm.slug, currentChar.name.toLowerCase(), oAuth));
			}
		},
		[ dispatch, oAuth, currentChar, charRaids ]
	);

	// // If a user has submitted content in the textbox, filter raids by names that include that content
  if (charRaids) console.log(charRaids);
	return (
		<div className='raid-details border'>
			<header>Raid Details</header>
			{charRaids ? (
				<>
				<ul>
          {Object.entries(charRaids).map(([expansionName, expansion]) => {
            return <li key={expansion.id || expansionName}>
              <div>
                <p>{expansionName}</p>
                { expansion.instances ? 
                  <ul>
                    {Object.entries(expansion.instances).map(([instanceName, instance]) => {
                      return <li key={instance.id}>
                        <div>
                          <p>{instanceName}</p>
                          <div>
                            {Object.entries(instance.modes).map(([modeName, mode]) => {
                              return <p key={modeName}>{modeName} - {mode.progress.completed}/{mode.progress.total}</p>
                            })}
                          </div>
                        </div>
                      </li>
                    })}
                  </ul> : null
                }
              </div>
            </li>
          })}
				</ul>
				</>
			) : (
				<p>Fetching Raids...</p>
			)}
		</div>
	);
}

export default CharacterRaids;
