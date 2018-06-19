import React from 'react';

/* Component */
import LoadingSpinner from './LoadingSpinner';

const LoadingItem = () => (
  <div className='loading-item text-center'>
    <div>We are retrieving data from the Ethereum blockchain</div>
    <div>This may take a few seconds...</div>
    <LoadingSpinner />
  </div>
);

export default LoadingItem;
