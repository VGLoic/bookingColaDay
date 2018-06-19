import React from 'react';

/* Components */
import { Container, Button, ButtonGroup, ButtonToolbar } from 'reactstrap';
import BtnArray from '../../components/Coke/BtnArray';
import ScheduleDisplay from '../../components/Coke/ScheduleDisplay';

const SchedulesGrid = ({
  booked,
  uploadOnIpfs,
  chooseTime,
  chooseTimeIndex,
  chooseRoom,
  chooseRoomIndex,
  choice,
  roomIndex,
  timeIndex,
  uploadingOnIpfs
}) => {
  const btnArrays = choice === 'byTime' ? (
    <BtnArray index={timeIndex} chooseIndex={chooseTimeIndex} size={12} />
  ) : choice === 'byRoom' ? (
    <BtnArray index={roomIndex} chooseIndex={chooseRoomIndex} size={10} />
  ) : '';
  return (
    <Container className='schedules-grid text-center'>
      <h4>Display the schedule according to </h4>
      <ButtonToolbar className='room-time-choice'>
        <ButtonGroup>
          <Button
            className={choice === 'byTime' ? 'chosen' : ''}
            onClick={chooseTime}
           >
            Time
          </Button>
          <Button
            className={choice === 'byRoom' ? 'chosen' : ''}
            onClick={chooseRoom}
          >
            Room
          </Button>
        </ButtonGroup>
      </ButtonToolbar>
      {btnArrays}
      <ScheduleDisplay
        booked={booked}
        choice={choice}
        roomIndex={roomIndex}
        timeIndex={timeIndex}
        uploadOnIpfs={uploadOnIpfs}
        uploadingOnIpfs={uploadingOnIpfs}
      />
    </Container>
  )
}

export default SchedulesGrid;
