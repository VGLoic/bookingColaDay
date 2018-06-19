// Used to transform X into 0X if X < 10
export const reform = num => {
  if (num < 10) {
    return `0${num}`;
  } else {
    return num;
  }
}

// extract and reform the schedule for a particular time slot
export const extractTimeSchedule = (booked, timeIndex) => {
  return booked[timeIndex].map(book => ({
    name: book.name,
    indexInfo: `C${reform(book.roomIndex)}`
  }));
}

// extract and reform the schedule for a particular room
export const extractRoomSchedule = (booked, roomIndex) => {
  let roomSchedule = [];
  booked.forEach((timeSchedule, timeIndex) => {
    timeSchedule.forEach(book => {
      if (book.roomIndex === roomIndex) {
        roomSchedule.push({
          name: book.name,
          indexInfo: `${reform(8+timeIndex)}:00 - ${reform(9+timeIndex)}:00`
        });
      }
    })
  })
  return roomSchedule;
}
