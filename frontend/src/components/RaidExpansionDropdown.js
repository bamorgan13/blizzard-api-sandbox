import React, { useState } from 'react';
import RaidInstanceIndexItem from './RaidInstanceIndexItem';

function RaidExpansionDropdown({expansion, expansionName}) {
	const [ isOpen, setIsOpen ] = useState(false);

	return (
    <li className={'index-item border'.concat(isOpen ? ' open' : '')}>
      <div className='index-shadow'>
        <p className='index-name' onClick={() => setIsOpen(!isOpen)}>{expansionName}</p>
        { isOpen && ( expansion.instances ? 
          <ul>
            { 
              Object.entries(expansion.instances).map(([instanceName, instance]) => {
                return (
                  <RaidInstanceIndexItem key={instanceName} instance={instance}/>
                )
              })
            }
          </ul> 
          : 
          <div>
            <p>No raid data for this expansion</p>
          </div>
          )
        }
      </div>
    </li>
	)
}

export default RaidExpansionDropdown;
