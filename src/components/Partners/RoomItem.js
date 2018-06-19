import React from 'react';

/* Methods */
import { reform } from '../../util/helpers';

/* Components */
import { Button } from 'reactstrap';

const RoomItem = ({
  hasBooked,
  roomIndex,
  timeIndex,
  handleBooking,
  targetIsOwner
}) => {
  const button = hasBooked || !targetIsOwner ? (
    <Button
      disabled
      color='info'
    >
      C{reform(roomIndex + 1)}
    </Button>
  ) : (
    <Button
      color='info'
      onClick={e => handleBooking(e, roomIndex, timeIndex)}
    >
      C{reform(roomIndex + 1)}
    </Button>
  );
  return button;
}

export default RoomItem;
