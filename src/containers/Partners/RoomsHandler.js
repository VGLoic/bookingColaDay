import React from 'react';

/* Components */
import RoomItem from '../../components/Partners/RoomItem';
import { Container, ButtonGroup, ButtonToolbar } from 'reactstrap';

const RoomsHandler = ({ hasBooked, freeRooms, timeIndex, handleBooking, targetIsOwner }) => {

  const firstRow = freeRooms.filter(roomIndex => roomIndex < 5).map(roomIndex => (
    <RoomItem
      key={`room-${roomIndex}-schedule-${timeIndex}`}
      hasBooked={hasBooked}
      roomIndex={roomIndex}
      timeIndex={timeIndex}
      handleBooking={handleBooking}
      targetIsOwner={targetIsOwner}
    />
  ));
  const secondRow = freeRooms.filter(roomIndex => roomIndex >= 5).map(roomIndex => (
    <RoomItem
      key={`room-${roomIndex}-schedule-${timeIndex}`}
      hasBooked={hasBooked}
      roomIndex={roomIndex}
      timeIndex={timeIndex}
      handleBooking={handleBooking}
      targetIsOwner={targetIsOwner}
    />
  ));
  return (
    <Container>
      <ButtonToolbar>
        <ButtonGroup vertical>
          <ButtonGroup>
            {firstRow}
          </ButtonGroup>
          <ButtonGroup>
            {secondRow}
          </ButtonGroup>
        </ButtonGroup>
      </ButtonToolbar>
    </Container>
  )
}

export default RoomsHandler;
