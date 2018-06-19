import React from 'react';

/* Methods */
import { reform } from '../../util/helpers';

/* Components */
import { Button, ButtonGroup, ButtonToolbar } from 'reactstrap';

const BtnArray = ({ index, chooseIndex, size }) => {

  const buttons = Array.apply(null, {length: size}).map(Number.call, Number).map(i => {
    let text = size === 10 ? `C${reform(i+1)}` : `${reform(8+i)} - ${reform(9+i)}`;
    return (
      <Button
        className={index === i ? 'chosen' : ''}
        key={`choice-${i}`}
        onClick={e => chooseIndex(e, i)}
      >
       {text}
      </Button>
    )}
  );
  return (
    <ButtonToolbar className='index-choice'>
      <ButtonGroup>
        {buttons}
      </ButtonGroup>
    </ButtonToolbar>
  )
}

export default BtnArray;
