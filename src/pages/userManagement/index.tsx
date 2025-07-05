import React, { useEffect, useState } from 'react';
import LeftPanel from '../../components/LeftPanel';
import TableTopPanel from '../../components/TableTopPanel';
import styles from './style.module.css';
import { useAuth } from '../../context/useAuth';
import UserList from './UserList';
import commonStyles from '../../components/commonStyle.module.css';
import { UserManagementData } from '../../types/management';
import { getUserList } from '../../service/managementService';
import Spinner from '../../components/Spinners';

const UserManagement: React.FC = () => {
  const { getLocalToken } = useAuth();
  const [data, setData] = useState<UserManagementData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const params = { all: true };
        const token = getLocalToken();
        if (!token) {
          throw new Error('No authentication token found');
        }
        const response = await getUserList(params, token);
        if (response) {
          setData(response);
        }
      } catch (error) {
        setIsLoading(false);
        console.error('Error fetching user list:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [getLocalToken]);

  return (
    <div className={`${styles.container} ${commonStyles.pageBackground}`}>
      <LeftPanel />
      <div className={styles.mainContent}>
        <TableTopPanel title="User Management" eventState="users" />
        <div className={styles.listContainer}>
          {isLoading ? (
            <Spinner />
          ) : (
            <UserList title={'List of Users'} data={data} setData={setData} />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
