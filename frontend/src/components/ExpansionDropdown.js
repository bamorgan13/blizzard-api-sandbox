import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons'
import RaidInstanceIndexItem from './RaidInstanceIndexItem';
import DungeonInstanceIndexItem from './DungeonInstanceIndexItem';

function ExpansionDropdown({expansion, expansionName, type}) {
	const [ isOpen, setIsOpen ] = useState(false);

  const caret = isOpen ? faCaretDown : faCaretRight;

  const InstanceIndexItem = type === 'raid' ? RaidInstanceIndexItem : DungeonInstanceIndexItem;

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
                  <InstanceIndexItem key={instanceName} instance={instance}/>
                )
              })
            }
          </div> 
          : 
          <div>
            <p>No {type} data for this expansion</p>
          </div>
          )
        }
      </div>
    </li>
	)
}

export default ExpansionDropdown;
