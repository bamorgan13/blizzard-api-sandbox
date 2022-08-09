import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons'
import InstanceIndexItem from './InstanceIndexItem';

function ExpansionDropdown({expansion, expansionName, type}) {
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
              Object.entries(expansion.instances).map(([instanceName, instance]) => (
                  <InstanceIndexItem key={instanceName} instance={instance} type={type}/>
              ))
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
