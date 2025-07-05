import axios from 'axios';
import { toast } from 'react-toastify';
import { ListParams, LogManagementData, UserManagementData } from '../types/management';
import { commonMsgContext } from '../context/handleMsg';

const api = import.meta.env.VITE_API_BASE_URL || '';
// console.log('Environment Variables:', {
//   VITE_API_BASE_URL: api,
//   allEnv: import.meta.env
// });
interface RestResponse<T> {
  data: T;
}

const apiClient = axios.create({
  baseURL: api,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export const getUserList = async (
  params: ListParams,
  token: string
): Promise<UserManagementData[]> => {
  try {
    const response = await apiClient.get<RestResponse<UserManagementData[]>>('/users', {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data?.data;
  } catch (error) {
    console.error('Error fetching user list:', error);
    toast.error(commonMsgContext.serverError.notification);
    throw error;
  }
};

export const getLogList = async (
  params: ListParams,
  token: string
): Promise<LogManagementData[]> => {
  try {
    const response = await apiClient.get<RestResponse<LogManagementData[]>>('/logs', {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data?.data;
  } catch (error) {
    console.error('Error fetching log list:', error);
    toast.error(commonMsgContext.serverError.notification);
    throw error;
  }
};
