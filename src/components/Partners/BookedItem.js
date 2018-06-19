import React from 'react';

/* Method */
import { reform } from '../../util/helpers';

/* Component */
import { Button } from 'reactstrap';

const BookedItem = ({
  timeIndex,
  roomIndex,
  handleCancel
}) => {
  return (
    <div>
      <div>
        You have booked the room <strong>C{reform(roomIndex + 1)}</strong> from {reform(timeIndex + 8)}:00 to {reform(timeIndex + 9)}:00
      </div>
      <Button
        color='warning'
        onClick={e => handleCancel(e)}
      >
        Cancel the meeting
      </Button>
    </div>
  )
}

export default BookedItem;
