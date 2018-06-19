import React from 'react';

/* Components */
import { Row, Container } from 'reactstrap';
import ScheduleItem from './ScheduleItem';

const SchedulesGrid = ({ booking, handleBooking, targetIsOwner }) => {
  const free = targetIsOwner ? booking.freeSchedules : booking.freeSchedulesGuest;
  const schedulesDisplay = free.map((freeRooms, index) => {
    return (
      <ScheduleItem
        key={`schedule-${index}`}
        hasBooked={booking.userBooking.hasBooked}
        freeRooms={freeRooms}
        timeIndex={index}
        handleBooking={handleBooking}
        targetIsOwner={targetIsOwner}
      />
    );
  });
  return (
    <Container className='schedules-grid'>
      <Row className='text-center'>
        {schedulesDisplay}
      </Row>
    </Container>
  )
}

export default SchedulesGrid;
