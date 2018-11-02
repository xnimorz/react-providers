import React from 'react';

import './styles.css';

export default function MenuButton({ clicked, ...props }) {
  if (props.href) {
    return <a {...props} className={`menuButton ${clicked ? 'menuButton_active' : ''}`} />;
  }
  return <button {...props} className={`menuButton ${clicked ? 'menuButton_active' : ''}`} />;
}
