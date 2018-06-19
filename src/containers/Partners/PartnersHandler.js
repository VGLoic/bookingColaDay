import React, { Component } from 'react';

/* Methods */
import { connect } from 'react-redux';
import {
  VisibleOnlyHasBooked,
  VisibleOnlyHasBookedGuest,
  VisibleOnlyOnTransaction
} from '../../util/wrappers';
import { reform } from '../../util/helpers';
import { fetchBookingState, fetchEntireBookingState, book, cancel } from '../../store/actions/booking';

/* Components */
import LoadingItem from '../../components/LoadingItem';
import TransactionItem from '../../components/Partners/TransactionItem';
import SchedulesGrid from './SchedulesGrid';
import BookedItem from '../../components/Partners/BookedItem';
import { Row, Col, Container, Button } from 'reactstrap';

class PartnersHandler extends Component {

  constructor(props) {
    super(props);
    this.state = {
      targetIsOwner: true
    };
  }

  componentDidMount() {
    this.props.fetchEntireBookingState(this.props.name);
  }

  switch = e => {
    this.setState(prevState => ({
      targetIsOwner: !prevState.targetIsOwner
    }));
  }

  handleBooking = (e, roomIndex, timeIndex) => {
    e.preventDefault();
    let { name, pass } = this.props;
    this.props.book(pass, roomIndex, timeIndex)
      .then(() => this.props.fetchBookingState(name));
  }

  handleCancel = e => {
    e.preventDefault();
    let { name, pass } = this.props;
    let { roomIndex, timeIndex } = this.props.booking.userBooking;
    this.props.cancel(pass, roomIndex, timeIndex)
      .then(() => this.props.fetchBookingState(name));
  }

  render() {
    const { name, booking } = this.props;
    const BookedMessage = VisibleOnlyHasBooked(() => (
      <BookedItem
        roomIndex={booking.userBooking.roomIndex}
        timeIndex={booking.userBooking.timeIndex}
        roomIndexGuest={booking.userBooking.roomIndexGuest}
        timeIndexGuest={booking.userBooking.timeIndexGuest}
        targetIsOwner={this.state.targetIsOwner}
        handleCancel={this.handleCancel}
      />
    ));
    const BookedMessageGuest = VisibleOnlyHasBookedGuest(() => (
      <div>
        Booking with Pepsi: room <strong>C{reform(this.props.booking.userBooking.roomIndexGuest + 1)}</strong> from {reform(this.props.booking.userBooking.timeIndexGuest + 8)}:00 to {reform(this.props.booking.userBooking.timeIndexGuest + 9)}:00
      </div>
    ));
    const TransactionMessage = VisibleOnlyOnTransaction(TransactionItem);
    const bookingDisplay = booking.isLoading ? (
      <LoadingItem />
    ) : (
      <SchedulesGrid
        booking={booking}
        handleBooking={this.handleBooking}
        targetIsOwner={this.state.targetIsOwner}
      />
    );
    const switchText = this.state.targetIsOwner ? (
      <span>
        All you have to do is book a slot below <br/>
        Want to consult the availabilites with Pepsi?
        <Button className='target-is-owner-btn' onClick={this.switch}>Click here</Button>
      </span>
    ) : (
      <span>
        Want to book a room with Coke?
        <Button className='target-is-owner-btn' onClick={this.switch}>Click here</Button>
      </span>
    );
    return (
      <Container className='partners-handler'>
        <Row>
          <Col xs='5'>
            <div className='welcome-message'>
              <h4>
              Welcome {name} to the <span className='cola-day'>Cola Day</span>!
              </h4>
              <p>
                <em>Coke</em> is pleased to meet you! <br/>
                {switchText}
              </p>
            </div>
          </Col>
          <Col xs='3' className='transaction-item text-center'>
            <TransactionMessage />
          </Col>
          <Col xs='4' className='booked-item text-center'>
            <BookedMessage />
            <BookedMessageGuest />
          </Col>
        </Row>
        {bookingDisplay}
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    booking: state.booking
  }
}

export default connect(mapStateToProps, {
  fetchBookingState,
  fetchEntireBookingState,
  book,
  cancel
})(PartnersHandler);
