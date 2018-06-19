import React, { Component } from 'react';
import moment from 'moment';

class Clock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: moment()
    }
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick = () => this.setState({ date: moment()});

  render() {
    let diffInSecs = Math.floor(moment(['2018', '05', '21']).diff(this.state.date) / 1000);
    let seconds = diffInSecs % 60;
    let diffInMinutes = (diffInSecs - seconds) / 60;
    let minutes = diffInMinutes % 60;
    let diffInHours = (diffInMinutes - minutes) / 60;
    let hours = diffInHours % 24;
    let diffInDays = (diffInHours - hours) / 24;
    return (
      <div className='clock'>
        {`Event in ${diffInDays} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`}
      </div>
    )
  }
}

export default Clock;
