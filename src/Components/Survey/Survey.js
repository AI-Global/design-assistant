import React, { useState } from 'react';

import Input from './Input.js';

export default function Survey(props) {
  const { questionName } = props;

  return <Input questionName={questionName}></Input>;
}
