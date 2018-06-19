import React, { Component } from 'react';

/* Components */
import { Container, Row, Col } from 'reactstrap';
import SchedulesGrid from './SchedulesGrid';
import LoadingItem from '../../components/LoadingItem';

/* Methods */
import { connect } from 'react-redux';
import { setJSON } from '../../util/ipfsHelpers';
import { fetchBookingState } from '../../store/actions/booking';

class CokeHandler extends Component {
  constructor(props) {
    super(props);
    this.state = {
      choice: '',
      timeIndex: null,
      roomIndex: null,
      ipfsHash: null,
      uploadingOnIpfs: false
    };
  }

  componentDidMount() {
    this.props.fetchBookingState('Coca');
  }

  chooseTime = e => {
    e.preventDefault();
    this.setState({ choice: 'byTime', roomIndex: null, timeIndex: null });
  }

  chooseTimeIndex = (e, timeIndex) => {
    e.preventDefault();
    this.setState({ timeIndex, roomIndex: null });
  }

  chooseRoom = e => {
    e.preventDefault();
    this.setState({ choice: 'byRoom', roomIndex: null, timeIndex: null });
  }

  chooseRoomIndex = (e, roomIndex) => {
    e.preventDefault();
    this.setState({ roomIndex, timeIndex: null });
  }

  uploadOnIpfs = (e, obj) => {
    e.preventDefault();
    this.setState({ uploadingOnIpfs: true });
    setJSON(obj).then(hash => {
      console.log(hash);
      this.setState({ ipfsHash: hash, uploadingOnIpfs: false });
    });
  }

  render() {
    const { booking } = this.props;
    const { choice, timeIndex, roomIndex, ipfsHash, uploadingOnIpfs } = this.state;
    const bookingDisplay = booking.isLoading ? (
      <LoadingItem />
    ) : (
      <SchedulesGrid
        booked={booking.bookedSchedules}
        uploadOnIpfs={this.uploadOnIpfs}
        chooseTime={this.chooseTime}
        chooseTimeIndex={this.chooseTimeIndex}
        chooseRoom={this.chooseRoom}
        chooseRoomIndex={this.chooseRoomIndex}
        choice={choice}
        timeIndex={timeIndex}
        roomIndex={roomIndex}
        uploadingOnIpfs={uploadingOnIpfs}
      />
    );
    const hashLink = ipfsHash ? (
      <div>
        You have successfully uploaded your file on IPFS <br/>
        Click <a className='ipfs-link' href={`https://ipfs.io/ipfs/${ipfsHash}`} download={`schedule-${choice}`}>here</a> to retrieve it
      </div>
    ) : '';
    return (
      <Container className='text-center coke-handler'>
        <Row>
          <Col xs='6'>
            <div className='welcome-message'>
              <h3>
              Welcome Home!
              </h3>
            </div>
          </Col>
          <Col xs='6' className='export-schedule text-center'>
            {hashLink}
          </Col>
        </Row>
        {bookingDisplay}
      </Container>
    )
  }
}

function mapStateToProps(state) {
  return {
    booking: state.booking
  }
}

export default connect(mapStateToProps, { fetchBookingState })(CokeHandler);
