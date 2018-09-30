import React from 'react';

import './styles.css';
export default function Input(props) {
  // We allow to ovverride default className input
  return <input className="input" {...props} />;
}
