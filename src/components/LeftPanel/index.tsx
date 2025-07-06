import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';
import style from './style.module.css';
import { useAuth } from '../../context/useAuth';
import { ReactComponent as LayoutDashboardIcon } from '../../assets/Icons/NavigationBar/Admin Dashboard - Default.svg';
import { ReactComponent as UsersIcon } from '../../assets/Icons/NavigationBar/User Management - Default.svg';
import { ReactComponent as SettingsIcon } from '../../assets/Icons/NavigationBar/Security Settings - Default.svg';
import { ReactComponent as LogManagementIcon } from '../../assets/Icons/NavigationBar/Log Management  - Default.svg';
import { ReactComponent as NotificationsIcon } from '../../assets/Icons/NavigationBar/Notifications  - Default.svg';
import { ReactComponent as LogOutIcon } from '../../assets/Icons/NavigationBar/Logout  - Default.svg';
import { ReactComponent as ExpandIcon } from '../../assets/Icons/NavigationBar/Expend.svg';
import commonStyles from '../commonStyle.module.css';

interface PanelKey {
  panelKey: 'dashboard' | 'users' | 'security' | 'log' | 'notifications' | 'logout';
}

const LeftPanel = () => {
  const { logout } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activePanel, setActivePanel] = useState(localStorage.getItem('panel') || 'dashboard');
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname.split('/')[1] || 'dashboard';
    if (path === 'user') {
      localStorage.setItem('panel', 'users');
      setActivePanel('users');
    } else if (localStorage.getItem('panel') !== path) {
      localStorage.setItem('panel', path);
      setActivePanel(path);
    }
  }, [location]);

  const handleNavClick = (panelKey: PanelKey['panelKey']) => {
    localStorage.setItem('panel', panelKey);
    setActivePanel(panelKey);
  };

  return (
    <nav
      className={`${commonStyles.borderRadius} ${style.leftPanel} ${isExpanded ? style.expanded : ''
        }`}
    >
      <div className={style.header}>
        <div className={style.logoSection}>
          <img src={logo} alt="Logo" className={style.logo} />
          {isExpanded && (
            <span className={style.brandName}>
              P.C.
              <br />
              Licensing
            </span>
          )}
        </div>

        <button className={style.expandButton} onClick={() => setIsExpanded(!isExpanded)}>
          <ExpandIcon className={style.icon} />
        </button>
      </div>

      <div className={style.navItems}>
        <Link
          to="/dashboard"
          className={`${style.navItem} ${activePanel === 'dashboard' ? style.active : ''}`}
          onClick={() => handleNavClick('dashboard')}
        >
          <LayoutDashboardIcon className={style.icon} />
          {isExpanded && <span className={style.text}>Admin Dashboard</span>}
        </Link>

        <Link
          to="/user/management"
          className={`${style.navItem} ${activePanel === 'users' ? style.active : ''}`}
          onClick={() => handleNavClick('users')}
        >
          <UsersIcon className={style.icon} />
          {isExpanded && <span className={style.text}>User Management</span>}
        </Link>

        <Link
          to="/security/settings"
          className={`${style.navItem} ${activePanel === 'security' ? style.active : ''}`}
          onClick={() => handleNavClick('security')}
        >
          <SettingsIcon className={style.icon} />
          {isExpanded && <span className={style.text}>Security Settings</span>}
        </Link>

        <Link
          to="/log/management"
          className={`${style.navItem} ${activePanel === 'log' ? style.active : ''}`}
          onClick={() => handleNavClick('log')}
        >
          <LogManagementIcon className={style.icon} />
          {isExpanded && <span className={style.text}>Log Management</span>}
        </Link>
      </div>

      <div className={style.bottomItems}>
        <div
          className={`${style.navItem} ${activePanel === 'notifications' ? style.active : ''}`}
          onClick={() => handleNavClick('notifications')}
        >
          <NotificationsIcon className={style.icon} />
          {isExpanded && <span className={style.text}>Notifications</span>}
        </div>

        <a
          onClick={() => {
            handleNavClick('logout');
            logout();
          }}
          className={style.navItem}
        >
          <LogOutIcon className={style.icon} />
          {isExpanded && <span className={style.text}>Logout</span>}
        </a>
      </div>
    </nav>
  );
};

export default LeftPanel;
