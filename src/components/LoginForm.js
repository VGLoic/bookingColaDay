import React from 'react';

/* Components */
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

const LoginForm = ({
  firstKey,
  secondKey,
  handleSubmit,
  handleChange,
  intermediaryValidation,
  errors
}) => {
  const validInputClass = intermediaryValidation ? 'is-valid' : '';
  const submitText = intermediaryValidation ? 'Login' : 'Verify';
  const btnClass = intermediaryValidation ? 'moved' : '';
  const showSecondInputClass = intermediaryValidation ? 'show' : '';
  const invalidClass = errors ? 'is-invalid' : '';
  return (
    <Form onSubmit={e => handleSubmit(e)}>
      <FormGroup className={`first-form`}>
        <Label for='firstKey' hidden>Place your pass here</Label>
        <Input
          className={`${invalidClass} ${validInputClass} text-center`}
          type='text'
          id='firstKey'
          name='firstKey'
          value={firstKey}
          onChange={handleChange}
          placeholder='Copy your first pass'
        />
      </FormGroup>
      <FormGroup className={`second-form fade ${showSecondInputClass}`}>
        <Label for='secondKey' hidden>Place your pass here</Label>
        <Input
          className={`${invalidClass} text-center`}
          type='password'
          id='secondKey'
          name='secondKey'
          value={secondKey}
          onChange={handleChange}
          placeholder='Copy your second pass'
        />
      </FormGroup>
      <Button className={btnClass}>{submitText}</Button>
    </Form>
  );
}

export default LoginForm;
