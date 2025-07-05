import React from 'react';
import styles from './style.module.css';
import { ReactComponent as LayoutDashboardIcon } from '../../assets/Icons/NavigationBar/Admin Dashboard - Default.svg';
import { ReactComponent as UsersIcon } from '../../assets/Icons/NavigationBar/User Management - Default.svg';
import { ReactComponent as SettingsIcon } from '../../assets/Icons/NavigationBar/Security Settings - Default.svg';
import { ReactComponent as LogManagementIcon } from '../../assets/Icons/NavigationBar/Log Management  - Default.svg';
import { ReactComponent as NotificationsIcon } from '../../assets/Icons/NavigationBar/Notifications  - Default.svg';

interface TableTopPanelProps {
  title: string;
  eventState?: 'dashboard' | 'users' | 'settings' | 'log' | 'notifications';
}

const TableTopPanel: React.FC<TableTopPanelProps> = ({ title, eventState }) => {
  const getIcon = () => {
    switch (eventState) {
      case 'dashboard':
        return <LayoutDashboardIcon className={styles.icon} />;
      case 'users':
        return <UsersIcon className={styles.icon} />;
      case 'settings':
        return <SettingsIcon className={styles.icon} />;
      case 'log':
        return <LogManagementIcon className={styles.icon} />;
      case 'notifications':
        return <NotificationsIcon className={styles.icon} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        {eventState && <div className={styles.iconContainer}>{getIcon()}</div>}
        {title}
      </h1>
    </div>
  );
};

export default TableTopPanel;
