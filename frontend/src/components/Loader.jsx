import React from 'react';
import { Spinner } from 'react-bootstrap';

const Loader = () => {
  return (
    <Spinner
      animation="border"
      role="status"
      style={{
        width: '50px', // Adjust the width to make it shorter
        height: '50px', // Adjust the height to make it shorter
        margin: 'auto',
        display: 'block',
        color: 'green', // Set the color to red
      }}
    >
      <span className='sr-only'>Loading...</span>
    </Spinner>
  );
};

export default Loader;