import React from 'react';

/* Components */
import { ListGroup, ListGroupItem, Button } from 'reactstrap';
import LoadingSpinner from '../LoadingSpinner';

/* Methods */
import { extractTimeSchedule, extractRoomSchedule } from '../../util/helpers';

const ScheduleDisplay = ({
  booked,
  choice,
  timeIndex,
  roomIndex,
  uploadOnIpfs,
  uploadingOnIpfs
}) => {
  const concernedSchedule = choice === 'byTime' && timeIndex !== null ? (
    extractTimeSchedule(booked, timeIndex)
  ) : choice === 'byRoom' && roomIndex !== null ? (
    extractRoomSchedule(booked, roomIndex)
  ) : '';
  const list = concernedSchedule === '' ? '' : concernedSchedule.map(book => (
    <ListGroupItem key={`schedule-${choice}-${book.indexInfo}`}>
      <strong>{book.indexInfo}</strong> -- <strong>{book.name}</strong>
    </ListGroupItem>
  ));
  const uploadBtn = uploadingOnIpfs ? (
    <LoadingSpinner />
  ) : (
    <Button
      className='ipfs-uploader'
      onClick={e => uploadOnIpfs(e, concernedSchedule)}
    >
      Upload on IPFS
    </Button>
  );
  const display = roomIndex === null && timeIndex === null ? '' : list.length === 0 ? (
    <div>
      There are not any booking yet.
    </div>
  ) : (
    <div>
      <ListGroup>
        {list}
      </ListGroup>
      {uploadBtn}
    </div>
  );
  return display;
}

export default ScheduleDisplay;
