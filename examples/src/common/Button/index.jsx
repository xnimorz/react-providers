import React from 'react';

import './styles.css';

export default function Button(props) {
  return <button {...props} className={`button ${props.clicked && 'button_clicked'}`} />;
}
