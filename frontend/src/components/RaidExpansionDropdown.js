import React, { useState } from 'react';

function RaidExpansionDropdown({expansion, expansionName}) {
	const [ isOpen, setIsOpen ] = useState(false);

	return (
    <li onClick={() => setIsOpen(!isOpen)} className={'index-item border'.concat(isOpen ? ' open' : '')}>
      <div className='index-shadow'>
        <p className='index-name'>{expansionName}</p>
        { isOpen && ( expansion.instances ? 
          <ul>
            { 
              Object.entries(expansion.instances).map(([instanceName, instance]) => {
                return (
                  <li key={instance.id}>
                    <div className='index-shadow'>
                      <p className='index-name'>{instanceName}</p>
                      <div>
                        {Object.entries(instance.modes).map(([modeName, mode]) => {
                          return <p key={modeName}>{modeName} - {mode.progress.completed}/{mode.progress.total}</p>
                        })}
                      </div>
                    </div>
                  </li>
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
