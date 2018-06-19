import React, { Component } from 'react';

/* Method */
import { reform } from '../../util/helpers';

/* Component */
import {
  Col,
  Card,
  CardBody,
  CardHeader,
  CardSubtitle,
  Collapse
} from 'reactstrap';
import RoomsHandler from './RoomsHandler';

class ScheduleItem extends Component {
  constructor(props) {
    super(props);
    this.state = { collapse: false };
  }

  toggle = e => {
    e.preventDefault();
    this.setState(prevState => ({
      collapse: !prevState.collapse
    }));
  }

  render() {
    const { freeRooms, timeIndex, handleBooking, hasBooked, targetIsOwner } = this.props;
    return (
      <Col sm='4' xs='12' className='schedule-item' >
        <Card>
          <CardHeader onClick={this.toggle}>
            <strong>{reform(8 + timeIndex)}:00 - {reform(9 + timeIndex)}:00</strong>
          </CardHeader>
          <CardBody >
            <CardSubtitle> {freeRooms.length} available rooms</CardSubtitle>
            <Collapse isOpen={this.state.collapse}>
                <RoomsHandler
                  hasBooked={hasBooked}
                  freeRooms={freeRooms}
                  timeIndex={timeIndex}
                  handleBooking={handleBooking}
                  targetIsOwner={targetIsOwner}
                />
            </Collapse>
          </CardBody>
        </Card>
      </Col>
    );
  }
}

export default ScheduleItem;
