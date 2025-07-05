import React from 'react';
import LeftPanel from '../../components/LeftPanel';
import TableTopPanel from '../../components/TableTopPanel';
import styles from './style.module.css';
import commonStyles from '../../components/commonStyle.module.css';

const UserManagement: React.FC = () => {
  return (
    <div className={`${styles.container} ${commonStyles.pageBackground}`}>
      <LeftPanel />
      <div className={styles.mainContent}>
        <TableTopPanel title="Coming Soon" />
        <div className={styles.comingSoonContent}>
          <h1>Coming Soon</h1>
          <p>This page is under construction. Please check back later.</p>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
