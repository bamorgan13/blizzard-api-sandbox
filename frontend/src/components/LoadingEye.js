import React from 'react';
import '../styles/LoadingEye.scss';
import loadingEye from '../images/loading-eye.gif';

function LoadingEye({loadingMessage}) {
  return (
    <div className='loading-container'>
      <img className='loading-eye' src={loadingEye} alt='loading'/>
      <p className='loading-text'>{loadingMessage}</p>
    </div>
  )
}

export default LoadingEye;
