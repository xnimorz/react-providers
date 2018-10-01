import React from 'react';

import './styles.css';

export default function Button(props) {
  if (props.href) {
    return <a {...props} className={`button ${props.clicked && 'button_clicked'}`} />;
  }
  return <button {...props} className={`button ${props.clicked && 'button_clicked'}`} />;
}
