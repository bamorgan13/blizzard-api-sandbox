import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons'
import RaidInstanceIndexItem from './RaidInstanceIndexItem';

function RaidExpansionDropdown({expansion, expansionName}) {
	const [ isOpen, setIsOpen ] = useState(false);

  const caret = isOpen ? faCaretDown : faCaretRight;

	return (
    <li className={'index-item border'.concat(isOpen ? ' open' : '')}>
      <div className='index-shadow raid'>
        <div className='title-container' onClick={() => setIsOpen(!isOpen)}>
          <FontAwesomeIcon className='caret' icon={caret} />
          <p className='index-name'>{expansionName}</p>
        </div>
        { isOpen && ( expansion.instances ? 
          <div className='expansion-instance-container'>
            { 
              Object.entries(expansion.instances).map(([instanceName, instance]) => {
                return (
                  <RaidInstanceIndexItem key={instanceName} instance={instance}/>
                )
              })
            }
          </div> 
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
