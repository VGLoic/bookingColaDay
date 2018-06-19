import React from 'react';

/* Components */
import LoadingSpinner from '../LoadingSpinner';

const TransactionItem = () => (
  <div>
    <span>We are setting your operation onto the blockchain</span>
    <LoadingSpinner />
    <span>This may take a few seconds...</span>
  </div>
);

export default TransactionItem;
