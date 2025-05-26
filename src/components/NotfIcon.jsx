import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import '../css/NotifIcon.css';

const NotifIcon = () => {
  return (
    <button aria-label="Notificações" className="notif-button">
      <FontAwesomeIcon icon={faBell} />
    </button>
  );
};

export default NotifIcon;
