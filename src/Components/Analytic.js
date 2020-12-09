import React from 'react';

const Analytic = ({ iframe }) => {
  return <span dangerouslySetInnerHTML={{ __html: iframe }} />;
};

export default Analytic;
