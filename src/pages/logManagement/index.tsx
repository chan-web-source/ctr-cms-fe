import React, { useEffect, useState, useCallback } from 'react';
import LeftPanel from '../../components/LeftPanel';
import TableTopPanel from '../../components/TableTopPanel';
import styles from './style.module.css';
import { useAuth } from '../../context/useAuth';
import LogList from './LogList';
import commonStyles from '../../components/commonStyle.module.css';
import { LogManagementData } from '../../types/management';
import { getLogList } from '../../service/managementService';
import Spinner from '../../components/Spinners';

const LogManagement: React.FC = () => {
  const { getLocalToken } = useAuth();
  const [data, setData] = useState<LogManagementData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const debouncedSearch = useCallback(
    async (searchTerm: string) => {
      if (!searchTerm) {
        // If search is empty, fetch all logs
        fetchLogs();
        return;
      }

      setIsSearching(true);
      try {
        const token = getLocalToken();
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await getLogList({ search: searchTerm }, token);
        if (response) {
          setData(response);
        }
      } catch (error) {
        console.error('Error searching logs:', error);
      } finally {
        setIsSearching(false);
      }
    },
    [getLocalToken]
  );

  const fetchLogs = async () => {
    try {
      const params = { all: true };
      const token = getLocalToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
      const response = await getLogList(params, token);
      if (response) {
        setData(response);
      }
    } catch (error) {
      console.error('Error fetching log list:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [getLocalToken]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      debouncedSearch(searchValue);
    }, 500); // 500ms debounce delay

    return () => clearTimeout(timeoutId);
  }, [searchValue, debouncedSearch]);

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  return (
    <div className={`${styles.container} ${commonStyles.pageBackground}`}>
      <LeftPanel />
      <div className={styles.mainContent}>
        <TableTopPanel title="Log Management" eventState="log" />
        <div className={styles.listContainer}>
          {isLoading ? (
            <Spinner />
          ) : (
            <LogList
              title={'Log Activity'}
              data={data}
              setData={setData}
              onSearch={handleSearch}
              searchValue={searchValue}
              isSearching={isSearching}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default LogManagement;
